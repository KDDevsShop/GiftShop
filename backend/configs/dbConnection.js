import mongoose from 'mongoose';

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;

  const connect = async (uri) => {
    try {
      const conn = await mongoose.connect(uri);

      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(`Fail to connect to ${uri}. Error: ${error.message}`);

      return false;
    }

    return true;
  };

  if (await connect(uri)) {
    console.log(`Conneted to db`);
  } else {
    console.log(`Fail to connect to db`);
  }
};
