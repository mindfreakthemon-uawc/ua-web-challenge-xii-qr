import { Component, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { DefaultComponent } from './default.component';
import { ScheduleConfigurationService } from './services/schedule-configuration.service';
import { ScheduleComponentType } from './enums/schedule-component-type.enum';


@Component({
	moduleId: module.id,
	selector: 'svg[event-label]',
	templateUrl: 'tmpl/event-label.html',
	styleUrls: ['styles/event-label.css'],
	providers: [
		{
			provide: DefaultComponent,
			useExisting: forwardRef(() => EventLabelComponent)
		}
	]
})
export class EventLabelComponent extends DefaultComponent {

	public get componentType(): ScheduleComponentType {
		return ScheduleComponentType.EVENT_LABEL;
	}

	@Input()
	@HostBinding('attr.data-text')
	public text: string = '';

	@Input()
	public fontSize: number = 10;

	@Input()
	@HostBinding('attr.data-color')
	public color: string = 'hsl(0, 0%, 60%)';

	@HostBinding('attr.y')
	public y: number = 50;

	@HostBinding('attr.x')
	public x: number = 0;

	@HostBinding('attr.height')
	public height: number = 50;

	@HostBinding('attr.width')
	public width: number = 100;

	@HostBinding('attr.preserveAspectRatio')
	protected preserveAspectRatio = 'none';

	@HostBinding('attr.viewBox')
	protected get viewBox() {
		return `0 0 ${this.end - this.start} 200`;
	}

	constructor(
		public elementRef: ElementRef,
		public scheduleConfigurationService: ScheduleConfigurationService
	) {
		super(elementRef, scheduleConfigurationService);
	}
}
