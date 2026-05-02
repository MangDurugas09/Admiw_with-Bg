const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection settings - update these to match your environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'electripay';

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@electripay.ph',
  username: 'admin',
  password: 'admin123',
  name: 'System Administrator',
  role: 'admin',
  active: true,
  status: 'active'
};

async function seedAdmin() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('Connected to MongoDB');
    const db = client.db(DATABASE_NAME);
    const adminCollection = db.collection('admin-side');
    
    // Check if admin already exists
    const existingAdmin = await adminCollection.findOne({
      $or: [
        { email: ADMIN_CREDENTIALS.email },
        { username: ADMIN_CREDENTIALS.username }
      ]
    });
    
    if (existingAdmin) {
      console.log('Admin account already exists:');
      console.log(`Email: ${existingAdmin.email || existingAdmin.admin_email}`);
      console.log(`Username: ${existingAdmin.username || existingAdmin.userName}`);
      console.log('Password: (unchanged)');
      return;
    }
    
    // Create admin document
    const adminDoc = {
      _id: new ObjectId(),
      email: ADMIN_CREDENTIALS.email,
      admin_email: ADMIN_CREDENTIALS.email,
      username: ADMIN_CREDENTIALS.username,
      userName: ADMIN_CREDENTIALS.username,
      name: ADMIN_CREDENTIALS.name,
      admin_name: ADMIN_CREDENTIALS.name,
      password: ADMIN_CREDENTIALS.password,
      pass: ADMIN_CREDENTIALS.password,
      role: ADMIN_CREDENTIALS.role,
      active: ADMIN_CREDENTIALS.active,
      status: ADMIN_CREDENTIALS.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert admin document
    const result = await adminCollection.insertOne(adminDoc);
    
    console.log('Admin account created successfully!');
    console.log('=====================================');
    console.log('Login Credentials:');
    console.log(`Email: ${ADMIN_CREDENTIALS.email}`);
    console.log(`Username: ${ADMIN_CREDENTIALS.username}`);
    console.log(`Password: ${ADMIN_CREDENTIALS.password}`);
    console.log('=====================================');
    console.log('You can now use these credentials to log into the admin panel.');
    
  } catch (error) {
    console.error('Error seeding admin account:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the seed function
seedAdmin();
