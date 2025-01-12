const express = require('express');
const server = express();
const captainRoutes = require('./routes/CaptainRoutes');
const rabbitMQ=require('./service/rabbit');
const connectDB = require('./db/connection');
require('dotenv').config();
connectDB();
(
  async () => {
    try {
      await rabbitMQ.connect();
      
      server.use(express.json());
      server.use('/captain', captainRoutes);

      server.get('/', (req, res) => {
        res.send('Welcome to the express Home page\n');
      });

      server.listen(4002, () => {
        console.log(`Server running at port 4002`);
      });
    } catch (error) {
      console.error(error);
      
    }
  }
)();
