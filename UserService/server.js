const express = require('express');
const server = express();
const userRoutes = require('./routes/UserRoutes');
const connectDB = require('./db/connection');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();
(
  async () => {
    try {
      await connectDB();
      
      server.use(express.json());
      server.use(cors({
        origin: ['http://localhost:5173',
          'http://localhost:4003',
          'http://localhost:5174',
          'http://user-app.tezzridesapp.click',
        'https://user-app.tezzridesapp.click'],
        credentials: true,
      }));
      server.use(cookieParser());
      server.use('/users', userRoutes);

      server.get('/', (req, res) => {
        res.send('Welcome to the user service Home page\n');
      });

      server.listen(4001, () => {
        console.log(`User service running at port 4001`);
      });
    } catch (error) {
      console.log('User service MongoDB connection error:', error);
    }
  }
)()

