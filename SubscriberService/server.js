const express = require('express');
const server = express();
const rabbitMQ=require('./service/rabbit');
let messages = [];
if (!Array.isArray(messages)) {
    messages = []; // Ensure it's an array
}
messages.push({"empty":"arr"});
(
  async () => {
    try
    {
      await rabbitMQ.connect();
      var msgs=await rabbitMQ.subscribeToQueue('test', (message) => {
        if (message!=null)
        {
          console.log(message);
          messages.push(message);
        }
        
      });
      server.get('/', (req, res) => {
        res.send(msgs);
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
