import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { RulerComponent } from './schedule/ruler.component';
import { EventLabelComponent } from './schedule/event-label.component';
import { BlockComponent } from './schedule/block.component';
import { AreaLabelComponent } from './schedule/area-label.component';
import { ScheduleEditorComponent } from './schedule-editor/schedule-editor.component';
import { ScheduleComponentService } from './schedule/services/schedule-component.service';
import { ScheduleConfigurationService } from './schedule/services/schedule-configuration.service';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ScheduleRoutingModule
	],

	declarations: [
		ScheduleComponent,
		ScheduleEditorComponent,
		RulerComponent,
		EventLabelComponent,
		BlockComponent,
		AreaLabelComponent
	],

	providers: [
		ScheduleComponentService,
		ScheduleConfigurationService
	],

	exports: [
		ScheduleComponent,
		ScheduleEditorComponent
	],

	entryComponents: [
		RulerComponent,
		EventLabelComponent,
		BlockComponent,
		AreaLabelComponent
	]
})
export class ScheduleModule {
}
