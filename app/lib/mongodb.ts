import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
console.log('🔗 MongoDB URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

const options = {
  tls: true,
  tlsAllowInvalidCertificates: false,
  retryWrites: true,
  w: 1,
  // Add these options to fix SSL issues
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  // Remove tlsInsecure - it conflicts with tlsAllowInvalidCertificates
  directConnection: false
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log('🚀 Creating new MongoDB client...');
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().then((connectedClient) => {
      console.log('✅ MongoDB connected successfully');
      return connectedClient;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
