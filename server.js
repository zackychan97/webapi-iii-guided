const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// middleware

// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`)
  
  next(); // allows the request to continue to the next middleware or route handler
}

//write a gatekeeper middleware that reads a password from the headers   and if the password is 'mellon', let it continue
// if not send back status code 401 and a message. Use it for the        /area51 endpoint

function gatekeeper(req, res, next) {
  console.log('Gatekeeper is checking')
  next()
}


server.use(helmet()); // 3rd party middleware
server.use(express.json()); // built-in middleware

// endpoints
server.use('/api/hubs', helmet(), hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/echo', (req, res) => {
    res.send(req.headers);
});

server.use(gatekeeper);
server.get('/area51', helmet(), (req, res) => {
  if (req.headers.password === 'melon') {
    res.send(req.headers)
  } else {
    res.status(401).json({ errorMessage: 'Sorry password incorrect bud.' })
  }
   
});

module.exports = server;
