const express = require('express');
const server = express();
const userRoutes = require('./routes/UserRoutes');
const connectDB = require('./db/connection');
require('dotenv').config();
connectDB();
server.use(express.json());
server.use('/users', userRoutes);

server.get('/', (req, res) => {
  res.send('Welcome to the express Home page\n');
});

server.listen(4001, () => {
  console.log(`Server running at port 4001`);
});