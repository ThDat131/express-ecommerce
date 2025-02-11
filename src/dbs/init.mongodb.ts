import mongoose from 'mongoose';
import config from '../configs/config';
const connectDB = (() => {
  const { host, name, port } = config.db;

  try {
    let instance: typeof mongoose;

    return async () => {
      if (!instance) {
        instance = await mongoose.connect(`mongodb://${host}:${port}/${name}`);
        console.log('MongoDB Connected');
      }
      return instance;
    };
  } catch (err) {
    console.log('MongoDB Connect Failed');
    throw new Error('Failed to connect mongo');
  }
})();

export default connectDB;
