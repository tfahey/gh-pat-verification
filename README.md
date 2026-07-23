# GitHub PAT Verification Tool

A comprehensive Node.js project for examining GitHub classic personal access tokens (PATs) and retrieving their attributes, including scopes, permissions, metadata, and API rate limit information.

## 📋 Project Structure

### Core Files

- **[src/index.js](src/index.js)** — Main CLI tool to examine a PAT and display all token attributes
- **[src/tokenAnalyzer.js](src/tokenAnalyzer.js)** — Reusable `TokenAnalyzer` class for programmatic token analysis
- **[src/scopeDescriptions.js](src/scopeDescriptions.js)** — Scope documentation, descriptions, and categorization utilities
- **[tests/test.js](tests/test.js)** — Comprehensive test suite for all token analysis features

### Configuration Files

- **package.json** — Project metadata and dependencies
- **.gitignore** — Git ignore rules for dependencies and environment files

## 🎯 Key Features

### 1. Token Metadata Retrieval
- Fetches authenticated user information via GitHub API v2022-11-28
- Extracts and displays X-OAuth-Scopes from response headers
- Retrieves rate limit information (limit, remaining, reset time)
- Shows user profile details (login, name, ID, account type, creation date)

### 2. Scope Analysis
- Extracts and displays all granted scopes from the `X-OAuth-Scopes` header
- Provides human-readable descriptions for each scope
- Categorizes scopes into logical groups:
  - **repo** — Repository access permissions
  - **user** — User profile permissions
  - **org** — Organization permissions
  - **admin** — Administrative capabilities
  - **packages** — GitHub Packages permissions
  - **security** — Security-related permissions
  - **other** — Miscellaneous permissions

### 3. Permission Testing
- Tests access to various GitHub API endpoints
- Returns permission status for:
  - `/user/repos` — Repository access
  - `/user/gists` — Gist access
  - `/user/orgs` — Organization access
  - `/user/followers` — Follower data access
  - `/user/installations` — App installations access

### 4. Error Handling
- Provides clear error messages for invalid or expired tokens
- Handles network errors and API rate limiting
- Includes status code interpretation

## 🛠 Technical Details

### Dependencies

- **axios** (^1.6.0) — HTTP client for GitHub API requests

### API Endpoints Used

- `GET /user` — Retrieve authenticated user information and token metadata
- `HEAD /user/repos`, `/user/gists`, etc. — Test endpoint permissions

### Response Headers Captured

- `x-oauth-scopes` — Comma-separated list of granted scopes
- `x-ratelimit-limit` — Maximum API requests per hour
- `x-ratelimit-remaining` — Remaining API requests
- `x-ratelimit-reset` — Unix timestamp when rate limit resets

### Authentication Method

- Bearer token authentication via `Authorization: token <PAT>` header
- Uses GitHub API v2022-11-28

## 📦 Installation

```bash
# Clone or navigate to the project directory
cd gh-pat-verification

# Install dependencies
npm install
```

## 🚀 Usage

### Command Line

```bash
# Run with token as command-line argument
node src/index.js ghp_your_token_here

# Or use environment variable
GITHUB_TOKEN=ghp_your_token_here node src/index.js

# Using the start script
npm start -- ghp_your_token_here
```

### Programmatic Usage

```javascript
const TokenAnalyzer = require('./src/tokenAnalyzer');

const analyzer = new TokenAnalyzer('ghp_your_token_here');

// Get full analysis
const analysis = await analyzer.getFullAnalysis();
console.log(analysis.scopes);        // Array of scopes
console.log(analysis.user.login);    // GitHub username
console.log(analysis.permissions);   // Permission test results

// Extract scopes from headers
const metadata = await analyzer.getTokenMetadata();
const scopes = analyzer.extractScopes(metadata.headers);

// Check specific permission
const repoAccess = await analyzer.checkPermission('/user/repos');
console.log(repoAccess.allowed); // true or false
```

### Testing

```bash
# Run the test suite (requires GITHUB_TOKEN environment variable)
GITHUB_TOKEN=ghp_your_token_here npm test

# Or directly
node tests/test.js
```

## 📊 Output Example

The CLI tool produces formatted output displaying:

```
═════════════════════════════════════════════════════════════
TOKEN ATTRIBUTES
═════════════════════════════════════════════════════════════

📋 X-OAuth-Scopes:
   ✓ repo
   ✓ gist
   ✓ user:email

📊 Additional Headers:
   X-RateLimit-Limit: 60
   X-RateLimit-Remaining: 59
   X-RateLimit-Reset: 2026-07-23T14:30:00.000Z

👤 Authenticated User:
   Login: username
   Name: User Name
   ID: 12345678
   Type: User

🔐 Account Information:
   Created At: 2020-01-15T10:30:00Z
   Updated At: 2026-07-23T12:00:00Z
   Public Repos: 42
   Public Gists: 5

🔑 Permissions Check:
   ✗ No admin access (expected for regular tokens)

═════════════════════════════════════════════════════════════
Token examination completed successfully!
═════════════════════════════════════════════════════════════
```

## 📚 Scope Reference

### Common Scopes

| Scope | Permission |
|-------|-----------|
| `repo` | Full control of private repositories |
| `public_repo` | Access to public repositories only |
| `gist` | Create gists |
| `user` | Read user profile data |
| `user:email` | Read private email addresses |
| `admin:repo_hook` | Write access to repository hooks |
| `workflow` | Update GitHub Actions workflow files |
| `delete_repo` | Delete repositories |

## 🔒 Security Notes

- This tool requires a valid GitHub PAT with appropriate scopes
- Tokens should be treated as secrets — never commit them to version control
- Use environment variables or command-line arguments to pass tokens
- The `.gitignore` file is configured to exclude sensitive data

## 📋 Environment Variables

- `GITHUB_TOKEN` — Your GitHub personal access token (classic PAT format)

## 🧪 Testing

The test suite verifies:
- TokenAnalyzer initialization
- Token metadata retrieval
- Scope extraction and parsing
- Scope categorization
- Permission checks
- Full analysis compilation

Run with: `npm test` or `node tests/test.js`

## 📝 License

MIT

## 🤝 Contributing

Feel free to extend this tool with additional features such as:
- Support for GitHub Apps and fine-grained tokens
- Export analysis results to JSON/CSV
- Scope usage tracking
- Token expiration alerts
