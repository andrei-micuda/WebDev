const express = require('express');
const uuid = require('uuid');

const router = express.Router();
const notesData = require('../../Notes');

async function readNotes() {
  const notes = await notesData.getAll();

  // gets all the notes of a user (awaits userID)
  router.post('/', (req, res) => res.json(notes[req.body.userID]));

  // adds a note to a user => returns all notes of the user after adding
  // awaits userID and note contents
  router.post('/add', async (req, res) => {
    //let noteID;
    const newNote = {
      noteID: uuid.v4(),
      title: req.body.title,
      content: req.body.content,
      pinned: req.body.pinned,
      color: req.body.color
    };
    if (!notes[req.body.userID]) {
      notes[req.body.userID] = [newNote];
    } else {
      notes[req.body.userID].push(newNote);
    }

    console.log('Note created!');
    res.json(notes[req.body.userID]);

    await notesData.writeAll(notes);
  });

  // updates a note (awaits userID, noteID and new note info) => returns all notes of the user after altering
  router.put('/update', async (req, res) => {
    const userID = req.body.userID;
    const noteID = req.body.noteID;
    const found = notes[userID].some(note => note.noteID === noteID);

    if (found) {
      const index = notes[userID].findIndex(note => note.noteID === noteID);
      notes[userID][index] = {
        noteID,
        title: req.body.title,
        content: req.body.content,
        pinned: req.body.pinned,
        color: req.body.color
      };

      notesData.writeAll(notes);
      console.log('Note updated!');
      res.json(notes[userID]);
    } else {
      res.status(400).json({
        msg: `No note with id ${noteID} found!`
      });
    }
  });

  // deletes a note (awaits userID, noteID) => returns all notes of the user after deleting
  router.delete('/delete', async (req, res) => {
    const userID = req.body.userID;
    const noteID = req.body.noteID;
    const found = notes[userID].some(note => note.noteID === noteID);

    if (found) {
      const index = notes[userID].findIndex(note => note.noteID === noteID);
      notes[userID].splice(index, 1);

      notesData.writeAll(notes);
      console.log('Note deleted!');
      res.json(notes[userID]);
    } else {
      res.status(400).json({
        msg: `No note with id ${noteID} found!`
      });
    }
  });
}

readNotes();

module.exports = router;