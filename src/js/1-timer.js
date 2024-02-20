'use strict';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};

const showdays = document.querySelector('[data-days]');
const showhours = document.querySelector('[data-hours]');
const showminutes = document.querySelector('[data-minutes]');
const showseconds = document.querySelector('[data-seconds]');
const inputfield = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

let countdownInterval;
let userSelectedDate;

function updateTimer() {
  const currentDate = new Date();
  const timeDifference = userSelectedDate - currentDate;

  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    startBtn.disabled = true;
    inputfield.disabled = true;
    iziToast.warning({
      title: 'Warning',
      message: 'Time is up!',
    });
    return;
  }

  const timeRemaining = convertMs(timeDifference);
  updateClockface(timeRemaining);
}

function updateClockface({ days, hours, minutes, seconds }) {
  showdays.textContent = addLeadingZero(days);
  showhours.textContent = addLeadingZero(hours);
  showminutes.textContent = addLeadingZero(minutes);
  showseconds.textContent = addLeadingZero(seconds);
}

function startTimer() {
  startBtn.disabled = true;
  inputfield.disabled = true;
  countdownInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

startBtn.addEventListener('click', startTimer);

flatpickr(inputfield, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();

    if (userSelectedDate <= currentDate) {
    
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startBtn.disabled = true;
      startBtn.classList.remove('active');
    } else {
      startBtn.disabled = false;
      startBtn.classList.add('active');
    }
  }
});