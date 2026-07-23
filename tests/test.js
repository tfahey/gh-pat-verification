#!/usr/bin/env node

const TokenAnalyzer = require('../src/tokenAnalyzer');
const { categorizeScopes, getScopeDescription } = require('../src/scopeDescriptions');

async function runTests() {
  console.log('🧪 Running PAT Verification Tests...\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('⚠️  GITHUB_TOKEN environment variable not set');
    console.error('Set a valid token to run tests');
    return;
  }

  try {
    console.log('Test 1: TokenAnalyzer initialization');
    const analyzer = new TokenAnalyzer(token);
    console.log('✓ TokenAnalyzer created successfully\n');

    console.log('Test 2: Get token metadata');
    const metadata = await analyzer.getTokenMetadata();
    console.log(`✓ Retrieved metadata for user: ${metadata.user.login}\n`);

    console.log('Test 3: Extract scopes');
    const scopes = analyzer.extractScopes(metadata.headers);
    console.log(`✓ Found ${scopes.length} scopes:`);
    scopes.forEach(scope => {
      console.log(`  - ${scope}: ${getScopeDescription(scope)}`);
    });
    console.log();

    console.log('Test 4: Categorize scopes');
    const categorized = categorizeScopes(scopes);
    console.log('✓ Scopes categorized:');
    Object.entries(categorized).forEach(([category, scopeList]) => {
      if (scopeList.length > 0) {
        console.log(`  ${category}: ${scopeList.join(', ')}`);
      }
    });
    console.log();

    console.log('Test 5: Analyze permissions');
    const permissions = await analyzer.analyzePermissions();
    console.log('✓ Permission checks completed:');
    Object.entries(permissions).forEach(([resource, result]) => {
      const status = result.allowed ? '✓' : '✗';
      console.log(`  ${status} ${resource}: ${result.status}`);
    });
    console.log();

    console.log('Test 6: Full analysis');
    const analysis = await analyzer.getFullAnalysis();
    console.log('✓ Full analysis completed');
    console.log(`  User: ${analysis.user.login}`);
    console.log(`  Scopes: ${analysis.scopes.length}`);
    console.log(`  Rate limit: ${analysis.headers['x-ratelimit-remaining']}/${analysis.headers['x-ratelimit-limit']}`);
    console.log();

    console.log('✅ All tests passed!\n');

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    process.exit(1);
  }
}

runTests();
