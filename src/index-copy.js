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

/*
** COUNT DAYS NUMBER OF DAYS IN MONTH
*
!!! FIRST MONTH START FROM 1 !!!
*/
const countDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};


/*
** DECLARE CLASS Calendar
*
- creating markup for nav panel, week days, and months date
- displaying current month
- setting mark for current date
- show, open, close, add, remove note
- changing note status
- set, change theme */
class Calendar {
    constructor() {
    }

    /*
    ** MAIN MARKUP
    */
    mainMarkup() {
        // navigation wrap
        const navWrap = document.createElement("div");
        navWrap.classList.add("calendar__nav");

        // today date
        const createToday = document.createElement("span")
        createToday.setAttribute("id", "today");
        createToday.classList.add("calendar__today");
        createToday.textContent = "Today"

        // prev btn
        const prevBtn = document.createElement("button");
        prevBtn.setAttribute("id", "prevMonth");
        prevBtn.classList.add("calendar__controllers");
        prevBtn.innerHTML = '<span class="fas fa-angle-left"></span>'

        // next btn
        const nextBtn = document.createElement("button");
        nextBtn.setAttribute("id", "nextMonth");
        nextBtn.classList.add("calendar__controllers");
        nextBtn.innerHTML = '<span class="fas fa-angle-right"></span>'

        // mont and year
        const monthAndYear = document.createElement("h3");
        monthAndYear.setAttribute("id", "currentMonth");
        monthAndYear.classList.add("calendar__month");

        // theme switcher
        const switcherWrap = document.createElement("div")
        switcherWrap.classList.add("calendar__switcher-wrap");
        switcherWrap.innerHTML =
            `<label class="calendar__theme-label">
                <input type="checkbox" class="calendar__theme-checkbox" >
                <span id="theme" data-color="dark" class="calendar__theme-slider"></span>
            </label>`;

        // ready navigation panel
        navWrap.append(createToday, prevBtn, monthAndYear, nextBtn, switcherWrap);

        // list of days
        const daysList = document.createElement("ul");
        daysList.setAttribute("id", "days");
        daysList.classList.add("calendar__days");

        // add week days
        dayName.map((item) => {
            daysList.innerHTML += `<li class="calendar__days-item">${item.slice(0, 3)}.</li>`;
        });

        // list of dates
        const datesList = document.createElement("div");
        datesList.setAttribute("id", "dates");
        datesList.classList.add("calendar__month-dates");

        // final mark up
        getCalendar.append(navWrap, daysList, datesList);
    }


    /*
    ** LOOP FOR DAYS
    *
    arg1 - days in month (prev / current/ next)
    arg2 - indexes from which (prev / current/ next) month will start / end
    element - where to output
    itemClass - Classes for (prev / current / next) month:
        prev - prev month
        current - leave empty
        next - next month

    !!! IMPORTANT !!! to displaying date from 1 add "1" to arg2 (arg2 + 1) */
    static loopForDays(arg1, arg2, element, itemClass) {
        while (arg1 > arg2) {
            element.push({
                "itemClass": itemClass ? "calendar__dates" + "-" + itemClass : "calendar__dates",
                "date": arg2 + 1,
                "id": arg2,
            });
            arg2++;
        }
    }


