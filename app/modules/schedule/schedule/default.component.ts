import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { ScheduleConfigurationService } from './services/schedule-configuration.service';
import { ScheduleComponentType } from './enums/schedule-component-type.enum';


@Component({
	moduleId: module.id,
	selector: '[default]',
	templateUrl: 'tmpl/default.html',
	styleUrls: ['styles/default.css']
})
export class DefaultComponent {

	public get componentType(): ScheduleComponentType {
		return ScheduleComponentType.DEFAULT;
	}

	@Input()
	@HostBinding('class.editable')
	public editable: boolean = false;

	@Input()
	public id: string = '';

	@Input()
	@HostBinding('attr.data-position')
	public position: number = 0;

	@Input()
	@HostBinding('attr.data-duration')
	public duration: number = 15;

	@Input()
	public get start(): number {
		return this.scheduleConfigurationService.start;
	}

	@Input()
	public get end(): number {
		return this.scheduleConfigurationService.end;
	}

	@Input()
	public get sidePadding(): number {
		return this.scheduleConfigurationService.sidePadding;
	}

	constructor(
		public elementRef: ElementRef,
		public scheduleConfigurationService: ScheduleConfigurationService
	) {
	}
}
