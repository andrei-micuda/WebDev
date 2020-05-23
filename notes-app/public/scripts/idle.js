let idleTime = 0; // time of inactivity (in minutes)
let idlePopUp = null;
setInterval(() => {
  idleTime++;
  if (idleTime === 5) {
    idlePopUp = Swal.fire({
      titleText: 'Hey! Are you still around?',
      text: `It seems like you\'ve been inactive for a while (${idleTime}min). When you\'ll be back this popup will disappear.`,
      showConfirmButton: false
    });
  } else if (idleTime > 5) {
    Swal.update({
      text: `It seems like you\'ve been inactive for a while (${idleTime}min). When you\'ll be back this popup will disappear.`
    });
  }
}, 60000);

const events = ['click', 'keypress', 'mousemove', 'scroll', 'touchstart'];

events.forEach(evt => window.addEventListener(evt, () => {
  idleTime = 0;
  if (idlePopUp) idlePopUp.close();
}));