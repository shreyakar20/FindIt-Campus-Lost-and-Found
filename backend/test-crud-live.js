/**
 * Complete End-to-End Live CRUD Verification Test
 * Uses MongoMemoryServer to run actual MongoDB queries and HTTP requests
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const assert = require('assert');

async function runLiveVerification() {
  console.log('========================================================');
  console.log('🚀 Starting Full Live MongoDB & Express CRUD Test');
  console.log('========================================================\n');

  let mongoServer;
  let server;
  const PORT = 5077;

  try {
    // 1. Start In-Memory MongoDB Server
    console.log('1. Starting In-Memory MongoDB instance...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log(`   MongoDB Memory Server running at: ${uri}`);

    // Set MONGO_URI environment variable
    process.env.MONGO_URI = uri;

    // Connect Mongoose to the in-memory server
    await mongoose.connect(uri);
    console.log('   Mongoose connected to MongoDB instance successfully.');

    // 2. Start Express Server
    const app = require('./server');
    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`2. Express Server listening on http://localhost:${PORT}\n`);
        resolve();
      });
    });

    const API = `http://localhost:${PORT}/api`;

    // 3. Test Health Check
    console.log('--- Testing GET /api/health ---');
    const healthRes = await fetch(`${API}/health`);
    const healthData = await healthRes.json();
    console.log('   Response:', healthData);
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthData.status, 'healthy');
    assert.strictEqual(healthData.database, 'connected');
    console.log('   ✅ Health check passed (Database connected)\n');

    // 4. Test POST /api/items (Create Item 1)
    console.log('--- Testing POST /api/items (Create Lost Item) ---');
    const item1Payload = {
      itemName: 'Space Grey MacBook Air M2',
      type: 'Lost',
      category: 'Electronics',
      description: 'Laptop in blue sleeve with university sticker on top cover',
      location: 'Science Library, 3rd Floor Desk 12',
      date: '2026-10-27',
      contact: 'student.dev@campus.edu | (555) 123-4567',
      status: 'Lost'
    };

    const postRes1 = await fetch(`${API}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item1Payload)
    });
    const postData1 = await postRes1.json();
    console.log('   Response status:', postRes1.status);
    console.log('   Created Item:', postData1.data?.itemName, `[ID: ${postData1.data?._id}]`);
    assert.strictEqual(postRes1.status, 201);
    assert.strictEqual(postData1.success, true);
    assert.strictEqual(postData1.data.itemName, item1Payload.itemName);
    const item1Id = postData1.data._id;
    console.log('   ✅ Item 1 created and persisted in MongoDB\n');

    // 5. Test POST /api/items (Create Item 2)
    console.log('--- Testing POST /api/items (Create Found Item) ---');
    const item2Payload = {
      itemName: 'Campus Student ID Card',
      type: 'Found',
      category: 'Documents/ID Cards',
      description: 'Engineering department student ID for Marcus Chen',
      location: 'Student Union Cafeteria Desk',
      date: '2026-10-28',
      contact: 'union.reception@campus.edu',
      status: 'Found'
    };

    const postRes2 = await fetch(`${API}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item2Payload)
    });
    const postData2 = await postRes2.json();
    assert.strictEqual(postRes2.status, 201);
    const item2Id = postData2.data._id;
    console.log('   Created Item 2:', postData2.data?.itemName, `[ID: ${item2Id}]`);
    console.log('   ✅ Item 2 created and persisted in MongoDB\n');

    // 6. Test GET /api/items (Retrieve All Items)
    console.log('--- Testing GET /api/items (Retrieve All) ---');
    const getRes = await fetch(`${API}/items`);
    const getData = await getRes.json();
    console.log('   Retrieved count:', getData.count);
    assert.strictEqual(getRes.status, 200);
    assert.strictEqual(getData.success, true);
    assert.strictEqual(getData.count, 2);
    console.log('   ✅ Successfully retrieved 2 items from MongoDB\n');

    // 7. Test Query Filtering: Status filter
    console.log('--- Testing GET /api/items?status=Lost ---');
    const filterStatusRes = await fetch(`${API}/items?status=Lost`);
    const filterStatusData = await filterStatusRes.json();
    assert.strictEqual(filterStatusData.count, 1);
    assert.strictEqual(filterStatusData.data[0].status, 'Lost');
    console.log('   ✅ Status filter working: returned only Lost items\n');

    // 8. Test Query Filtering: Category filter
    console.log('--- Testing GET /api/items?category=Electronics ---');
    const filterCatRes = await fetch(`${API}/items?category=Electronics`);
    const filterCatData = await filterCatRes.json();
    assert.strictEqual(filterCatData.count, 1);
    assert.strictEqual(filterCatData.data[0].category, 'Electronics');
    console.log('   ✅ Category filter working: returned only Electronics\n');

    // 9. Test Query Search: Keyword search
    console.log('--- Testing GET /api/items?search=MacBook ---');
    const searchRes = await fetch(`${API}/items?search=MacBook`);
    const searchData = await searchRes.json();
    assert.strictEqual(searchData.count, 1);
    assert.strictEqual(searchData.data[0].itemName, item1Payload.itemName);
    console.log('   ✅ Search working: successfully matched "MacBook"\n');

    // 10. Test GET /api/items/:id (Single Item)
    console.log(`--- Testing GET /api/items/${item1Id} ---`);
    const getOneRes = await fetch(`${API}/items/${item1Id}`);
    const getOneData = await getOneRes.json();
    assert.strictEqual(getOneRes.status, 200);
    assert.strictEqual(getOneData.data._id, item1Id);
    console.log('   ✅ Retrieved single item by ObjectId\n');

    // 11. Test PUT /api/items/:id (Update & Mark as Returned)
    console.log(`--- Testing PUT /api/items/${item1Id} (Update status to Returned) ---`);
    const updatePayload = {
      status: 'Returned',
      description: 'Reunited with student owner on Oct 28'
    };
    const putRes = await fetch(`${API}/items/${item1Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const putData = await putRes.json();
    assert.strictEqual(putRes.status, 200);
    assert.strictEqual(putData.data.status, 'Returned');
    assert.strictEqual(putData.data.description, updatePayload.description);
    console.log('   ✅ Item updated: Status changed to "Returned"\n');

    // Verify persistence in MongoDB by re-fetching
    const verifyUpdateRes = await fetch(`${API}/items/${item1Id}`);
    const verifyUpdateData = await verifyUpdateRes.json();
    assert.strictEqual(verifyUpdateData.data.status, 'Returned');
    console.log('   ✅ Verified update persisted in MongoDB database\n');

    // 12. Test DELETE /api/items/:id (Delete Item)
    console.log(`--- Testing DELETE /api/items/${item1Id} ---`);
    const delRes = await fetch(`${API}/items/${item1Id}`, {
      method: 'DELETE'
    });
    const delData = await delRes.json();
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delData.success, true);
    console.log('   ✅ Item successfully deleted from MongoDB\n');

    // Verify item is gone (should return 404)
    const checkDeletedRes = await fetch(`${API}/items/${item1Id}`);
    assert.strictEqual(checkDeletedRes.status, 404);
    console.log('   ✅ Verified deleted item returns 404 Not Found\n');

    // Verify remaining count
    const finalGetRes = await fetch(`${API}/items`);
    const finalGetData = await finalGetRes.json();
    assert.strictEqual(finalGetData.count, 1);
    console.log(`   ✅ Remaining items count in MongoDB: ${finalGetData.count} (Expected: 1)\n`);

    console.log('========================================================');
    console.log('🎉 ALL LIVE CRUD END-TO-END TESTS PASSED SUCCESSFULLY!');
    console.log('========================================================');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Cleanup complete. Exiting.');
    process.exit(process.exitCode || 0);
  }
}

runLiveVerification();
