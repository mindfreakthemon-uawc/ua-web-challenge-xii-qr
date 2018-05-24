import { Component, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { DefaultComponent } from './default.component';
import { ScheduleConfigurationService } from './services/schedule-configuration.service';
import { ScheduleComponentType } from './enums/schedule-component-type.enum';


@Component({
	moduleId: module.id,
	selector: 'svg[area-label]',
	templateUrl: 'tmpl/area-label.html',
	styleUrls: ['styles/area-label.css'],
	providers: [
		{
			provide: DefaultComponent,
			useExisting: forwardRef(() => AreaLabelComponent)
		}
	]
})
export class AreaLabelComponent extends DefaultComponent {

	public get componentType(): ScheduleComponentType {
		return ScheduleComponentType.AREA_LABEL;
	}

	@Input()
	@HostBinding('attr.data-text')
	public text: string = '';

	@Input()
	public fontSize: number = 10;

	@Input()
	@HostBinding('attr.data-color')
	public color: string = 'hsl(0, 0%, 60%)';

	@Input()
	@HostBinding('attr.data-bgColor')
	public bgColor: string = 'hsl(0, 0%, 60%)';

	@HostBinding('attr.y')
	public y: number = 0;

	@HostBinding('attr.x')
	public x: number = 0;

	@HostBinding('attr.height')
	public height: number = 100;

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
		public scheduleConfigurationService: ScheduleConfigurationService) {
		super(elementRef, scheduleConfigurationService);
	}
}
