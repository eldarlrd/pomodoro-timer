"use strict";
// Break Time
const breakDecrement = document.getElementById("break-decrement");
const breakLength = document.getElementById("break-length");
const breakIncrement = document.getElementById("break-increment");
// Session Time
const sessionDecrement = document.getElementById("session-decrement");
const sessionLength = document.getElementById("session-length");
const sessionIncrement = document.getElementById("session-increment");
// Countdown
const timeLabel = document.getElementById("timer-label");
const timeLeft = document.getElementById("time-left");
const startStop = document.getElementById("start_stop");
const playPause = document.getElementById("play_pause");
const reset = document.getElementById("reset");
const beep = document.getElementById("beep");
let ticking = false;
let mode = false;
// Timer
const decreaseTime = elem => {
  elem.innerText > 1
    ? elem.innerText--
    : null;
};

const increaseTime = elem => {
  elem.innerText < 60
    ? elem.innerText++
    : null;
};

const updateTime = elem => {
  elem.innerText < 10
    ? timeLeft.innerText = `0${elem.innerText}:00`
    : timeLeft.innerText = `${elem.innerText}:00`;
};

const countdown = () => {
  const timeArr = timeLeft.innerText.split(":");
  let prevSeconds = timeArr[0] * 60 + +timeArr[1];
  let seconds = 0;
  let minutes = 0;

  setInterval(function() {
    if (prevSeconds > 0 && ticking) {
      prevSeconds--;
      seconds = prevSeconds % 60;
      minutes = Math.floor(prevSeconds / 60);
      updateCounter(prevSeconds, seconds, minutes);
    } else if (!ticking) {
        clearInterval(this);
  }}, 1000);
};

const updateCounter = (prevSeconds, seconds, minutes) => {
  if (prevSeconds === 0) {
    mode = !mode;
    switchMode();
    countdown();
  } minutes < 10
      ? timeLeft.innerText = `0${minutes}:${("0" + seconds).slice(-2)}`
      : timeLeft.innerText = `${minutes}:${("0" + seconds).slice(-2)}`;
};

const toggleTicking = () => {
  ticking = !ticking;
  breakDecrement.disabled = !breakDecrement.disabled;
  breakIncrement.disabled = !breakIncrement.disabled;
  sessionDecrement.disabled = !sessionDecrement.disabled;
  sessionIncrement.disabled = !sessionIncrement.disabled;
  ticking
    ? playPause.src = "assets/icons/pause-solid.svg"
    : playPause.src = "assets/icons/play-solid.svg";
};

const switchMode = () => {
  beep.play();
  if (mode) {
    timeLabel.innerText = "Break";
    updateTime(breakLength);
  } else {
      timeLabel.innerText = "Session";
      updateTime(sessionLength);
    }
};

const resetTime = () => {
  location.reload();
};
// Calls
breakDecrement.addEventListener("click", () => {
  decreaseTime(breakLength);
  updateBreak(breakLength);
})

breakIncrement.addEventListener("click", () => {
  increaseTime(breakLength);
  updateBreak(breakLength);
})

sessionDecrement.addEventListener("click", () => {
  decreaseTime(sessionLength);
  updateTime(sessionLength);
})

sessionIncrement.addEventListener("click", () => {
  increaseTime(sessionLength);
  updateTime(sessionLength);
})

startStop.addEventListener("click", () => {
  countdown();
  toggleTicking();
})

reset.addEventListener("click", () => {
  resetTime();
})