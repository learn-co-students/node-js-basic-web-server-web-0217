"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const urlParser = require('url')
const querystring = require('querystring')
const bcrypt = require('bcrypt');

const router = new Router({ mergeParams: true });
router.use(bodyParser.json());

const messages = []

let newId = 1

class Message{
  constructor(message){
    this.message = message
    this.id = newId
    newId++
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end("Hello, World!");
});

router.get('/messages', (request, response) => {
  let boo = request.url.split('=')[1]
  if(boo === 'true'){
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return bcrypt.hash(JSON.stringify(messages), 10, (err, hash) => {
      response.end(hash)
    })
  }
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(messages))
})

router.get('/message/:id', (request, response) => {
  const findMessage = (message) => {
    return message.id == request.params.id
  }
  let boo = request.url.split('=')[1]
  let message = messages.find(findMessage)

  if(boo === "true"){
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return bcrypt.hash(JSON.stringify(message), 10, (err, hash) => {
      response.end(hash)
    })
  }
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(message))
})

router.post('/message', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');


  let newMessage = new Message(request.body.message)
  messages.push(newMessage)
  response.end(JSON.stringify(newMessage.id))
})


const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
