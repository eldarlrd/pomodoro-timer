(()=>{let e;/**
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
 */let t="25:00",n={playPause:document.getElementById("play-pause"),startStop:document.getElementById("start-stop"),reset:document.getElementById("reset"),alarm:document.getElementById("alarm"),timeLeft:document.getElementById("time-left"),timeLabel:document.getElementById("time-label"),breakDecrement:document.getElementById("break-decrement"),breakIncrement:document.getElementById("break-increment"),breakLength:document.getElementById("break-length"),sessionDecrement:document.getElementById("session-decrement"),sessionIncrement:document.getElementById("session-increment"),sessionLength:document.getElementById("session-length")},s=!1,a=!1,r=(e,t)=>{localStorage.setItem(e,t)},i=(e,t)=>localStorage.getItem(e)??t,l=(e,t,n)=>{let s=Math.min(Math.max(+e.innerText+t,1),n);e.innerText=s.toString()},m=(e,t=0)=>{let s=`${e<10?"0":""}${e.toString()}:${t<10?"0":""}${t.toString()}`;n.timeLeft.innerText=s,r("timeLeft",s)},o=()=>{let t=n.timeLeft.innerText.split(":"),a=60*+t[0]+ +t[1];clearInterval(e),e=setInterval(()=>{a>0&&s?m(~~(--a/60),a%60):(clearInterval(e),0===a&&(g(),o()))},1e3)},g=()=>{a=!a,n.alarm.play(),r("mode",JSON.stringify(a));let e=a?"Break":"Session",t=a?n.breakLength:n.sessionLength;n.timeLabel.innerText=e,m(+t.innerText)},c=()=>{s=!s,[n.breakDecrement,n.breakIncrement,n.sessionDecrement,n.sessionIncrement].forEach(e=>e.disabled=s),n.playPause&&(n.playPause.classList.toggle("fa-play",!s),n.playPause.classList.toggle("fa-pause",s),n.playPause.title=s?"Stop Timer":"Start Timer")};n.breakLength.innerText=i("breakLength","5"),n.sessionLength.innerText=i("sessionLength","25"),n.timeLeft.innerText=i("timeLeft",t),a=JSON.parse(i("mode","false")),n.timeLabel.innerText=a?"Break":"Session",n.breakDecrement.addEventListener("click",()=>{l(n.breakLength,-1,60),r("breakLength",n.breakLength.innerText),a&&m(+n.breakLength.innerText)}),n.breakIncrement.addEventListener("click",()=>{l(n.breakLength,1,60),r("breakLength",n.breakLength.innerText),a&&m(+n.breakLength.innerText)}),n.sessionDecrement.addEventListener("click",()=>{l(n.sessionLength,-1,60),r("sessionLength",n.sessionLength.innerText),a||m(+n.sessionLength.innerText)}),n.sessionIncrement.addEventListener("click",()=>{l(n.sessionLength,1,60),r("sessionLength",n.sessionLength.innerText),a||m(+n.sessionLength.innerText)}),n.startStop.addEventListener("click",()=>{o(),c()}),n.reset.addEventListener("click",()=>{clearInterval(e),["timeLeft","breakLength","sessionLength","mode"].forEach(e=>{localStorage.removeItem(e)}),s=!1,a=!1,n.breakLength.innerText="5",n.sessionLength.innerText="25",n.timeLeft.innerText=t,n.timeLabel.innerText="Session",n.playPause&&(n.playPause.classList.remove("fa-pause"),n.playPause.classList.add("fa-play"),n.playPause.title="Start Timer"),n.alarm.pause(),n.alarm.currentTime=0})})();
//# sourceMappingURL=index.ed51b5dd.js.map
