const app = require('./server');

async function testHttp() {
  const PORT = 5055;
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    try {
      // 1. Test /api/health
      const resHealth = await fetch(`http://localhost:${PORT}/api/health`);
      const dataHealth = await resHealth.json();
      console.log('✅ /api/health Response:', dataHealth);

      // 2. Test root /
      const resRoot = await fetch(`http://localhost:${PORT}/`);
      const dataRoot = await resRoot.json();
      console.log('✅ / Response:', dataRoot);

      // 3. Test 404 for unknown route
      const res404 = await fetch(`http://localhost:${PORT}/api/unknown-endpoint`);
      const data404 = await res404.json();
      console.log('✅ 404 Handler Response:', data404);

      // 4. Test POST validation error on /api/items with empty body
      const resPostFail = await fetch(`http://localhost:${PORT}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const dataPostFail = await resPostFail.json();
      console.log('✅ Validation rejection Response (HTTP 400):', dataPostFail);

      console.log('\n🎉 HTTP integration checks passed successfully!');
    } catch (err) {
      console.error('❌ Test failed:', err.message);
      process.exitCode = 1;
    } finally {
      server.close(() => {
        console.log('Test server closed.');
        process.exit(process.exitCode || 0);
      });
    }
  });
}

testHttp();
