const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const router = express.Router();
const saltRounds = 10;

const userData = require('../../Users');
let users;
async function readUsers() {
  users = await userData.getAll();
  // Get all users
  router.get('/', (req, res) => res.json(users));

  // Get single user ID
  /*// awaits email and password //*/
  router.post('/user/id', (req, res) => {
    const found = users.some(user => user.email === req.body.email);
    if (found) {
      const user = users.filter(user => user.email === req.body.email)[0];
      if (bcrypt.compareSync(req.body.password, user.passHash)) {
        res.json({
          found: true,
          id: user.id
        });
      } else {
        res.json({
          found: false
        });
      }
    } else {
      res.status(400).json({
        user: null
      });
    }
  });

  // Get single user data
  /*// awaits userID //*/
  router.post('/user', (req, res) => {
    const found = users.some(user => user.id === req.body.id);
    if (found) {
      const user = users.filter(user => user.id === req.body.id)[0];
      res.json(user);
    } else {
      res.status(400).json({
        user: null
      });
    }
  });

  // Create user
  /*// expectes email, fullName, password //*/
  router.post('/', async (req, res) => {
    const newUser = {
      id: uuid.v4(),
      fullName: req.body.fullName,
      email: req.body.email,
      passHash: await bcrypt.hash(req.body.password, saltRounds)
    };
    if (!newUser.fullName || !newUser.email) {
      res.status(400).json({
        msg: 'Please include all the information needed...'
      });
    } else {
      console.log('User registered!');
      users.push(newUser);
      res.json({
        msg: 'User registered!'
      });
      // await writeUsers(users);
      await userData.writeAll(users);
    }
  });

}
// async function writeUsers(users) {
//   await userData.writeAll(users);
// }

readUsers();
module.exports = router;