import mongoose from 'mongoose';

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  throw new Error('Please add your Mongo URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Log the URI format (without credentials) to verify it's correct
console.log('MongoDB URI format:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'));

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log('Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 5,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true
      };

      console.log('Attempting to connect to MongoDB...');
      
      // Test the connection string format
      if (!MONGODB_URI.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB URI format. Must start with mongodb+srv://');
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongooseInstance: typeof mongoose) => {
          console.log('MongoDB connected successfully');
          cached.conn = mongooseInstance;
          return mongooseInstance;
        })
        .catch((error: Error) => {
          console.error('MongoDB connection error:', error);
          cached.promise = null;
          throw error;
        });
    }

    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance;
    return mongooseInstance;
  } catch (error: unknown) {
    console.error('Error in connectToDatabase:', error);
    cached.promise = null;
    throw error;
  }
}

// Export a module-scoped MongoClient promise
export default cached.promise; 