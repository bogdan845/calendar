import Calendar from "@/parts/Calendar";

class Notes extends Calendar {

    constructor(
        getCalendar,
        getNotes,
        getYear,
        monthName,
        monthIndex,
        getCalendarNotesWrap,
        getCalendarDates,
        // getCalendarDatesPrev,
        // getCalendarDatesNext
    ) {
        super(
            getCalendar,
            getNotes,
            getYear,
            monthName,
            monthIndex,
            getCalendarDates,
        );
        this.getCalendar = getCalendar;
        this.getNotes = getNotes;
        this.getYear = getYear;
        this.monthName = monthName;
        this.monthIndex = monthIndex;
        this.getCalendarNotesWrap = getCalendarNotesWrap;
        this.getCalendarDates = getCalendarDates;
        // this.getCalendarDatesPrev = getCalendarDatesPrev;
        // this.getCalendarDatesNext = getCalendarDatesNext;
    }

    /**
     * Show mark for notes from prev / next months
     * */
    showPrevNextNotes(month, items, dateFrom, dateTo) {
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

    /**
     *  Show notes
     * */
    showNotes() {
        // if year exists in data (getNotes)
        if (this.getNotes[this.getYear]) {
            // for handy usage
            const dataInMonth = this.getNotes[this.getYear][this.monthName[this.monthIndex]];

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
                        this.getCalendarDates[getDatesNotes[i]].classList.add("with-events");
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
        if (this.getNotes[this.getYear] &&
            this.getNotes[this.getYear][this.monthName[this.monthIndex - 1]]
        ) {
            this.showPrevNextNotes(
                this.getNotes[this.getYear][this.monthName[this.monthIndex - 1]],
                this.getCalendarDatesPrev, 25, 30
            );
        } else if (
            /* add mark if last month of previous year has events
            when displaying first month of current year */
            this.getCalendar.getAttribute("data-month") == this.monthName[0] &&
            this.getNotes[this.getYear - 1] &&
            this.getNotes[this.getYear - 1][this.monthName[11]]
        ) {
            this.showPrevNextNotes(
                this.getNotes[this.getYear - 1][this.monthName[11]],
                this.getCalendarDatesPrev, 25, 30
            );
        } else {
        }


        // add mark if next months dates has events
        if (this.getNotes[this.getYear] &&
            this.getNotes[this.getYear][this.monthName[this.monthIndex + 1]]
        ) {
            this.showPrevNextNotes(
                this.getNotes[this.getYear][this.monthName[this.monthIndex + 1]],
                this.getCalendarDatesNext, 0, 5
            );
        } else if (
            /* add mark if first month of next year has events
            when displaying last month of current year */
            this.getCalendar.getAttribute("data-month") == this.monthName[11] &&
            this.getNotes[this.getYear + 1] &&
            this.getNotes[this.getYear + 1][this.monthName[0]]
        ) {
            this.showPrevNextNotes(
                this.getNotes[this.getYear + 1][this.monthName[0]],
                this.getCalendarDatesNext, 0, 5
            );
        } else {
        }
    }


    /**
     * Open / Close none
     */
    openCloseNote(target) {
        // get target attr
        const targetAttr = target.getAttribute("data-date");

        if (target.classList.contains("opened") && !target.classList.contains("calendar__notes-wrap")) {
            target.classList.remove("opened");
            this.getCalendarNotesWrap[targetAttr].classList.remove("opened");
        } else if (target.classList.contains("calendar__dates")) {
            // loop through notes
            Array.from(this.getCalendarNotesWrap).forEach((item) => {
                item.classList.remove("opened");
                if (targetAttr == item.getAttribute("data-note")) {
                    item.classList.add('opened');
                }
            });

            // loop through dates
            Array.from(this.getCalendarDates).forEach((item) => {
                item.classList.remove("opened");
            });

            target.classList.add("opened");
        } else {
        }
    }


    /**
     * Close note bnt
     */
    closeNoteBtn(target) {
        if (target.classList.contains("calendar__close-note")) {
            const btnIndex = target.parentNode.getAttribute("data-note");
            this.getCalendarDates[btnIndex].classList.remove("opened");
            this.getCalendarNotesWrap[btnIndex].classList.remove("opened");
        } else {
        }
    }


    /**
     * Change notes status
     */
    noteStatus(target) {
        if (target.classList.contains("calendar__notes-item")) {
            // for handy usage
            const dataInMonth = this.getNotes[this.getYear][this.monthName[this.monthIndex]];

            // parrent id
            const dayIndexStatus = target.parentNode.id;

            // target itemAttr
            const itemIndexStatus = target.getAttribute("data-note-list-item");

            target.classList.remove("in-progress");
            target.classList.toggle("done");
            target.classList.contains('done') ?
                dataInMonth[dayIndexStatus][itemIndexStatus].status = "done" :
                dataInMonth[dayIndexStatus][itemIndexStatus].status = "in-progress";
            localStorage.setItem("calendarNotes", JSON.stringify(this.getNotes));
        }
    }

    /**
     * Adding notes to markup
     */
    addNotes(target) {
        if (target.classList.contains("calendar__add-note")) {
            /* data attr
            (id from parent node. This is date of the day in month ) */
            const dayIndexAdding = target.parentNode.getAttribute("data-note");

            // get input
            const getNotesInput = document.getElementsByClassName("calendar__note-input")[dayIndexAdding];

            /* chek input, return error message if input is empty */
            if (getNotesInput.value.trim() != '') {
                this.getCalendarDates[dayIndexAdding].classList.add("with-events");
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
            const getNotesItem = this.getCalendarNotesWrap[dayIndexAdding].getElementsByClassName("calendar__notes-item");

            /* checking if list for notes exists (needed when adding first note.
            With first note also adding list "ul" where all other notes
            (will be placed). ID of list is number of the day in month */
            if (!this.getCalendarNotesWrap[dayIndexAdding].contains(getNotesList)) {
                let createList = document.createElement('ul');
                createList.classList.add('calendar__notes-list');
                createList.setAttribute("id", dayIndexAdding);
                this.getCalendarNotesWrap[dayIndexAdding].append(createList);
            } else {
            }

            // adding items to note list and set attr (index) to each of them
            Array.from(this.getCalendarNotesWrap).forEach((item) => {
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
            if (!this.getNotes[this.getYear]) {
                this.getNotes[this.getYear] = {}
            } else {
            }

            /* check month availability. if month is new
            add month by adding month object to available year
            where inside object:
                key = date of the day
                value = notes in that day
            */
            if (!this.getNotes[this.getYear][this.monthName[this.monthIndex]]) {
                this.getNotes[this.getYear][this.monthName[this.monthIndex]] = {[dayIndexAdding]: []};
            } else {
            }

            // get created data from storage (for needed month)
            const dataInMonth = this.getNotes[this.getYear][this.monthName[this.monthIndex]];

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
            localStorage.setItem("calendarNotes", JSON.stringify(this.getNotes));
        } else {
        }
    }


    /**
     * Remove note
     * */
    removeNote(target) {
        if (target.classList.contains('calendar__remove-note')) {
            // for handy usages
            const dataInMonth = this.getNotes[this.getYear][this.monthName[this.monthIndex]];

            // get index of note item in localstorage data
            const itemIndexDelete = target.parentNode.getAttribute("data-note-list-item");

            // get day index in month
            const getDayIndex = target.parentNode.parentNode.getAttribute("id");

            // remove note from localstorage and markup
            dataInMonth[getDayIndex].splice(itemIndexDelete, 1);
            target.parentNode.remove();

            // remove mark if date has not notes
            if (dataInMonth[getDayIndex].length == 0) {
                this.getCalendarDates[getDayIndex].classList.remove("with-events");
                delete dataInMonth[getDayIndex];
            } else {
            }

            /* getting needed elements by setting ID for parent element and
            getting children that are inside */
            const getNotesItem = this.getCalendarNotesWrap[getDayIndex].getElementsByClassName("calendar__notes-item");
            Array.from(getNotesItem).forEach((item, index) => {
                item.setAttribute("data-note-list-item", index);
            });

            // set localstorage when remove item from markup
            localStorage.setItem("calendarNotes", JSON.stringify(this.getNotes));

            // remove month if its empty
            if (this.getNotes[this.getYear][this.monthName[this.monthIndex]]) {
                for (let month in this.getNotes[this.getYear][this.monthName[this.monthIndex]]) {
                    return;
                }
                delete this.getNotes[this.getYear][this.monthName[this.monthIndex]];
            } else {
            }

            // check availability of months in year
            const checkMonthsInYear = [];
            for (let key in this.getNotes[this.getYear]) {
                checkMonthsInYear.push(key);
            }
            checkMonthsInYear.length > 0 ? '' : delete this.getNotes[this.getYear];

            // set localstorage if removing month / year
            localStorage.setItem("calendarNotes", JSON.stringify(this.getNotes));
        }
    }
}

export default Notes