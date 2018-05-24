import { Component, ElementRef, forwardRef, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { DefaultComponent } from './default.component';
import { ScheduleConfigurationService } from './services/schedule-configuration.service';
import { ScheduleComponentType } from './enums/schedule-component-type.enum';


@Component({
	moduleId: module.id,
	selector: 'svg[ruler]',
	templateUrl: 'tmpl/ruler.html',
	styleUrls: ['styles/ruler.css'],
	providers: [
		{
			provide: DefaultComponent,
			useExisting: forwardRef(() => RulerComponent)
		}
	]
})
export class RulerComponent extends DefaultComponent implements OnChanges, OnInit {

	public get componentType(): ScheduleComponentType {
		return ScheduleComponentType.RULER;
	}

	@Input()
	public delta: number = 15;

	@Input()
	public topPadding: number = 15;

	@Input()
	public oddTopExtraPadding: number = 25;

	@Input()
	public textLength: number = 40;

	@Input()
	public fontSize: number = 10;

	@Input()
	public stroke: string = '#000';

	@Input()
	public strokeWidth: number = 1;

	@Input()
	public strokeHourWidth: number = 4;

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

	protected array: number[] = [];

	constructor(
		public elementRef: ElementRef,
		public scheduleConfigurationService: ScheduleConfigurationService) {
		super(elementRef, scheduleConfigurationService);
	}

	public ngOnInit(): void {
		this.recalculate();
	}

	public ngOnChanges(): void {
		this.recalculate();
	}

	public recalculate(): void {
		let count = Math.ceil((this.end - this.start - this.sidePadding * 2) / this.delta);

		if (count) {
			this.array = new Array(count).fill(0);
		}
	}

	public isHourLine(index: number): boolean {
		return index * this.delta % 60 === 0;
	}

	public getXCoordinate(index: number): number {
		return this.sidePadding + this.delta * index;
	}

	public getHourString(index: number): string {
		let hour = String((Math.floor((index * this.delta + this.start) / 60)) % 24);

		return `${hour.padStart(2, '0')}:00`;
	}
}