    /*
    ** MONTH MARK UP
    */
    static monthMarkUp() {
        /* for elements from main markup method */
        // displaying year and month
        const getMonthAndYear = document.getElementById('currentMonth');

        // list of dates
        const getListDates = document.getElementById('dates');

        /* get number of days in current month.
        Adding "1" to month index. Month index works via getMonth()
        and for getting current Month it is needed add 1.
        Function that counts days in month take numbers from 1 to 12 (as in life).
        So when we adding "1" to month index we get current month,
        without "1" we get previous month.
        in this way, we add 1 to getMonth so that the function correctly
        displays the current month, and for the previous one we do not add anything.
        The index will be checked and will display the correct months
        PS: if countDaysInMonth = 1 it will be January
            if monthIndex = 0 it will be january */
        const getDaysInCurrentMonth = countDaysInMonth(getYear, monthIndex + 1);

        // for prev month. get number of days in previous month
        const getDaysInPrevMonth = countDaysInMonth(getYear, monthIndex);

        // for current month. get the day from which the current month begins
        const currentStart = new Date(getYear, monthIndex,).getDay();
        // get dates from  previous month to fill gaps before day in which current month start
        let prevMonthDays = getDaysInPrevMonth - currentStart;
        // index for current day
        let currMonthDays = 0;

        // for next month. get the day from which the next month begins
        const nextStart = new Date(getYear, monthIndex + 1, 1).getDay();
        // fill the gaps from day in which next month start by the end of the week=
        const setNextStart = dayName.length - nextStart;
        // index for next month
        let nextMonthDays = 0;

        // clear mark up
        getListDates.innerHTML = '';

        /* array for ready items.
        pushing values from prev, current, next months and then output it */
        let readyItems = [];

        // prev month
        Calendar.loopForDays(getDaysInPrevMonth, prevMonthDays, readyItems, "prev");
        // current month
        Calendar.loopForDays(getDaysInCurrentMonth, currMonthDays, readyItems);
        // next month
        if (nextStart != 0) {
            Calendar.loopForDays(setNextStart, nextMonthDays, readyItems, "next");
        } else {
        }

        // for creating week
        let createWeek = '';
        readyItems.map((item, index) => {
            // create week
            if (index % 7 == 0) {
                createWeek = document.createElement('div');
                createWeek.classList.add('calendar__week');
                getListDates.append(createWeek);
            }
        });

        // get created weeks
        const getCalendarWeeks = document.getElementsByClassName("calendar__week");
        // index for week. when week is full of days (7) change index of week
        let weekIndex = 0;
        for (let i = 0; i < readyItems.length; i += 7) {
            i >= 7 ? weekIndex++ : '';

            // adding dates to each week
            readyItems.slice(i, i + 7).forEach((item) => {
                getCalendarWeeks[weekIndex].innerHTML += `<div data-date=${item.id} class="${item.itemClass}">${item.date}</div> `;
            });

            /* adding notes block to the end of the each week
            !!! IMPORTANT !!! compare to calendar__dates*/
            readyItems.slice(i, i + 7).forEach((item) => {
                getCalendarWeeks[weekIndex].innerHTML += item.itemClass != "calendar__dates" ? "" :
                    `<div data-note=${item.id} class="calendar__notes-wrap">
                    <span class="calendar__close-note fas fa-times"></span>
                    <input placeholder="let's add notes" type="text" class="calendar__note-input">
                    <input type="button" value="+" class="calendar__add-note"></input>
                </div>`;
            });
        }
        // display month and year
        getMonthAndYear.innerHTML = monthName[monthIndex] + ' / ' + getYear;
    }


    /*
    ** SET CURRENT MONTH and YEAR to calendar data attributes
    */
    static setCurrentDate(element) {
        element.setAttribute("data-month", monthName[monthIndex]);
        element.setAttribute("data-year", getYear);
    }


    /*
    ** ADD MARK TO CURRENT DATE
    */
    static markCurrentDate() {
        if (
            getCalendar.getAttribute("data-month") == monthName[date.getMonth()] &&
            getCalendar.getAttribute("data-year") == date.getFullYear()
        ) {
            getCalendarDates[date.getDate() - 1].classList.add('current');
        } else {
        }
    }


    /*
    ** DISPLAY CURRENT MONTH
    *
    by adding "1" to monthIndex
    for getting correct month via countDaysInMonth */
    displayCurrentMonth() {
        monthIndex++;
        Calendar.showMonth();
        Calendar.markCurrentDate()
    }


