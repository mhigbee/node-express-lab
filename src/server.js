const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [{title: 'title', contents: 'go away'}, { title: 'hello', contents: 'hi'}, { title: 'another', contents: 'Hello'}];

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: your code to handle requests

// server.get('/', (req, res) => {
//   res.send({ message: 'Welcome!' });
// });

server.get('/posts', (req, res) => {
  let results = [];
  if (req.query) {
    const { term } = req.query;
    // filter through each post in posts
    // set a query array to each post whose title and/or body contains term
    posts.map((post) => {
      if (post.title.toLowerCase().includes(term) || post.contents.toLowerCase().includes(term)) {
        results.push(post);
      }
    });
  } else results = posts;
  res.send({ results });
});

module.exports = { posts, server };
