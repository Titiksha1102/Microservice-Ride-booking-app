const express = require('express');
const server = express();
const rabbitMQ=require('./service/rabbit');
(
  async () => {
    try
    {
      await rabbitMQ.connect();
      await rabbitMQ.subscribeToQueue('ride', (message) => {
        if (message!=null)
        {
          console.log(message);
        }
        
      });
      server.get('/', (req, res) => {
        res.send('Welcome to the express Home page\n');
      });

      server.listen(4004, () => {
        console.log(`Server running at port 4004`);
      });
    }
    catch(error)
    {
      console.error(error);
    }
  }
)()