    /*
    ** CHANGE MONTH
    *
    direction:
        for showing prev month leave arg empty
        for showing next month write "next" as arg */
    static showMonth(direction) {
        direction == 'next' ? monthIndex++ : monthIndex--;

        if (monthIndex < 0) {
            monthIndex = 11;
            getYear--;
        } else {
        }

        if (monthIndex > 11) {
            monthIndex = 0;
            getYear++;
        } else {
        }

        Calendar.monthMarkUp();
        Calendar.setCurrentDate(getCalendar);
    }


    /*
    ** SHOW NOTES IN PREV / NEXT MONTHS and from PREV / NEXT YEARS
    *
    when displaying current */
    static showprevNextNotes(month, items, dateFrom, dateTo) {
        // get needed data
        const data = month;
        // get key from data
        for (var key in data) {
            /* for prev month:
                    dateFrom = 25
                    dateTo = 30
                    adding "1" in loopForDays so 26 = 25 and 31 = 30

                for next month:
                    dateFrom = 0
                    dateTo = 5
                    same thing as in prev month 0 = 1 and 5 = 6

            if key i needed range */
            if (key >= dateFrom && key <= dateTo) {
                // loop trough prev / next month dates that displaying in current month
                for (let g = 0; g < items.length; g++) {
                    // if key match to date attribute and date has notes add mark class
                    if (key == items[g].getAttribute("data-date")) {
                        items[g].classList.add("with-events");
                    } else {
                        continue;
                    }
                }
            } else {
                continue;
            }
        }
    }


    /*
    ** SHOW NOTES
    */
    static showNotes() {
        // if year exisits in data (getNotes)
        if (getNotes[getYear]) {
            // for handy usage
            const dataInMonth = getNotes[getYear][monthName[monthIndex]];

            // getting values from dataInMonth
            let getDatesNotes = [];

            // if data month exists
            if (dataInMonth) {
                for (let key in dataInMonth) {
                    getDatesNotes.push(key);
                }

                // number of max days in month
                const maxDaysInMonth = 31;

                //if date has notes add mark
                for (let i = 0; i < maxDaysInMonth; i++) {
                    if (getDatesNotes[i]) {
                        getCalendarDates[getDatesNotes[i]].classList.add("with-events");
                    } else {
                    }
                }

                // set index for days
                let dayIndexShow = 0;
                while (dayIndexShow < maxDaysInMonth) {
                    if (dataInMonth[dayIndexShow]) {

                        // get wrap for notes
                        let outputData = document.getElementsByClassName('calendar__notes-wrap');
                        let createList = document.createElement('ul');
                        createList.classList.add('calendar__notes-list');
                        /* through this ID, deleting notes in days and open needed note block
                        ID = date of the day in month*/
                        createList.setAttribute("id", dayIndexShow);

                        // get notes from day if they exists
                        for (let y = 0; y < dataInMonth[dayIndexShow].length; y++) {
                            createList.innerHTML += `<li class="calendar__notes-item ${dataInMonth[dayIndexShow][y].status}" 
                            data-note-list-item="${y}">${dataInMonth[dayIndexShow][y].content} 
                            <span class="calendar__remove-note far fa-trash-alt"></span></li>`;
                        }
                        outputData[dayIndexShow].append(createList);
                    }
                    dayIndexShow++;
                }
            } else {
            }
        } else {
        }


        // add mark if prev months dates has events
        if (getNotes[getYear] && getNotes[getYear][monthName[monthIndex - 1]]) {
            Calendar.showprevNextNotes(getNotes[getYear][monthName[monthIndex - 1]], getCalendarDatesPrev, 25, 30);
        } else if (
            /* add mark if last month of previous year has events
            when displaying first month of current year */
            getCalendar.getAttribute("data-month") == monthName[0] &&
            getNotes[getYear - 1] &&
            getNotes[getYear - 1][monthName[11]]
        ) {
            Calendar.showprevNextNotes(getNotes[getYear - 1][monthName[11]], getCalendarDatesPrev, 25, 30);
        } else {
        }


        // add mark if next months dates has events
        if (getNotes[getYear] && getNotes[getYear][monthName[monthIndex + 1]]) {
            Calendar.showprevNextNotes(getNotes[getYear][monthName[monthIndex + 1]], getCalendarDatesNext, 0, 5);
        } else if (
            /* add mark if first month of next year has events
            when displaying last month of current year */
            getCalendar.getAttribute("data-month") == monthName[11] &&
            getNotes[getYear + 1] &&
            getNotes[getYear + 1][monthName[0]]
        ) {
            Calendar.showprevNextNotes(getNotes[getYear + 1][monthName[0]], getCalendarDatesNext, 0, 5);
        } else {
        }
    }


