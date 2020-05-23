if (localStorage.getItem('rememberMe') === 'true') {
  const userID = localStorage.getItem('userID');
  window.location.replace(`notes.html?id=${userID}`);
}

const loginBtn = document.querySelector('button[type = "submit"');

async function login(event) {
  event.preventDefault();
  const email = document.querySelector('#email-input');
  const pass = document.querySelector('#pass-input');
  const rememberMe = document.querySelector('#remember-me');

  let res;
  try {
    res = await fetch('/api/users/user/id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email.value,
        "password": pass.value
      })
    });

    try {
      const ans = await res.json();
      if (ans.found) {
        sessionStorage.setItem('loggedIn', 'true');

        if (rememberMe.checked) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userID', ans.id);
        }
        Swal.fire({
          icon: 'success',
          titleText: 'Logged in successfully!',
          showConfirmButton: false,
          timer: 2500
        });
        setTimeout(() => window.location.replace(`notes.html?id=${ans.id}`), 1500);
      } else {
        Swal.fire({
          titleText: 'Oops!',
          text: 'Invalid email or password',
          icon: 'error',
          footer: '<a href="signup.html">Sign up here!</a>',
          customClass: {
            confirmButton: 'popup-btn'
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
}

loginBtn.addEventListener('click', login);
window.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    login(event);
  }
});