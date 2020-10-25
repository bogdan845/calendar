/**
* Parent method that contains main elements / tools for building app
* Methods:
*   monthYear;
*   setCurrentDate;
*   switchMonth
*   backToCurrentDate
*   changeTheme
*   setTheme
*   markCurrentDate
*   displayCurrentMonth
**/


class Calendar {
    constructor(
        getCalendar,
        getCalendarDates,
        monthName,
        date,
        getTheme,
        getYear,
        monthIndex,
    ) {
        this.getCalendar = getCalendar;
        this.getCalendarDates = getCalendarDates;
        this.monthName = monthName;
        this.getTheme = getTheme;
        this.date = date;
        this.monthIndex = monthIndex;
        this.getYear = getYear;
    }


    /**
    * Get year and index of month
    * this method passed to: 
    *   CalendarMarkup.js and CalendarNotes.js
    * it's allowing us to get valid year and month 
    * from #calendar attributes (data-month and data-year)
    **/
    monthYear(key) {
        const monthYear = {
            "monthIndex": this.getCalendar.getAttribute("data-month"),
            "yearIndex": this.getCalendar.getAttribute("data-year")
        }
        return monthYear[key];
    }


    /**
    * Set current date to #calendar (data-month and data-year)
    **/
    setCurrentDate() {
        this.getCalendar.setAttribute(
            "data-month",
            this.monthIndex
        );
        this.getCalendar.setAttribute(
            "data-year",
            this.getYear
        );
    }


    /**
    * Switch month (depend on direction)
    **/
    switchMonth(direction) {
        direction === "next" ? this.monthIndex++ : this.monthIndex--;

        if (this.monthIndex < 0) {
            this.monthIndex = 11;
            this.getYear--;
        }

        if (this.monthIndex > 11) {
            this.monthIndex = 0;
            this.getYear++;
        }

        this.setCurrentDate();
    }


    /**
    ** Show / hide "today" (btn for back to current month)
    **/
    backToCurrentDate(item) {
        if (this.getYear === this.date.getFullYear() &&
            this.monthIndex === this.date.getMonth()
        ) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }
    }


    /**
    * Switch theme
    **/
    changeTheme() {
        this.getCalendar.getAttribute("data-theme") === "dark" ?
            this.getCalendar.setAttribute("data-theme", "default") :
            this.getCalendar.setAttribute("data-theme", "dark");

        this.getCalendar.className = "calendar " + this.getCalendar.getAttribute("data-theme");

        document.body.className = this.getCalendar.getAttribute('data-theme');
        this.getTheme.theme = this.getCalendar.getAttribute("data-theme");
        localStorage.setItem("calendarTheme", JSON.stringify(this.getTheme));
    }


    /**
    * Set theme (theme saved in local storage)
    **/
    setTheme() {
        document.body.className = this.getTheme.theme;
        this.getCalendar.className = "calendar " + this.getTheme.theme;
        this.getCalendar.setAttribute("data-theme", this.getTheme.theme);
    }


    /**
    * Mark current date (highlight current date)
    **/
    markCurrentDate() {
        /* actual year and month index taken from parent (Calendar) */
        const calendarMonth = Number(this.getCalendar.getAttribute("data-month"));
        const calendarYear = Number(this.getCalendar.getAttribute("data-year"));

        if (this.monthName[calendarMonth] === this.monthName[this.date.getMonth()] &&
            calendarYear === this.date.getFullYear()
        ) {
            this.getCalendarDates[this.date.getDate() - 1].classList.add("current");
        }
    }


    /**
    * Display current month when open app
    **/
    displayCurrentMonth() {
        this.monthIndex++;
        this.switchMonth();
    }
}

export default Calendar;