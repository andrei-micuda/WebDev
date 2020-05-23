if (!localStorage.getItem('rememberMe') && !sessionStorage.getItem('loggedIn')) {
  window.location.replace('login.html');
} else {
  const userID = localStorage.getItem('userID') || window.location.href.split('?')[1].split('=')[1];
  let userNotes = null;
  let noteScrollBar;
  let bodyScrollBar;

  async function getUserInfo() {
    const userInfoRes = await fetch('/api/users/user', {
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

    const lastLogin = document.querySelector('#footer');
    if (userInfo.logCount === 0) {
      lastLogin.innerHTML = '<p>This is the first time you log in.</p>'
    } else {
      lastLogin.innerHTML = `
      <p>You've logged in ${userInfo.logCount} times!</p>
      <p>Last login:</p>
      <p>Date: ${userInfo.lastTime}</p>
      <p>IP: ${userInfo.lastIP}</p>
      <hr>
      <p> Made with♥ by <a href = "https://github.com/andrei-micuda"> Andrei Micuda </a></p> `;
    }
  }

  async function getUserNotes() {
    const userNotesRes = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID
      })
    });

    userNotes = await userNotesRes.json();

    displayNotes(userNotes);
  }

  function displayNotes(notes) {
    document.querySelector('main').innerHTML = "";
    if (notes.length) {
      document.querySelector('.blank-overlay').style.display = 'none';
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
    } else {
      document.querySelector('.blank-overlay').style.display = 'block';
    }
  }

  function hideFocusNote() {
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
      const noteID = smallNote.dataset.id;
      const noteToShow = userNotes.filter(note => note.noteID === noteID)[0];
      focusNote.dataset.id = noteToShow.noteID;
      focusNote.dataset.pinned = (noteToShow.pinned === true) ? 'true' : 'false';
      document.querySelector('#note-title').value = noteToShow.title;
      document.querySelector('#note-body').value = noteToShow.content;
      setNoteFocusColor(smallNote.dataset.color);
    }
    document.querySelector('.color-selector').classList.add('hide');
    focusNote.classList.remove('hide');
    focusNote.classList.add('display-block');

    // scroll focus note into view
    bodyScrollBar.scroll({
      x: 0,
      y: 0
    });
  }

  function setNoteFocusColor(color = 'sticky-1') {
    const noteFocus = document.querySelector('.note-focus');
    noteFocus.classList.remove('sticky-1', 'sticky-2', 'sticky-3');
    noteFocus.classList.add(color);
    noteFocus.dataset.color = color;
  }

  function getAllDescendants(node) {
    if (!node) return [];
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
    noteScrollBar = OverlayScrollbars(document.querySelector('#note-body'), {});
    bodyScrollBar = OverlayScrollbars(document.querySelector('body'), {});
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
    if (!noteTitle) {
      Swal.fire('Oops!', 'Note must have a title.',
        'warning', 1500);
    } else {
      if (noteID === 'null') {
        await fetch('/api/notes/add', {
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
        await fetch('/api/notes/update', {
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
    }
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
    Swal.fire({
      titleText: 'Are you sure you want to delete this note?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.value) {
        hideFocusNote();
        await fetch('/api/notes/delete', {
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

        Swal.fire({
          title: 'Deleted!',
          text: 'Your note has been deleted!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })

  });

  document.querySelector('#burger-btn').addEventListener('click', () => {
    document.querySelector('#burger-btn').style.display = 'none';
    document.querySelector('.user-info').style.transform = 'scaleX(1)';
  });

  document.querySelector('#burger-close-btn').addEventListener('click', () => {
    document.querySelector('#burger-btn').style.display = 'block';
    document.querySelector('.user-info').style.transform = 'scaleX(0)';
  });

  document.querySelector('#background-btn').addEventListener('click', () => {
    Swal.fire({
      title: 'Enter the hex code for background color',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      inputPlaceholder: 'Leave blank to revert to default',
      showCancelButton: true,
      confirmButtonText: 'Change',
      preConfirm: (hex) => {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
          document.body.style.backgroundColor = hex;
        } else {
          if (!hex) {
            document.body.style.backgroundColor = "#B7B7B7";
          } else {
            Swal.showValidationMessage(
              'Please provide a valid hex code'
            );
          }

        }
      }
    })
  });

  document.querySelector('#logout-btn').addEventListener('click', () => {
    if (document.querySelector('.note-focus').classList.contains('hide')) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userID');
      window.location.replace("login.html");
    }
  });

  // if focus note is open and user clicks outside, close it
  window.addEventListener('click', (event) => {
    const noteFocus = document.querySelector('.note-focus');
    const popUp = document.querySelector('.swal2-popup');
    if (noteFocus.classList.contains('display-block') && !getAllDescendants(noteFocus).some(node => event.target === node) && !getAllDescendants(popUp).some(node => event.target === node)) {
      hideFocusNote();
    }
  });

  getUserInfo();
  getUserNotes();
}