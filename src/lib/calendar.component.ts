import {Component, ViewChild, Input, Output, OnDestroy} from '@angular/core';
import {Calendar} from '@fullcalendar/core';
import {EventSourceInput} from '@fullcalendar/common';
import {CalendarOptions, FullCalendarComponent} from '@fullcalendar/angular';
import {Observable, Subject, Subscription} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
    selector: 'm3team-calendar',
    template: `
        <full-calendar [options]="options"></full-calendar>`,
    styles  : []
})
export class CalendarComponent implements OnDestroy {
    subscriptions: Subscription[] = [];
    @ViewChild(FullCalendarComponent) calendarObject: FullCalendarComponent;

    get calendar(): Calendar {return this.calendarObject.getApi()};

    @Input('eventClick') eventClicked: (info) => void;
    @Input('datesSet') datesSet: (arg) => void;
    changeSubject: Subject<void> = new Subject<void>();
    @Output('change') change: Observable<void> = this.changeSubject.asObservable();
    private _source: EventSourceInput = {events: []}
    get source(): EventSourceInput {return this._source;}

    set source(e) {
        this._source = e;
        this.changeSubject.next();
    }

    options: CalendarOptions = {
        initialView     : 'timeGridWeek',
        height          : '100%',
        locale          : 'it',
        displayEventEnd : true,
        slotEventOverlap: false,
        firstDay        : 1,
        headerToolbar   : {
            start : 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            end   : 'today prev,next'
        },
        buttonText      : {
            today: 'Oggi',
            month: 'Mese',
            week : 'Settimana',
            day  : 'Giorno'
        }
    };

    constructor() {
        this.options.eventClick = this.eventClicked;
        this.subscriptions.push(this.change.pipe(filter(() => !!this.calendar)).subscribe(() => {
            this.calendar.removeAllEventSources();
            this.calendar.addEventSource(this._source);
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

}
