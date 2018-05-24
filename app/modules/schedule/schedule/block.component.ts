import { Component, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { DefaultComponent } from './default.component';
import { ScheduleConfigurationService } from './services/schedule-configuration.service';
import { ScheduleComponentType } from './enums/schedule-component-type.enum';


@Component({
	moduleId: module.id,
	selector: 'svg[block]',
	templateUrl: 'tmpl/block.html',
	styleUrls: ['styles/block.css'],
	providers: [
		{
			provide: DefaultComponent,
			useExisting: forwardRef(() => BlockComponent)
		}
	]
})
export class BlockComponent extends DefaultComponent {

	public get componentType(): ScheduleComponentType {
		return ScheduleComponentType.BLOCK;
	}

	@Input()
	public topPadding: number = 55;

	@Input()
	public topExtraPadding: number = 15;

	@Input()
	@HostBinding('attr.data-isExtraHeight')
	public isExtraHeight: boolean = false;

	@Input()
	@HostBinding('attr.data-color')
	public color: string = 'hsl(0, 0%, 60%)';

	@HostBinding('attr.y')
	public y: number = 30;

	@HostBinding('attr.x')
	public x: number = 0;

	@HostBinding('attr.height')
	public height: number = 20;

	@HostBinding('attr.width')
	public width: number = 100;

	@HostBinding('attr.preserveAspectRatio')
	protected preserveAspectRatio = 'none';

	@HostBinding('attr.viewBox')
	protected get viewBox() {
		return `0 0 ${this.end - this.start} 100`;
	}

	constructor(
		public elementRef: ElementRef,
		public scheduleConfigurationService: ScheduleConfigurationService) {
		super(elementRef, scheduleConfigurationService);
	}
}
