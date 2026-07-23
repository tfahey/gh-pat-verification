// GitHub PAT scope descriptions and documentation

const SCOPE_DESCRIPTIONS = {
  // Full control scopes
  'repo': 'Full control of private repositories',
  'public_repo': 'Access to public repositories',
  'repo:status': 'Access commit status',
  'repo_deployment': 'Access deployment status',

  // Gist scopes
  'gist': 'Create gists',

  // User scopes
  'user': 'Read user profile data',
  'user:email': 'Read private email addresses',
  'user:follow': 'Follow and unfollow users',

  // Organization scopes
  'org:read': 'Read-only access to organization data',
  'org:write': 'Write access to organization data',
  'org:admin': 'Full admin access to organizations',

  // Workflow scopes
  'workflow': 'Update GitHub Actions workflow files',

  // Other scopes
  'admin:gpg_key': 'Manage GPG keys',
  'admin:public_key': 'Manage public SSH keys',
  'admin:repo_hook': 'Write access to hooks on public repositories',
  'admin:org_hook': 'Manage organization hooks',
  'admin:user_hook': 'Write access to user hooks',
  'delete_repo': 'Delete repositories',
  'write:packages': 'Upload packages to GitHub Packages',
  'read:packages': 'Download packages from GitHub Packages',
  'delete:packages': 'Delete packages from GitHub Packages',
  'admin:ssh_signing_key': 'Manage SSH signing keys',
  'admin:gpg_signing_key': 'Manage GPG signing keys',
  'security_events': 'Read and write security events',
};

function getScopeDescription(scope) {
  return SCOPE_DESCRIPTIONS[scope] || 'Unknown scope';
}

function categorizeScopes(scopes) {
  const categories = {
    repo: [],
    user: [],
    org: [],
    admin: [],
    packages: [],
    security: [],
    other: [],
  };

  scopes.forEach(scope => {
    if (scope.startsWith('repo')) {
      categories.repo.push(scope);
    } else if (scope.startsWith('user')) {
      categories.user.push(scope);
    } else if (scope.startsWith('org')) {
      categories.org.push(scope);
    } else if (scope.startsWith('admin')) {
      categories.admin.push(scope);
    } else if (scope.includes('package')) {
      categories.packages.push(scope);
    } else if (scope.includes('security')) {
      categories.security.push(scope);
    } else {
      categories.other.push(scope);
    }
  });

  return categories;
}

module.exports = {
  SCOPE_DESCRIPTIONS,
  getScopeDescription,
  categorizeScopes,
};
