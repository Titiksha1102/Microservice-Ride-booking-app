const express = require('express');
const server = express();
const userRoutes = require('./routes/UserRoutes');
const connectDB = require('./db/connection');
const cors = require('cors');
require('dotenv').config();
(
  async () => {
    try {
      await connectDB();
      server.use(express.json());
      server.use(cors({
        origin: 'http://localhost:5173',
        
      }));
      server.use('/users', userRoutes);

      server.get('/', (req, res) => {
        res.send('Welcome to the user service Home page\n');
      });

      server.listen(4001, () => {
        console.log(`Server running at port 4001`);
      });
    } catch (error) {
      console.log('MongoDB connection error:', error);
    }
  }
)()

