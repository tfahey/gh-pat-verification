#!/usr/bin/env node

const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';

async function examineToken(token) {
  if (!token) {
    console.error('Error: GitHub token is required');
    console.error('Usage: node src/index.js <GITHUB_TOKEN>');
    console.error('Or set GITHUB_TOKEN environment variable');
    process.exit(1);
  }

  try {
    console.log('🔍 Examining GitHub PAT...\n');

    // Get current user info and token metadata
    const authResponse = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    // Create a request to capture response headers which contain token info
    const headersResponse = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const user = authResponse.data;
    const responseHeaders = headersResponse.headers;

    // Display token attributes
    console.log('═'.repeat(60));
    console.log('TOKEN ATTRIBUTES');
    console.log('═'.repeat(60));

    // X-OAuth-Scopes
    const scopes = responseHeaders['x-oauth-scopes'];
    console.log('\n📋 X-OAuth-Scopes:');
    if (scopes) {
      const scopeList = scopes.split(', ').filter(s => s);
      if (scopeList.length > 0) {
        scopeList.forEach(scope => {
          console.log(`   ✓ ${scope}`);
        });
      } else {
        console.log('   (no scopes)');
      }
    } else {
      console.log('   (no scopes)');
    }

    // Other GitHub API response headers
    console.log('\n📊 Additional Headers:');
    console.log(`   X-RateLimit-Limit: ${responseHeaders['x-ratelimit-limit']}`);
    console.log(`   X-RateLimit-Remaining: ${responseHeaders['x-ratelimit-remaining']}`);
    console.log(`   X-RateLimit-Reset: ${new Date(parseInt(responseHeaders['x-ratelimit-reset']) * 1000).toISOString()}`);

    // User info
    console.log('\n👤 Authenticated User:');
    console.log(`   Login: ${user.login}`);
    console.log(`   Name: ${user.name || '(not set)'}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Type: ${user.type}`);

    // Account info
    console.log('\n🔐 Account Information:');
    console.log(`   Created At: ${user.created_at}`);
    console.log(`   Updated At: ${user.updated_at}`);
    console.log(`   Public Repos: ${user.public_repos}`);
    console.log(`   Public Gists: ${user.public_gists}`);

    // Permissions indicator
    console.log('\n🔑 Permissions Check:');
    try {
      // Try to access admin resources to infer permissions
      await axios.head(`${GITHUB_API_URL}/admin/users`, {
        headers: {
          Authorization: `token ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      console.log('   ✓ Has admin access');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log('   ✗ No admin access (expected for regular tokens)');
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('Token examination completed successfully!');
    console.log('═'.repeat(60));

  } catch (error) {
    if (error.response) {
      console.error('\n❌ Error from GitHub API:');
      console.error(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);

      if (error.response.status === 401) {
        console.error('\n   The token appears to be invalid or expired.');
      }
    } else if (error.message) {
      console.error('\n❌ Error:', error.message);
    } else {
      console.error('\n❌ An unexpected error occurred');
    }
    process.exit(1);
  }
}

// Get token from command line argument or environment variable
const token = process.argv[2] || process.env.GITHUB_TOKEN;

examineToken(token);
