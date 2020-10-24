/**
 * Generate mark up for navigation panel, days and month
 **/

import Calendar from "@/parts/Calendar";

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

    countDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

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
    * Change markup for month (overwritten method from parent)
     * */
    switchMonth(direction) {
        return super.switchMonth(direction);
    }


    /**
     * Navigation markup
     * */
    navigationMarkup() {
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
        this.dayName.map((item) => {
            daysList.innerHTML += `<li class="calendar__days-item">${item.slice(0, 3)}.</li>`;
        });

        // list of dates
        const datesList = document.createElement("div");
        datesList.setAttribute("id", "dates");
        datesList.classList.add("calendar__month-dates");

        // final mark up
        this.getCalendar.append(navWrap, daysList, datesList);
    }


    /**
     ** Month markup
     */
    monthMarkUp() {

        let monthIndex = Number(super.monthYear("monthIndex"));
        let yearIndex = Number(super.monthYear("yearIndex"));

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

        const getDaysInCurrentMonth = this.countDaysInMonth(
            yearIndex,
            monthIndex + 1
        );

        // for prev month. get number of days in previous month
        const getDaysInPrevMonth = this.countDaysInMonth(
            yearIndex,
            monthIndex
        );

        // for current month. get the day from which the current month begins
        const currentStart = new Date(yearIndex, monthIndex).getDay();
        // get dates from  previous month to fill gaps before day in which current month start
        let prevMonthDays = getDaysInPrevMonth - currentStart;
        // index for current day
        let currentMonthDays = 0;

        // for next month. get the day from which the next month begins
        const nextStart = new Date(yearIndex, monthIndex + 1, 1).getDay();
        // fill the gaps from day in which next month start by the end of the week=
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
        } else {
        }

        // for creating week
        let createWeek = '';
        readyItems.map((item, index) => {
            // create week
            if (index % 7 === 0) {
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


        getMonthAndYear.innerHTML = this.monthName[monthIndex] +
            " / " + this.getCalendar.getAttribute("data-year");
    }
}

export default CalendarMarkup;