    /*
    ** OPEN / CLOSE NOTES
    */
    openCloseNote(target) {
        // get target attr
        const targetAttr = target.getAttribute("data-date");

        if (target.classList.contains("opened") && !target.classList.contains("calendar__notes-wrap")) {
            target.classList.remove("opened");
            getCalendarNotesWrap[targetAttr].classList.remove("opened");
        } else if (target.classList.contains("calendar__dates")) {
            // loop through notes
            Array.from(getCalendarNotesWrap).forEach((item) => {
                item.classList.remove("opened");
                if (targetAttr == item.getAttribute("data-note")) {
                    item.classList.add('opened');
                }
            });

            // loop through dates
            Array.from(getCalendarDates).forEach((item) => {
                item.classList.remove("opened");
            });

            target.classList.add("opened");
        } else {
        }
    }


    /*
    ** CLOSE NOTES (button inside notes block)
    */
    closeNoteBtn(target) {
        if (target.classList.contains("calendar__close-note")) {
            const btnIndex = target.parentNode.getAttribute("data-note");
            getCalendarDates[btnIndex].classList.remove("opened");
            getCalendarNotesWrap[btnIndex].classList.remove("opened");
        } else {
        }
    }


    /*
    ** CHANGE NOTES STATUS
    */
    noteStatus(target) {
        if (target.classList.contains("calendar__notes-item")) {
            // for handy usage
            const dataInMonth = getNotes[getYear][monthName[monthIndex]];

            // parrent id
            const dayIndexStatus = target.parentNode.id;

            // target itemAttr
            const itemIndexStatus = target.getAttribute("data-note-list-item");

            target.classList.remove("in-progress");
            target.classList.toggle("done");
            target.classList.contains('done') ?
                dataInMonth[dayIndexStatus][itemIndexStatus].status = "done" :
                dataInMonth[dayIndexStatus][itemIndexStatus].status = "in-progress";
            localStorage.setItem("calendarNotes", JSON.stringify(getNotes));
        }
    }


