const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let id = 1;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

server.get('/posts', (req, res) => {
  const term = req.query.term;
  if (!term) return res.send(posts);
  const filteredPosts = posts.filter((post) => {
    return post.title.indexOf(term) !== -1 || post.contents.indexOf(term) !== -1;
  });
  res.send(filteredPosts);
});

server.post('/posts', (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(STATUS_USER_ERROR);
    res.send({
      error: 'You need to supply a title and contents'
    });
    return;
  }

  const post = {
    id,
    title,
    contents
  };

  posts.push(post);
  id++;
  res.send(post);
});

server.put('/posts', (req, res) => {
  const { title, contents } = req.body;
  if (!req.body.id || !title || !contents) {
    res.status(STATUS_USER_ERROR);
    res.send({
      error: 'You need to provide an id, title, and contents'
    });
    return;
  }

  const post = posts.find(p => p.id === req.body.id);
  if (!post) {
    res.status(STATUS_USER_ERROR);
    res.send({
      error: 'You need to provide a valid id'
    });
    return;
  }

  post.title = title;
  post.contents = contents;
  res.send(post);
});

server.delete('/posts', (req, res) => {
  const postId = req.body.id;
  if (!postId) {
    res.status(STATUS_USER_ERROR);
    res.send({
      error: 'You need to provide a valid id'
    });
    return;
  }

  const post = posts.find(p => p.id === postId);
  if (!post) {
    res.status(STATUS_USER_ERROR);
    res.send({
      error: `No post has the id: ${postId}`
    });
    return;
  }

  posts = posts.filter(p => p.id !== postId);
  res.send({
    success: true
  });
});

module.exports = { posts, server };