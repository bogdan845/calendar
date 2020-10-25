import Calendar from "@parts/Calendar"
import CalendarMarkup from "@parts/CalendarMarkup";
import Notes from "@parts/CalendarNotes";
import "./styles/main.scss";

const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// set local storage for notes
let setNotes = localStorage.getItem("calendarNotes") ?
    JSON.parse(localStorage.getItem("calendarNotes")) : {};
localStorage.setItem("calendarNotes", JSON.stringify(setNotes));
let getNotes = JSON.parse(localStorage.getItem("calendarNotes"));

// set local storage for theme
let setTheme = localStorage.getItem("calendarTheme") ?
    JSON.parse(localStorage.getItem("calendarTheme")) : { "theme": "default" };
localStorage.setItem("calendarTheme", JSON.stringify(setTheme));
const getTheme = JSON.parse(localStorage.getItem("calendarTheme"));

// date
const date = new Date();

// indexes for month and year
let monthIndex = date.getMonth();
let getYear = date.getFullYear();

// get calendar (main element);
const getCalendar = document.getElementById("calendar");

// get date notes
const getCalendarNotesWrap = document.getElementsByClassName("calendar__notes-wrap");

// get dates in month
const getCalendarDates = document.getElementsByClassName('calendar__dates');
const getCalendarDatesPrev = document.getElementsByClassName('calendar__dates-prev');
const getCalendarDatesNext = document.getElementsByClassName('calendar__dates-next');


/**
* INIT CALENDAR
**/
const createCalenadr = new Calendar(
    getCalendar,
    getCalendarDates,
    monthName,
    date,
    getTheme,
    getYear,
    monthIndex,
);


/**
* INIT MARK UP
**/
const createMarkup = new CalendarMarkup(
    getCalendar,
    dayName,
    monthName,
);


/**
* INIT NOTES
**/
const createNotes = new Notes(
    getCalendar,
    monthName,
    getNotes,
    getCalendarDates,
    getCalendarNotesWrap,
    getCalendarDatesPrev,
    getCalendarDatesNext
);


/**
* When loading app
**/
createCalenadr.displayCurrentMonth();
createMarkup.navigationMarkup();
createMarkup.monthMarkUp();
createCalenadr.markCurrentDate();
createNotes.showNotes();
createCalenadr.setTheme();


/**
* back to current day BTN
* display none when click on "Today" back to current month 
**/
const getToday = document.getElementById("today");
getToday.addEventListener("click", (e) => {
    // set year index adn month index to present
    createCalenadr.getYear = date.getFullYear();
    createCalenadr.monthIndex = date.getMonth();
    e.target.style.display = "none";

    createCalenadr.displayCurrentMonth();
    createMarkup.monthMarkUp()
    createCalenadr.setCurrentDate();
    createNotes.showNotes();
    createCalenadr.markCurrentDate();
});


/**
* BUTTON PREV
**/
const getShowPrev = document.getElementById("prevMonth");
getShowPrev.addEventListener("click", () => {
    createCalenadr.switchMonth();
    createMarkup.monthMarkUp();
    createCalenadr.markCurrentDate();
    createNotes.showNotes();
    createCalenadr.backToCurrentDate(getToday);
});


/**
* BUTTON NEXT
**/
const getShowNext = document.getElementById('nextMonth');
getShowNext.addEventListener("click", () => {
    createCalenadr.switchMonth("next");
    createMarkup.monthMarkUp();
    createCalenadr.markCurrentDate();
    createNotes.showNotes();
    createCalenadr.backToCurrentDate(getToday);
});


/**
** THEME BTN
**/
const getThemeBtn = document.getElementById('theme');
getThemeBtn.addEventListener("click", () => {
    createCalenadr.changeTheme();
});


/**
* CLICK EVENT FOR DATES
**/
const getListDates = document.getElementById("dates");
getListDates.addEventListener("click", (e) => {

    // open notes for selected date
    createNotes.openCloseNote(e.target);

    // output notes and set localstorage
    createNotes.addNotes(e.target);

    // remove note
    createNotes.removeNote(e.target);

    // change note status
    createNotes.noteStatus(e.target);

    // close notes
    createNotes.closeNoteBtn(e.target);

    // switch month when click on dates from prev / next month
    if (e.target.classList.contains("calendar__dates-prev")) {
        createCalenadr.switchMonth();
        createMarkup.monthMarkUp();
        createCalenadr.markCurrentDate();
        createNotes.showNotes();
        createCalenadr.backToCurrentDate(getToday);
    }
    if (e.target.classList.contains("calendar__dates-next")) {
        createCalenadr.switchMonth("next");
        createMarkup.monthMarkUp();
        createCalenadr.markCurrentDate();
        createNotes.showNotes();
        createCalenadr.backToCurrentDate(getToday);
    }
});