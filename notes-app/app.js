const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

//Body Parser Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
// app.use(express.urlencoded({
//   extended: true
// }));

// Routes
// Users API Routes
app.use('/api/users', require(path.join(__dirname, 'routes', 'api', 'users')));
app.use('/api/notes', require(path.join(__dirname, 'routes', 'api', 'notes')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'notes.html'))
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'))
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'))
});
app.get('*', (req, res) => {
  res.status(404);

  //respond with HTML page
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
    return;
  }

  //respond with JSON object
  if (req.accepts('json')) {
    res.json({
      error: 'Not found'
    });
    return;
  }

  //default to plain text
  res.type('txt').send('Not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));