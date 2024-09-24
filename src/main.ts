/**
 * @license AGPL-3.0-only
 * Pomodoro Timer - A Pomodoro Timer (25 + 5 Clock)
 * Copyright (C) 2023-2024 Eldar Pashazade <eldarlrd@pm.me>
 *
 * This file is part of Pomodoro Timer.
 *
 * Pomodoro Timer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * Pomodoro Timer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pomodoro Timer. If not, see <https://www.gnu.org/licenses/>.
 */

const breakDecrement = document.getElementById(
  'break-decrement'
) as HTMLButtonElement;
const breakIncrement = document.getElementById(
  'break-increment'
) as HTMLButtonElement;
const breakLength = document.getElementById(
  'break-length'
) as HTMLParagraphElement;

const sessionDecrement = document.getElementById(
  'session-decrement'
) as HTMLButtonElement;
const sessionIncrement = document.getElementById(
  'session-increment'
) as HTMLButtonElement;
const sessionLength = document.getElementById(
  'session-length'
) as HTMLParagraphElement;

const playPause = document.getElementById('play-pause');
const timeLabel = document.getElementById('time-label') as HTMLHeadingElement;
const timeLeft = document.getElementById('time-left') as HTMLTimeElement;
const startStop = document.getElementById('start-stop') as HTMLButtonElement;
const reset = document.getElementById('reset') as HTMLButtonElement;
const alarm = document.getElementById('alarm') as HTMLAudioElement;
let ticking = false;
let mode = false;
let timer: number;

const decreaseTime = (elem: HTMLElement): number =>
  +elem.innerText > 1 ? (elem.innerText as unknown as number)-- : 0;

const increaseTime = (elem: HTMLElement): number =>
  +elem.innerText < 60 ? (elem.innerText as unknown as number)++ : 0;

const updateTimer = (elem: HTMLElement): string | undefined => {
  const minutes = elem.innerText;

  localStorage.setItem('timeLeft', `${minutes}:00`);

  return +elem.innerText < 10 ?
      (timeLeft.innerText = `0${elem.innerText}:00`)
    : (timeLeft.innerText = `${elem.innerText}:00`);
};

const countdown = (): void => {
  let prevSeconds: number;
  const timeArr = timeLeft.innerText.split(':');

  prevSeconds = +timeArr[0] * 60 + +timeArr[1];

  let seconds = 0;
  let minutes = 0;

  if (timer) clearInterval(timer); // Remove duplicate intervals

  timer = setInterval(() => {
    if (prevSeconds > 0 && ticking) {
      prevSeconds--;
      seconds = prevSeconds % 60;
      minutes = ~~(prevSeconds / 60);
      updateCounter(prevSeconds, seconds, minutes);

      localStorage.setItem(
        'timeLeft',
        `${minutes.toString()}:${seconds < 10 ? '0' : ''}${seconds.toString()}`
      );
    } else if (!ticking) clearInterval(timer);
  }, 1000);
};

const updateCounter = (
  prevSeconds: number,
  seconds: number,
  minutes: number
): string | undefined => {
  if (prevSeconds === 0) {
    mode = !mode;
    switchMode();
    countdown();
  }

  return minutes < 10 ?
      (timeLeft.innerText = `0${minutes.toString()}:${('0' + seconds.toString()).slice(-2)}`)
    : (timeLeft.innerText = `${minutes.toString()}:${('0' + seconds.toString()).slice(-2)}`);
};

const toggleTicking = (): void => {
  ticking = !ticking;
  breakDecrement.disabled = !breakDecrement.disabled;
  breakIncrement.disabled = !breakIncrement.disabled;
  sessionDecrement.disabled = !sessionDecrement.disabled;
  sessionIncrement.disabled = !sessionIncrement.disabled;

  if (playPause)
    if (ticking) {
      playPause.classList.remove('fa-play');
      playPause.classList.add('fa-pause');
      playPause.title = 'Stop Timer';
    } else {
      playPause.classList.remove('fa-pause');
      playPause.classList.add('fa-play');
      playPause.title = 'Start Timer';
    }
};

const switchMode = (): void => {
  void alarm.play();
  if (mode) {
    timeLabel.innerText = 'Break';
    updateTimer(breakLength);
  } else {
    timeLabel.innerText = 'Session';
    updateTimer(sessionLength);
  }
};

const resetTime = (): void => {
  if (timer) clearInterval(timer);

  localStorage.removeItem('timeLeft');
  localStorage.removeItem('sessionLength');
  localStorage.removeItem('breakLength');

  ticking = false;
  mode = false;

  sessionLength.innerText = '25';
  breakLength.innerText = '5';

  timeLeft.innerText = '25:00';
  timeLabel.innerText = 'Session';

  if (playPause) {
    playPause.classList.remove('fa-pause');
    playPause.classList.add('fa-play');
    playPause.title = 'Start Timer';
  }

  breakDecrement.disabled = false;
  breakIncrement.disabled = false;
  sessionDecrement.disabled = false;
  sessionIncrement.disabled = false;

  alarm.pause();
  alarm.currentTime = 0;
};

const loadStorage = (): void => {
  const savedTimeLeft = localStorage.getItem('timeLeft');
  const savedSessionLength = localStorage.getItem('sessionLength');
  const savedBreakLength = localStorage.getItem('breakLength');

  if (savedTimeLeft) timeLeft.innerText = savedTimeLeft;
  else timeLeft.innerText = '25:00';

  if (savedSessionLength) sessionLength.innerText = savedSessionLength;
  else sessionLength.innerText = '25';

  if (savedBreakLength) breakLength.innerText = savedBreakLength;
  else breakLength.innerText = '5';
};

breakDecrement.addEventListener('click', () => {
  decreaseTime(breakLength);
  localStorage.setItem('breakLength', breakLength.innerText);
  if (mode) updateTimer(breakLength);
});

breakIncrement.addEventListener('click', () => {
  increaseTime(breakLength);
  localStorage.setItem('breakLength', breakLength.innerText);
  if (mode) updateTimer(breakLength);
});

sessionDecrement.addEventListener('click', () => {
  decreaseTime(sessionLength);
  localStorage.setItem('sessionLength', sessionLength.innerText);
  if (!mode) updateTimer(sessionLength);
});

sessionIncrement.addEventListener('click', () => {
  increaseTime(sessionLength);
  localStorage.setItem('sessionLength', sessionLength.innerText);
  if (!mode) updateTimer(sessionLength);
});

startStop.addEventListener('click', () => {
  countdown();
  toggleTicking();
});

reset.addEventListener('click', () => {
  resetTime();
});

loadStorage();
