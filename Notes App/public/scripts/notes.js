if (!localStorage.getItem('rememberMe') && !sessionStorage.getItem('loggedIn')) {
  window.location.replace('login.html');
} else {
  const userID = window.location.href.split('?')[1].split('=')[1];
  let userNotes = null;

  async function getUserInfo() {
    const userInfoRes = await fetch('http://localhost:3000/api/users/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userID
      })
    });
    const userInfo = await userInfoRes.json();
    document.querySelector('.user-info p').textContent = userInfo.fullName;

  }

  async function getUserNotes() {
    const userNotesRes = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID
      })
    });

    userNotes = await userNotesRes.json();
    if (userNotes.length) {
      document.querySelector('.blank-overlay').style.display = 'none';
      displayNotes(userNotes);
    }
  }

  function displayNotes(notes) {
    document.querySelector('main').innerHTML = "";
    const pinned = notes.filter(note => note.pinned === true);
    const notPinned = notes.filter(note => note.pinned === false);

    for (note of pinned.reverse()) {
      const noteHTML = `
      <div data-id=${note.noteID}
      data-color=${note.color}
      class="note-small ${note.color} ${note.pinned ? "pinned" : ""}" >
        <div class="note-corner" ></div>
        <svg xmlns = "http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
        <path d="M11 17h2v5l-2 2v-7zm3.571-12c0-2.903 2.36-3.089 2.429-5h-10c.068 1.911 2.429 2.097 2.429 5 0 3.771-3.429 3.291-3.429 10h12c0-6.709-3.429-6.229-3.429-10z"/>
        </svg>
        <p>${note.title}</p>
        </div>
      `;
      document.querySelector('main').insertAdjacentHTML('beforeend', noteHTML);
    }
    for (note of notPinned) {
      const noteHTML = `
      <div data-id=${note.noteID}
      data-color=${note.color}
      class="note-small ${note.color} ${note.pinned ? "pinned" : ""}" >
        <div class="note-corner" ></div>
        <svg xmlns = "http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
        <path d="M11 17h2v5l-2 2v-7zm3.571-12c0-2.903 2.36-3.089 2.429-5h-10c.068 1.911 2.429 2.097 2.429 5 0 3.771-3.429 3.291-3.429 10h12c0-6.709-3.429-6.229-3.429-10z"/>
        </svg>
        <p>${note.title}</p>
        </div>
      `;
      document.querySelector('main').insertAdjacentHTML('beforeend', noteHTML);
    }
    document.querySelectorAll('.note-small').forEach(note => {
      note.addEventListener('click', event => {
        if (document.querySelector('.note-focus').classList.contains('hide')) {
          showFocusNote(note);
          event.stopPropagation();
        }
      });
    });
  }

  function hideFocusNote() {
    // note.dataset.id = "";
    // note.dataset.pinned = "false";
    const focusNote = document.querySelector('.note-focus');
    focusNote.classList.remove('display-block');
    focusNote.classList.add('hide');
  }

  async function showFocusNote(smallNote) {
    const focusNote = document.querySelector('.note-focus');
    if (smallNote === null) {
      focusNote.dataset.id = "null";
      focusNote.dataset.pinned = "false";
      document.querySelector('input[type="radio"]#sticky-1').checked = true;
      setNoteFocusColor();
    } else {
      console.log('here');
      const noteID = smallNote.dataset.id;
      const noteToShow = userNotes.filter(note => note.noteID === noteID)[0];
      focusNote.dataset.id = noteToShow.noteID;
      focusNote.dataset.pinned = (noteToShow.pinned === true) ? 'true' : 'false';
      document.querySelector('#note-title').value = noteToShow.title;
      document.querySelector('#note-body').value = noteToShow.content;
      console.log(smallNote.dataset.color)
      setNoteFocusColor(smallNote.dataset.color);
    }
    document.querySelector('.color-selector').classList.add('hide');
    focusNote.classList.remove('hide');
    focusNote.classList.add('display-block');
  }

  function setNoteFocusColor(color = 'sticky-1') {
    const noteFocus = document.querySelector('.note-focus');
    noteFocus.classList.remove('sticky-1', 'sticky-2', 'sticky-3');
    noteFocus.classList.add(color);
    noteFocus.dataset.color = color;
  }

  function getAllDescendants(node) {
    const lst = [node];
    const rez = [node];
    while (lst.length) {
      const curr = lst.pop();
      for (child of curr.children) {
        rez.push(child);
        lst.push(child);
      }
    }
    return rez;
  }

  document.addEventListener('DOMContentLoaded', function () {
    //The first argument are the elements to which the plugin shall be initialized
    //The second argument has to be at least a empty object or a object with your desired options
    OverlayScrollbars(document.querySelector('#note-body'), {});
    OverlayScrollbars(document.querySelector('body'), {});
  });

  document.querySelector('.create-btn').addEventListener('click', event => {
    const note = document.querySelector('.note-focus');
    if (note.classList.contains('hide')) {
      showFocusNote(null);
      event.stopPropagation();
    } else if (note.classList.contains('display-block')) {
      hideFocusNote();
    }
    document.querySelector('#note-title').value = "";
    document.querySelector('#note-body').value = "";
  });

  document.querySelector('.close-btn').addEventListener('click', () => {
    hideFocusNote();
  });

  document.querySelector('.confirm-btn').addEventListener('click', async () => {
    const note = document.querySelector('.note-focus');
    const noteID = note.dataset.id;
    const noteTitle = document.querySelector('#note-title').value;
    const noteContent = document.querySelector('#note-body').value;
    const pin = document.querySelector('#pin-btn');
    if (noteID === 'null') {
      await fetch('http://localhost:3000/api/notes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID,
          "title": noteTitle,
          "content": noteContent,
          "pinned": (note.dataset.pinned) === 'true' ? true : false,
          "color": note.dataset.color
        })
      });
    } else {
      await fetch('http://localhost:3000/api/notes/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID,
          noteID,
          "title": noteTitle,
          "content": noteContent,
          "pinned": (note.dataset.pinned) === 'true' ? true : false,
          "color": note.dataset.color
        })

      });
    }
    hideFocusNote();
    getUserNotes();
  });

  document.querySelector('#pin-btn').addEventListener('click', (event) => {
    const noteFocus = document.querySelector('.note-focus');
    if (noteFocus.dataset.pinned === 'false') {
      noteFocus.dataset.pinned = 'true';
    } else {
      noteFocus.dataset.pinned = 'false';
    }
  });

  document.querySelector('#color-btn').addEventListener('click', () => {
    document.querySelector('.color-selector').classList.toggle('hide');
  });

  document.querySelectorAll('.color-selector div').forEach(color => {
    color.addEventListener('click', () => {
      setNoteFocusColor(color.dataset.color);
    });
  });

  document.querySelector('#trash-btn').addEventListener('click', async () => {
    const noteFocus = document.querySelector('.note-focus');
    if (noteFocus.dataset.id === 'null') {
      hideFocusNote();
    } else {
      hideFocusNote();
      await fetch('http://localhost:3000/api/notes/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID,
          noteID: noteFocus.dataset.id
        })
      });
      getUserNotes();
    }
  });

  document.querySelector('#logout-btn').addEventListener('click', () => {
    if (document.querySelector('.note-focus').classList.contains('hide')) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userID');
      window.location.replace("login.html");
    }
  });

  window.addEventListener('click', (event) => {
    const noteFocus = document.querySelector('.note-focus');
    if (noteFocus.classList.contains('display-block') && !getAllDescendants(noteFocus).some(node => event.target === node)) {
      hideFocusNote();
    }
  });

  getUserInfo();
  getUserNotes();
}