const express = require('express');
const server = express();
const captainRoutes = require('./routes/CaptainRoutes');

server.use(express.json());
server.use('/captain', captainRoutes);

server.get('/', (req, res) => {
  res.send('Welcome to the express Home page\n');
});

server.listen(4002, () => {
  console.log(`Server running at port 4002`);
});