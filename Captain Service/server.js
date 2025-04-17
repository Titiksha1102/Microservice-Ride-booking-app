const express = require('express');
const server = express();
const captainRoutes = require('./routes/CaptainRoutes');
const rabbitMQ=require('./service/rabbit');
const connectDB = require('./db/connection');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser')
connectDB();
(
  async () => {
    try {
      await rabbitMQ.connect();
      
      server.use(express.json());
      server.use(cors({
              origin: ['http://localhost:5173','http://localhost:4003','http://localhost:5174'],
              credentials: true,
            }));
            server.use(cookieParser());
      server.use('/captain', captainRoutes);

      server.get('/', (req, res) => {
        res.send('Welcome to the captain service Home page\n');
      });

      server.listen(4002, () => {
        console.log(`Captain service running at port 4002`);
      });
    } catch (error) {
      console.error(error);
      
    }
  }
)();