    /*
    ** ADDING NOTES
    *
    to markup and localstorage */
    addNotes(target) {

        /*
        ** ADDING TO MARK UP
        */
        if (target.classList.contains("calendar__add-note")) {
            /* data attr
            (id from parent node. This is date of the day in month ) */
            const dayIndexAdding = target.parentNode.getAttribute("data-note");

            // get input
            const getNotesInput = document.getElementsByClassName("calendar__note-input")[dayIndexAdding];

            /* chek input, return error message if input is empty */
            if (getNotesInput.value.trim() != '') {
                getCalendarDates[dayIndexAdding].classList.add("with-events");
                getNotesInput.classList.remove('err');
                getNotesInput.setAttribute("placeholder", "let's add notes")
            } else {
                getNotesInput.classList.add('err')
                getNotesInput.setAttribute("placeholder", "please check input field");
                return;
            }

            // get notes list
            const getNotesList = document.getElementById(dayIndexAdding);

            // get notes inside opened notes block
            const getNotesItem = getCalendarNotesWrap[dayIndexAdding].getElementsByClassName("calendar__notes-item");

            /* checking if list for notes exists (needed when adding first note.
            With first note also adding list "ul" where all other notes
            (will be placed). ID of list is number of the day in month */
            if (!getCalendarNotesWrap[dayIndexAdding].contains(getNotesList)) {
                let cretaeList = document.createElement('ul');
                cretaeList.classList.add('calendar__notes-list');
                cretaeList.setAttribute("id", dayIndexAdding);
                getCalendarNotesWrap[dayIndexAdding].append(cretaeList);
            } else {
            }

            // adding items to note list and set attr (index) to each of them
            Array.from(getCalendarNotesWrap).forEach((item) => {
                if (item.classList.contains('opened')) {
                    const getNotesList = document.getElementById(dayIndexAdding);

                    getNotesList.innerHTML += `<li class="calendar__notes-item in-progress">${getNotesInput.value} 
                        <span class="calendar__remove-note far fa-trash-alt"></span></li>`;

                    /* set attr (index) for each note items. Index will needed
                    when deleting item drom array */
                    Array.from(getNotesItem).forEach((item, index) => {
                        item.setAttribute("data-note-list-item", index);
                    });
                }
            });


            /*
            ** ADDING TO LOCALSTORAGE
            */

            /* check year availability. if year is new
            add year by adding year with empty object */
            if (!getNotes[getYear]) {
                getNotes[getYear] = {}
            } else {
            }

            /* check month availability. if month is new
            add month by adding month object to available year
            where inside object:
                key = date of the day
                value = notes in that day
            */
            if (!getNotes[getYear][monthName[monthIndex]]) {
                getNotes[getYear][monthName[monthIndex]] = {[dayIndexAdding]: []};
            } else {
            }

            // get created data from storage (for needed month)
            const dataInMonth = getNotes[getYear][monthName[monthIndex]];

            /* if day is not new, push value from input
            or create array inside for day events and push valeus from input*/
            if (dataInMonth[dayIndexAdding]) {
                dataInMonth[dayIndexAdding].push({"content": getNotesInput.value, "status": "in-progress"});
            } else {
                dataInMonth[dayIndexAdding] = [];
                dataInMonth[dayIndexAdding].push({"content": getNotesInput.value, "status": "in-progress"});
            }

            // clear input value
            getNotesInput.value = '';

            // set local storage
            localStorage.setItem("calendarNotes", JSON.stringify(getNotes));
        } else {
        }
    }


    /*
    ** REMOVE NOTE ITEM
    */
    removeNote(target) {
        if (target.classList.contains('calendar__remove-note')) {
            // for handy usages
            const dataInMonth = getNotes[getYear][monthName[monthIndex]];

            // get index of note item in localstorage data
            const itemIndexDelete = target.parentNode.getAttribute("data-note-list-item");

            // get day index in month
            const getDayIndex = target.parentNode.parentNode.getAttribute("id");

            // remove note from localstorage and markup
            dataInMonth[getDayIndex].splice(itemIndexDelete, 1);
            target.parentNode.remove();

            // remove mark if date has not notes
            if (dataInMonth[getDayIndex].length == 0) {
                getCalendarDates[getDayIndex].classList.remove("with-events");
                delete dataInMonth[getDayIndex];
            } else {
            }

            /* getting needed elements by setting ID for parent element and
            getting children that are inside */
            const getNotesItem = getCalendarNotesWrap[getDayIndex].getElementsByClassName("calendar__notes-item");
            Array.from(getNotesItem).forEach((item, index) => {
                item.setAttribute("data-note-list-item", index);
            });

            // set localstorage when remove item from markup
            localStorage.setItem("calendarNotes", JSON.stringify(getNotes));

            // remove month if its empty
            if (getNotes[getYear][monthName[monthIndex]]) {
                for (let month in getNotes[getYear][monthName[monthIndex]]) {
                    return;
                }
                delete getNotes[getYear][monthName[monthIndex]];
            } else {
            }

            // check availability of months in year
            const checkMonthsInYear = [];
            for (let key in getNotes[getYear]) {
                checkMonthsInYear.push(key);
            }
            checkMonthsInYear.length > 0 ? '' : delete getNotes[getYear];

            // set localstorage if removing month / year
            localStorage.setItem("calendarNotes", JSON.stringify(getNotes));
        }
    }


