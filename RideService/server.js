const express = require('express');
const server = express();
const RideRoutes = require('./routes/RideRoutes');
const rabbitMQ = require('./service/rabbit');
const connectDB = require('./db/connection');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();
connectDB();
(
  async () => {
    try {
      await rabbitMQ.connect();
      
      server.use(express.json());
      server.use(cors({
        origin: ['http://localhost:5173','http://localhost:5174'],
        credentials: true,
      }));
      server.use(cookieParser());
      server.use('/ride', RideRoutes);

      server.get('/', (req, res) => {
        res.send('Welcome to the ride service Home page\n');
      });

      server.listen(4003, () => {
        console.log(`Ride service running at port 4003`);
      });
    } catch (error) {
      console.error(error.message);

    }
  }
)();
