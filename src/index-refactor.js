import Calendar from "@/parts/Calendar"
import CalendarMarkup from "@/parts/CalendarMarkup";
import Notes from "@/parts/Notes";
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
    JSON.parse(localStorage.getItem("calendarTheme")) : {"theme": "default"};
localStorage.setItem("calendarTheme", JSON.stringify(setTheme));
const getTheme = JSON.parse(localStorage.getItem("calendarTheme"));

// date obj
const date = new Date();

// indexes for displaying month and year
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


//
// const countDaysInMonth = (year, month) => {
//     return new Date(year, month, 0).getDate();
// };


/*
* INIT MARK UP
* */
const createMarkup = new CalendarMarkup(
    getCalendar,
    dayName,
    monthIndex,
    monthName,
    getYear
);
createMarkup.navigationMarkup();
createMarkup.monthMarkUp(monthName[monthIndex], getYear);

/*
* INIT CALENDAR
* */
const initCalendar = new Calendar(
    getCalendar,
    getCalendarDates,
    monthName,
    monthIndex,
    date,
    getYear,
    getTheme
);

// initCalendar.markCurrentDate();
initCalendar.setCurrentDate();
initCalendar.displayCurrentMonth();
initCalendar.setTheme();




/*
* INIT NOTES
* */
const initNotes = new Notes(
    getCalendar,
    getNotes,
    getYear,
    monthName,
    monthIndex,
    getCalendarNotesWrap,
    getCalendarDates,
    getCalendarDatesPrev,
    getCalendarDatesNext
);


/*
** "TODAY" BTN
*
display none when click on "Today" back to current month */
const getToday = document.getElementById("today");
getToday.addEventListener('click', (e) => {
    // set year index adn month index to present
    initCalendar.getYear = date.getFullYear();
    initCalendar.monthIndex = date.getMonth();
    e.target.style.display = "none";

    initCalendar.setCurrentDate();
    createMarkup.monthMarkUp();
    initCalendar.markCurrentDate();
    initNotes.showNotes();
});


/*
** BUTTON PREV
*/
const getShowPrev = document.getElementById('prevMonth');
getShowPrev.addEventListener('click', () => {
    createMarkup.switchMonth();
    createMarkup.monthMarkUp();
    initNotes.showNotes();
    initCalendar.markCurrentDate();
    initCalendar.today(getToday);
});


/*
** BUTTON NEXT
*/
const getShowNext = document.getElementById('nextMonth');
getShowNext.addEventListener('click', () => {
    createMarkup.switchMonth('next' );
    createMarkup.monthMarkUp();
    initNotes.showNotes();
    initCalendar.markCurrentDate();
    initCalendar.today(getToday);
});


/*
** THEME BTN
*/
const getThemeBtn = document.getElementById('theme');
getThemeBtn.addEventListener('click', () => {
    initCalendar.changeTheme();
});


/*
** CLICK EVENT FOR DATES
*/
const getListDates = document.getElementById("dates");
getListDates.addEventListener('click', (e) => {

    // open notes for selected date
    initNotes.openCloseNote(e.target);

    // output notes and set localstorage
    initNotes.addNotes(e.target);

    // remove note
    initNotes.removeNote(e.target);

    // change note status
    initNotes.noteStatus(e.target);

    // close notes
    initNotes.closeNoteBtn(e.target);

    // switch month when click on dates from prev / next month
    if (e.target.classList.contains("calendar__dates-prev")) {
        createMarkup.switchMonth();
        createMarkup.monthMarkUp();
        initCalendar.markCurrentDate();
        initNotes.showNotes();
        initCalendar.today(getToday);
    } else if (e.target.classList.contains("calendar__dates-next")) {
        createMarkup.switchMonth("next");
        createMarkup.monthMarkUp();
        initCalendar.markCurrentDate();
        initNotes.showNotes();
        initCalendar.today(getToday);
    } else {
    }
});

