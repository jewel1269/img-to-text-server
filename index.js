import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import ImageRoute from './src/routes/imageRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const dbUri = process.env.MONGODB_URI;
if (!dbUri) {
  console.error('MONGODB_URI is not defined in the environment');
  process.exit(1);
}

mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error: ', err);
    process.exit(1);
  });

// Routes
app.use('/api/v1', ImageRoute);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, err => {
  if (err) {
    console.error('Server startup error: ', err);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});
