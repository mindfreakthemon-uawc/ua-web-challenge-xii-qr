import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './root/main.component';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
	imports: [
		ScheduleModule,
		BrowserModule,
		FormsModule,
	],

	declarations: [
		MainComponent
	],

	providers: [
		{ provide: APP_BASE_HREF, useValue: '/' }
	],

	bootstrap: [
		MainComponent
	]
})
export class AppModule {
}
