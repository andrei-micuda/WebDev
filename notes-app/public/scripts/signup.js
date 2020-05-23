if (localStorage.getItem('rememberMe') === 'true') {
  const userID = localStorage.getItem('userID');
  window.location.replace(`notes.html?id=${userID}`);
}
const signupBtn = document.querySelector('button[type = "submit"]');

async function signup(event) {
  event.preventDefault();

  //check if password meets all criteria
  if (!document.querySelectorAll('.not-met').length) {
    const fullName = document.querySelector('#full-name').value;
    const email = document.querySelector('#email-input').value;
    const pass = document.querySelector('#pass-input').value;
    const rePass = document.querySelector('#re-pass-input').value;

    //if all the info has been provided continue
    if (fullName && email && pass && rePass) {
      if (pass !== rePass) {
        Swal.fire({
          // titleText: 'Oops!',
          titleText: 'Passwords don\'t match',
          icon: 'error',
          customClass: {
            confirmButton: 'popup-btn'
          }
        });
      } else {
        const res = await fetch('/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "fullName": fullName,
            "email": email,
            "password": pass
          })
        });
        Swal.fire({
          icon: 'success',
          titleText: 'Account created!!',
          showConfirmButton: false,
          timer: 2500
        });
        setTimeout(() => window.location.replace('login.html'), 1500);
      }
    } else { //else prompt the user to fill all the info
      Swal.fire({
        titleText: 'Please fill in all the info',
        icon: 'warning',
        customClass: {
          confirmButton: 'popup-btn'
        }
      });
    }
  } else {
    Swal.fire({
      titleText: 'The password doesn\'t meet all the criteria',
      icon: 'warning',
      customClass: {
        confirmButton: 'popup-btn'
      }
    });
  }
}

signupBtn.addEventListener('click', signup);
window.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    signup(event);
  }
});

const passwordField = document.querySelector('#pass-input');
// const regexMinLength = /^[a-zA-Z0-9$%&*@#.,_+=-]{8,}$/;
const regexMinLength = /^.{8,}$/;
const regexCapital = /^(.*[A-Z].*)+$/;
const regexNumber = /^(.*[0-9].*)+$/;
const regexSpecial = /^(.*[!@#$%^&*(){}[\]\\\|:;'",.<>\/ ? `~_=+-].*)+$/;
passwordField.addEventListener('keyup', event => {
  if (regexMinLength.test(passwordField.value)) {
    document.querySelector('#pass-min-length').classList.remove('not-met');
  } else {
    document.querySelector('#pass-min-length').classList.add('not-met');
  }
  if (regexCapital.test(passwordField.value)) {
    document.querySelector('#pass-capital').classList.remove('not-met');
  } else {
    document.querySelector('#pass-capital').classList.add('not-met');
  }
  if (regexNumber.test(passwordField.value)) {
    document.querySelector('#pass-number').classList.remove('not-met');
  } else {
    document.querySelector('#pass-number').classList.add('not-met');
  }
  if (regexSpecial.test(passwordField.value)) {
    document.querySelector('#pass-special').classList.remove('not-met');
  } else {
    document.querySelector('#pass-special').classList.add('not-met');
  }
});