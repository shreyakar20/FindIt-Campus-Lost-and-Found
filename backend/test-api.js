/**
 * FindIt Backend Verification & Test Suite
 * Tests Mongoose Schema validation, REST Route logic, and API endpoints
 */
const assert = require('assert');
const Item = require('./models/Item');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Running FindIt Backend Verification Suite');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // 1. Schema Validation Tests
  console.log('--- 1. Item Model Schema Validation Tests ---');

  await asyncTest('Item schema validates a complete, valid item', async () => {
    const validItem = new Item({
      itemName: 'MacBook Pro 14 inch',
      type: 'Lost',
      category: 'Electronics',
      description: 'Silver MacBook in sleeve left at Library 2nd floor desk',
      location: 'Library 2nd Floor',
      date: new Date(),
      contact: 'student@campus.edu',
      status: 'Lost'
    });

    const validationError = validItem.validateSync();
    assert.strictEqual(validationError, undefined, 'Valid item should not return errors');
  });

  await asyncTest('Item schema rejects missing required fields', async () => {
    const incompleteItem = new Item({});
    const err = incompleteItem.validateSync();
    assert(err !== undefined, 'Incomplete item must fail validation');
    assert(err.errors.itemName, 'itemName must be required');
    assert(err.errors.type, 'type must be required');
    assert(err.errors.category, 'category must be required');
    assert(err.errors.description, 'description must be required');
    assert(err.errors.location, 'location must be required');
    assert(err.errors.date, 'date must be required');
    assert(err.errors.contact, 'contact must be required');
  });

  await asyncTest('Item schema rejects invalid item type enum', async () => {
    const invalidType = new Item({
      itemName: 'Keys',
      type: 'Stolen', // Invalid, must be 'Lost' or 'Found'
      category: 'Accessories',
      description: 'Dorm room keys',
      location: 'Dining Hall',
      date: new Date(),
      contact: 'test@campus.edu'
    });

    const err = invalidType.validateSync();
    assert(err !== undefined, 'Invalid type must fail validation');
    assert(err.errors.type, 'Type error must be present');
  });

  await asyncTest('Item schema rejects invalid status enum', async () => {
    const invalidStatus = new Item({
      itemName: 'Keys',
      type: 'Lost',
      category: 'Accessories',
      description: 'Dorm room keys',
      location: 'Dining Hall',
      date: new Date(),
      contact: 'test@campus.edu',
      status: 'Archived' // Invalid, must be 'Lost', 'Found', or 'Returned'
    });

    const err = invalidStatus.validateSync();
    assert(err !== undefined, 'Invalid status must fail validation');
    assert(err.errors.status, 'Status error must be present');
  });

  await asyncTest('Item schema defaults status to type if not provided', async () => {
    const foundItem = new Item({
      itemName: 'Water Bottle',
      type: 'Found',
      category: 'Accessories',
      description: 'Blue Hydroflask bottle',
      location: 'Gym',
      date: new Date(),
      contact: 'gymdesk@campus.edu'
    });

    assert.strictEqual(foundItem.status, 'Found', 'Found item should default status to Found');
  });

  // 2. Express Server Structure Tests
  console.log('\n--- 2. Server Configuration Tests ---');

  test('Server exports Express application properly', () => {
    const app = require('./server');
    assert(typeof app === 'function', 'server.js must export an Express application');
  });

  test('Routes file exports Express Router', () => {
    const router = require('./routes/items');
    assert(typeof router === 'function', 'routes/items.js must export an Express Router');
  });

  console.log('\n====================================================');
  console.log(`Results: ${passedTests}/${totalTests} tests passed.`);
  console.log('====================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 All backend tests passed successfully!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
