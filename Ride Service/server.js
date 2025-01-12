const express = require('express');
const server = express();
const RideRoutes = require('./routes/RideRoutes');
const rabbitMQ=require('./service/rabbit');
const connectDB = require('./db/connection');
require('dotenv').config();
connectDB();
(
  async () => {
    try {
      await rabbitMQ.connect();
      
      server.use(express.json());
      server.use('/ride', RideRoutes);

      server.get('/', (req, res) => {
        res.send('Welcome to the express Home page\n');
      });

      server.listen(4003, () => {
        console.log(`Server running at port 4003`);
      });
    } catch (error) {
      console.error(error);
      
    }
  }
)();
