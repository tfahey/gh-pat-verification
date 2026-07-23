// Token analyzer utility for detailed PAT examination

const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';

class TokenAnalyzer {
  constructor(token) {
    this.token = token;
    this.client = axios.create({
      baseURL: GITHUB_API_URL,
      headers: {
        Authorization: `token ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  async getTokenMetadata() {
    try {
      const response = await this.client.get('/user');
      return {
        user: response.data,
        headers: response.headers,
      };
    } catch (error) {
      throw new Error(`Failed to get token metadata: ${error.message}`);
    }
  }

  extractScopes(headers) {
    const scopes = headers['x-oauth-scopes'];
    if (!scopes) return [];
    return scopes.split(', ').filter(s => s.trim());
  }

  async checkPermission(endpoint) {
    try {
      const response = await this.client.head(endpoint);
      return { allowed: true, status: response.status };
    } catch (error) {
      if (error.response?.status === 403) {
        return { allowed: false, status: 403, reason: 'Forbidden' };
      }
      return { allowed: false, status: error.response?.status, reason: error.message };
    }
  }

  async analyzePermissions() {
    const permissions = {
      repo: await this.checkPermission('/user/repos'),
      gists: await this.checkPermission('/user/gists'),
      organizations: await this.checkPermission('/user/orgs'),
      followers: await this.checkPermission('/user/followers'),
      installations: await this.checkPermission('/user/installations'),
    };
    return permissions;
  }

  async getFullAnalysis() {
    const metadata = await this.getTokenMetadata();
    const scopes = this.extractScopes(metadata.headers);
    const permissions = await this.analyzePermissions();

    return {
      user: metadata.user,
      scopes,
      headers: {
        'x-oauth-scopes': metadata.headers['x-oauth-scopes'],
        'x-ratelimit-limit': metadata.headers['x-ratelimit-limit'],
        'x-ratelimit-remaining': metadata.headers['x-ratelimit-remaining'],
        'x-ratelimit-reset': metadata.headers['x-ratelimit-reset'],
      },
      permissions,
    };
  }
}

module.exports = TokenAnalyzer;
