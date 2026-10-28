const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');

// Load environment variables
dotenv.config();

const sampleItems = [
  {
    itemName: 'Apple AirPods Pro (2nd Gen)',
    type: 'Lost',
    category: 'Electronics',
    description: 'White AirPods Pro in a matte black silicon case with a silver carabiner. Lost around table 14.',
    location: 'Central Library, 2nd Floor Quiet Zone',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    contact: 'alex.rivera@campus.edu | (555) 234-5678',
    status: 'Lost'
  },
  {
    itemName: 'Student Campus ID Card',
    type: 'Found',
    category: 'Documents/ID Cards',
    description: 'Student ID card belonging to Marcus Chen, Engineering Dept. Handed over to student center reception desk.',
    location: 'Student Union Cafeteria, Booth #7',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    contact: 'studentcenter.desk@campus.edu | Room 102',
    status: 'Found'
  },
  {
    itemName: 'Thomas Calculus (14th Edition) Textbook',
    type: 'Found',
    category: 'Books',
    description: 'Hardcover textbook with sticky notes inside chapters 4 and 5. Found on a front row desk.',
    location: 'Science Complex, Lecture Hall 301',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    contact: 'prof.sanders.ta@campus.edu',
    status: 'Found'
  },
  {
    itemName: 'Black Fossil Leather Wallet',
    type: 'Lost',
    category: 'Accessories',
    description: 'Bifold leather wallet containing driver license and transit card. Please reach out if found, urgent!',
    location: 'Athletic Center, Basketball Court bleachers',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    contact: 'jordan.lee@campus.edu | (555) 876-5432',
    status: 'Lost'
  },
  {
    itemName: 'Navy Blue College Varsity Hoodie',
    type: 'Lost',
    category: 'Clothing',
    description: 'Size Medium university embroidered hoodie. Left on the bench during afternoon practice.',
    location: 'Campus Track & Field Bleachers',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    contact: 'priya.patel@campus.edu',
    status: 'Lost'
  },
  {
    itemName: 'Texas Instruments TI-84 Plus CE Calculator',
    type: 'Found',
    category: 'Electronics',
    description: 'Mint green graphing calculator with white cover and initials "S.K." written on the back battery cover.',
    location: 'Mathematics Building, Computer Lab B',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    contact: 'labassistant.math@campus.edu',
    status: 'Found'
  },
  {
    itemName: 'Silver Dorm Room Key with Blue Campus Lanyard',
    type: 'Lost',
    category: 'Accessories',
    description: 'Two brass keys and one silver dorm room key on a blue woven university lanyard.',
    location: 'Pathway between West Dorms and Dining Hall',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    contact: 'dorms.reslife@campus.edu or call (555) 345-9876',
    status: 'Lost'
  },
  {
    itemName: 'Dell 65W USB-C Laptop Charger',
    type: 'Found',
    category: 'Electronics',
    description: 'Original black Dell laptop charger with wrapped cord. Reunited with owner on Oct 28.',
    location: 'Engineering Building Lounge',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    contact: 'eng.lounge@campus.edu',
    status: 'Returned'
  }
];

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI is missing in your .env file!');
    console.log('Set your MongoDB Atlas connection string in backend/.env before running seed.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully.');

    // Clear existing items
    const deletedCount = await Item.deleteMany({});
    console.log(`Cleared ${deletedCount.deletedCount} existing items from database.`);

    // Insert sample items
    const inserted = await Item.insertMany(sampleItems);
    console.log(`✅ Successfully seeded ${inserted.length} sample items into MongoDB Atlas!`);

    await mongoose.connection.close();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
