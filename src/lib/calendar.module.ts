import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import {FullCalendarModule} from "@fullcalendar/angular";



@NgModule({
  declarations: [CalendarComponent],
  imports: [FullCalendarModule],
  exports: [CalendarComponent]
})
export class CalendarModule { }