    /*
    ** SET THEME
    */
    setTheme() {
        document.body.className = getTheme.theme;
        getCalendar.className = 'calendar ' + getTheme.theme;
        getCalendar.setAttribute("data-theme", getTheme.theme);
    }


    /*
    ** CHANGE THEME
    */
    chnageTheme() {
        getCalendar.getAttribute("data-theme") == "dark" ?
            getCalendar.setAttribute("data-theme", "default") :
            getCalendar.setAttribute("data-theme", "dark");
        getCalendar.className = 'calendar ' + getCalendar.getAttribute('data-theme');
        document.body.className = getCalendar.getAttribute('data-theme');
        getTheme.theme = getCalendar.getAttribute("data-theme");
        localStorage.setItem("calendarTheme", JSON.stringify(getTheme));
    }

    /*
    ** SHOW / HIDE TODAY
    *
    button for back to current month */
    static today(item) {
        if (getYear == date.getFullYear() && monthIndex == date.getMonth()) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }
    }
}


/*
** INIT CLASS Calendar
*/
const initCalendar = new Calendar();
initCalendar.mainMarkup();
Calendar.monthMarkUp();
initCalendar.setTheme();
Calendar.setCurrentDate(getCalendar);
initCalendar.displayCurrentMonth();
Calendar.showNotes();


/*
** "TODAY" BTN
*
display none when click on "Today" back to current month */
const getToday = document.getElementById("today");
getToday.addEventListener('click', (e) => {
    // set year index adn month index to present
    getYear = date.getFullYear();
    monthIndex = date.getMonth();
    e.target.style.display = "none";

    Calendar.setCurrentDate(getCalendar);
    Calendar.monthMarkUp();
    Calendar.markCurrentDate();
    Calendar.showNotes();
});


/*
** BUTTON PREV
*/
const getShowPrev = document.getElementById('prevMonth');
getShowPrev.addEventListener('click', () => {
    Calendar.showMonth();
    Calendar.showNotes();
    Calendar.markCurrentDate();
    Calendar.today(getToday);
});


/*
** BUTTON NEXT
*/
const getShowNext = document.getElementById('nextMonth');
getShowNext.addEventListener('click', () => {
    Calendar.showMonth('next');
    Calendar.showNotes();
    Calendar.markCurrentDate();
    Calendar.today(getToday);
});


/*
** THEME BTN
*/
const getThemeBtn = document.getElementById('theme');
getThemeBtn.addEventListener('click', () => {
    initCalendar.chnageTheme();
});


/*
** CLICK EVENT FOR DATES
*/
const getListDates = document.getElementById("dates");
getListDates.addEventListener('click', (e) => {

    // open notes for selected date
    initCalendar.openCloseNote(e.target);

    // output notes and set localstorage
    initCalendar.addNotes(e.target);

    // remove note
    initCalendar.removeNote(e.target);

    // change note status
    initCalendar.noteStatus(e.target);

    // close notes
    initCalendar.closeNoteBtn(e.target);

    // switch month when click on dates from prev / next month
    if (e.target.classList.contains("calendar__dates-prev")) {
        Calendar.showMonth();
        Calendar.markCurrentDate();
        Calendar.showNotes();
    } else if (e.target.classList.contains("calendar__dates-next")) {
        Calendar.showMonth("next");
        Calendar.markCurrentDate();
        Calendar.showNotes();
    } else {
    }
});