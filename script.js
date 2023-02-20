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
const timeLeft = document.getElementById("time-left");
const startStop = document.getElementById("start_stop");
const reset = document.getElementById("reset");
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

const updateSession = elem => {
  elem.innerText < 10
    ? timeLeft.innerText = `0${elem.innerText}:00`
    : timeLeft.innerText = `${elem.innerText}:00`;
};

const countdown = () => {
  const timeArr = timeLeft.innerText.split(":");
  let prevSeconds = timeArr[0] * 60 + +timeArr[1];
  let seconds = 0;
  let minutes = 0;

  setInterval(() => {
    if (prevSeconds > 0) {
      prevSeconds--;
      seconds = prevSeconds % 60;
      minutes = Math.floor(prevSeconds / 60);
      updateCounter(prevSeconds, seconds, minutes);
  }}, 1000);
};

const updateCounter = (prevSeconds, seconds, minutes) => {
  if (prevSeconds === 0) {
    console.log(BING);
  } minutes < 10
      ? timeLeft.innerText = `0${minutes}:${("0" + seconds).slice(-2)}`
      : timeLeft.innerText = `${minutes}:${("0" + seconds).slice(-2)}`;
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
  updateSession(sessionLength);
})

sessionIncrement.addEventListener("click", () => {
  increaseTime(sessionLength);
  updateSession(sessionLength);
})

startStop.addEventListener("click", () => {
  countdown();
})

reset.addEventListener("click", () => {
  resetTime();
})