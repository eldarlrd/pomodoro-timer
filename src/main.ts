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

const initialState = {
  breakLength: '5',
  sessionLength: '25',
  timeLeft: '25:00'
};

const elements = {
  playPause: document.getElementById('play-pause'),
  startStop: document.getElementById('start-stop') as HTMLButtonElement,
  reset: document.getElementById('reset') as HTMLButtonElement,
  alarm: document.getElementById('alarm') as HTMLAudioElement,

  timeLeft: document.getElementById('time-left') as HTMLTimeElement,
  timeLabel: document.getElementById('time-label') as HTMLHeadingElement,

  breakDecrement: document.getElementById(
    'break-decrement'
  ) as HTMLButtonElement,
  breakIncrement: document.getElementById(
    'break-increment'
  ) as HTMLButtonElement,
  breakLength: document.getElementById('break-length') as HTMLParagraphElement,

  sessionDecrement: document.getElementById(
    'session-decrement'
  ) as HTMLButtonElement,
  sessionIncrement: document.getElementById(
    'session-increment'
  ) as HTMLButtonElement,
  sessionLength: document.getElementById(
    'session-length'
  ) as HTMLParagraphElement
};

let ticking = false;
let mode = false;
let timer: number;

const setTimeToStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

const getTimeFromStorage = (key: string, defaultValue: string): string =>
  localStorage.getItem(key) ?? defaultValue;

const changeTime = (elem: HTMLElement, delta: number, max: number): void => {
  const newTime = Math.min(Math.max(+elem.innerText + delta, 1), max);
  elem.innerText = newTime.toString();
};

const updateTimer = (minutes: number, seconds = 0): void => {
  const formattedTime = `${minutes < 10 ? '0' : ''}${minutes.toString()}:${seconds < 10 ? '0' : ''}${seconds.toString()}`;
  elements.timeLeft.innerText = formattedTime;
  setTimeToStorage('timeLeft', formattedTime);
};

const countdown = (): void => {
  const timeArr = elements.timeLeft.innerText.split(':');
  let prevSeconds = +timeArr[0] * 60 + +timeArr[1];

  clearInterval(timer); // Remove duplicate intervals

  timer = setInterval(() => {
    if (prevSeconds > 0 && ticking) {
      prevSeconds--;
      const minutes = ~~(prevSeconds / 60);
      const seconds = prevSeconds % 60;
      updateTimer(minutes, seconds);
    } else {
      clearInterval(timer);
      if (prevSeconds === 0) {
        switchMode();
        countdown();
      }
    }
  }, 1000);
};

const switchMode = (): void => {
  mode = !mode;
  void elements.alarm.play();
  setTimeToStorage('mode', JSON.stringify(mode));

  const label = mode ? 'Break' : 'Session';
  const time = mode ? elements.breakLength : elements.sessionLength;

  elements.timeLabel.innerText = label;
  updateTimer(+time.innerText);
};

const toggleTicking = (): void => {
  ticking = !ticking;
  [
    elements.breakDecrement,
    elements.breakIncrement,
    elements.sessionDecrement,
    elements.sessionIncrement
  ].forEach(button => (button.disabled = ticking));

  if (elements.playPause) {
    elements.playPause.classList.toggle('fa-play', !ticking);
    elements.playPause.classList.toggle('fa-pause', ticking);
    elements.playPause.title = ticking ? 'Stop Timer' : 'Start Timer';
  }
};

const resetTime = (): void => {
  clearInterval(timer);
  ['timeLeft', 'breakLength', 'sessionLength', 'mode'].forEach(key => {
    localStorage.removeItem(key);
  });

  ticking = false;
  mode = false;

  elements.breakLength.innerText = initialState.breakLength;
  elements.sessionLength.innerText = initialState.sessionLength;
  elements.timeLeft.innerText = initialState.timeLeft;
  elements.timeLabel.innerText = 'Session';

  if (elements.playPause) {
    elements.playPause.classList.remove('fa-pause');
    elements.playPause.classList.add('fa-play');
    elements.playPause.title = 'Start Timer';
  }

  elements.alarm.pause();
  elements.alarm.currentTime = 0;
};

const loadStorage = (): void => {
  elements.breakLength.innerText = getTimeFromStorage(
    'breakLength',
    initialState.breakLength
  );
  elements.sessionLength.innerText = getTimeFromStorage(
    'sessionLength',
    initialState.sessionLength
  );
  elements.timeLeft.innerText = getTimeFromStorage(
    'timeLeft',
    initialState.timeLeft
  );
  mode = JSON.parse(getTimeFromStorage('mode', 'false')) as boolean;
  elements.timeLabel.innerText = mode ? 'Break' : 'Session';
};

const setupListeners = (): void => {
  elements.breakDecrement.addEventListener('click', () => {
    changeTime(elements.breakLength, -1, 60);
    setTimeToStorage('breakLength', elements.breakLength.innerText);
    if (mode) updateTimer(+elements.breakLength.innerText);
  });

  elements.breakIncrement.addEventListener('click', () => {
    changeTime(elements.breakLength, 1, 60);
    setTimeToStorage('breakLength', elements.breakLength.innerText);
    if (mode) updateTimer(+elements.breakLength.innerText);
  });

  elements.sessionDecrement.addEventListener('click', () => {
    changeTime(elements.sessionLength, -1, 60);
    setTimeToStorage('sessionLength', elements.sessionLength.innerText);
    if (!mode) updateTimer(+elements.sessionLength.innerText);
  });

  elements.sessionIncrement.addEventListener('click', () => {
    changeTime(elements.sessionLength, 1, 60);
    setTimeToStorage('sessionLength', elements.sessionLength.innerText);
    if (!mode) updateTimer(+elements.sessionLength.innerText);
  });

  elements.startStop.addEventListener('click', () => {
    countdown();
    toggleTicking();
  });

  elements.reset.addEventListener('click', resetTime);
};

const main = (): void => {
  loadStorage();
  setupListeners();
};

main();
