/**
* Generate mark up for navigation panel, days and month
* Methods:
*   countDaysInMonth
*   loopForDays
*   switchMonth
*   navigationMarkup
*   monthMarkUp
**/

import Calendar from "@parts/Calendar";

class CalendarMarkup extends Calendar {

    constructor(
        getCalendar,
        dayName,
        monthName,
    ) {
        super(
            getCalendar,
            monthName,
        )
        this.getCalendar = getCalendar;
        this.dayName = dayName;
        this.monthName = monthName;
    }


    /**
    * Counting number of days for each of month
    **/
    countDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };


    /**
    * Creating day item for month 
        arg1 - days in month (prev / current / next)
        arg2 - indexes from which (prev / current/ next) month will start / end
        element - where to output
        itemClass - Classes for (prev / current / next) month:
            prev - prev month
            current - leave empty
            next - next month

        !!! IMPORTANT !!! to displaying date from 1 add "1" to arg2 (arg2 + 1)
    **/
    loopForDays = (arg1, arg2, element, itemClass) => {
        while (arg1 > arg2) {
            element.push({
                "itemClass": itemClass ? "calendar__dates" + "-" + itemClass : "calendar__dates",
                "date": arg2 + 1,
                "id": arg2,
            });
            arg2++;
        }
    }


    /**
    * Swith month markup wehn click on controll buttons
    * taken from parent (Calendar)
    **/
    switchMonth(direction) {
        return super.switchMonth(direction);
    }


    /**
    * Navigation markup
    **/
    navigationMarkup() {
        // navigation wrap
        const navWrap = document.createElement("div");
        navWrap.classList.add("calendar__nav");

        // current date
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

        // month and year
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

        // adding name of days to week
        this.dayName.map((item) => {
            daysList.innerHTML += `<li class="calendar__days-item">${item.slice(0, 3)}.</li>`;
        });

        // wrapper for dates
        const datesList = document.createElement("div");
        datesList.setAttribute("id", "dates");
        datesList.classList.add("calendar__month-dates");

        // final mark up
        this.getCalendar.append(navWrap, daysList, datesList);
    }


    /**    
    ** Month markup
    **/
    monthMarkUp() {
        /* valid year and month index taken from parent (Calendar) */
        let monthIndex = Number(super.monthYear("monthIndex"));
        let yearIndex = Number(super.monthYear("yearIndex"));

        // displaying year and month
        const getMonthAndYear = document.getElementById("currentMonth");

        // list of dates
        const getListDates = document.getElementById("dates");

        /* get number of days in current month.
        For getting current Month it is needed add "1".
        Function that counts days in month take numbers from 1 to 12 (as in life).
        So when adding "1" to month index - get current month,
        without "1" - previous month.
        in this way, adding "1" to getMonth() - current month will displaying and for the previous one no needed to add anything.
        Index will be checked and will display the correct month
        PS: if countDaysInMonth = 1 it will be January
            if monthIndex = 0 it will be january */

        // get number of days in current month
        const getDaysInCurrentMonth = this.countDaysInMonth(
            yearIndex,
            monthIndex + 1
        );

        // get number of days in previous month
        const getDaysInPrevMonth = this.countDaysInMonth(
            yearIndex,
            monthIndex
        );
        
        // get day from which current month begins
        const currentStart = new Date(yearIndex, monthIndex).getDay();
        /* get dates from previous month to fill gaps 
        before day in which current month start*/
        let prevMonthDays = getDaysInPrevMonth - currentStart;
        // index for current day
        let currentMonthDays = 0;

        // get the day from which the next month begins
        const nextStart = new Date(yearIndex, monthIndex + 1, 1).getDay();
        // fill gaps from day in which next month start by the end of the week
        const setNextStart = this.dayName.length - nextStart;
        // index for next month
        let nextMonthDays = 0;

        // clear mark up
        getListDates.innerHTML = '';

        /* array for ready items.
        pushing values from prev, current, next months and then output */
        let readyItems = [];

        // prev month
        this.loopForDays(getDaysInPrevMonth, prevMonthDays, readyItems, "prev");
        // current month
        this.loopForDays(getDaysInCurrentMonth, currentMonthDays, readyItems);
        // next month
        if (nextStart != 0) {
            this.loopForDays(setNextStart, nextMonthDays, readyItems, "next");
        }

        // creating weeks for month
        let createWeek = "";
        readyItems.map((item, index) => {
            // create week
            if (index % 7 === 0) {
                createWeek = document.createElement("div");
                createWeek.classList.add("calendar__week");
                getListDates.append(createWeek);
            }
        });

        // get created weeks
        const getCalendarWeeks = document.getElementsByClassName("calendar__week");
        // week index. when week is completed (7 days) change index of week
        let weekIndex = 0;
        for (let i = 0; i < readyItems.length; i += 7) {
            i >= 7 ? weekIndex++ : '';
            // adding dates to each week
            readyItems.slice(i, i + 7).forEach((item) => {
                getCalendarWeeks[weekIndex].innerHTML +=
                    `<div data-date=${item.id} class="${item.itemClass}">${item.date}</div> `;
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

        // output month and year
        getMonthAndYear.innerHTML = this.monthName[monthIndex] +
            " / " + this.getCalendar.getAttribute("data-year");
    }
}

export default CalendarMarkup;