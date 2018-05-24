import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ScheduleComponentService } from '../schedule/services/schedule-component.service';
import { ScheduleComponentType } from '../schedule/enums/schedule-component-type.enum';
import { ScheduleConfigurationService } from '../schedule/services/schedule-configuration.service';
import { DefaultComponent } from '../schedule/default.component';
import { ScheduleComponent } from '../schedule/schedule.component';

@Component({
	moduleId: module.id,
	selector: 'schedule-editor',
	templateUrl: 'tmpl/schedule-editor.html',
	styleUrls: ['styles/schedule-editor.css']
})
export class ScheduleEditorComponent {

	public ScheduleComponentType = ScheduleComponentType;

	public scheduleComponentTypes: ScheduleComponentType[] = [
		ScheduleComponentType.AREA_LABEL,
		ScheduleComponentType.BLOCK,
		ScheduleComponentType.EVENT_LABEL
	];

	/* + form fields */

	public scheduleComponentType: ScheduleComponentType = ScheduleComponentType.AREA_LABEL;

	public position: string = '00:00';

	public duration: string = '00:15';

	public text: string = '';

	public color: string = '#000';

	public bgColor: string = '#000';

	public isExtraHeight: boolean = false;

	/* - form fields */

	@ViewChild(ScheduleComponent)
	protected schedule: ScheduleComponent;

	@ViewChild('dynamicAreaLabel', { read: ViewContainerRef })
	protected areaLabelContainerRef: ViewContainerRef;

	@ViewChild('dynamicEventLabel', { read: ViewContainerRef })
	protected eventLabelContainerRef: ViewContainerRef;

	@ViewChild('dynamicBlock', { read: ViewContainerRef })
	protected blockContainerRef: ViewContainerRef;

	constructor(
		protected scheduleComponentService: ScheduleComponentService,
		protected scheduleConfigurationService: ScheduleConfigurationService
	) {
	}

	public submit(): void {
		const containerRef = this.getContainerRef(this.scheduleComponentType);
		const position = this.parseTime(this.position);
		const duration = this.parseTime(this.duration);

		this.scheduleComponentService.addDynamicComponent(containerRef, this.scheduleComponentType, {
			position: Math.min(position, this.scheduleConfigurationService.duration - Math.max(duration, 15)),
			duration: Math.max(duration, 15),
			text: this.text,
			color: this.color,
			bgColor: this.bgColor,
			isExtraHeight: this.isExtraHeight,
			id: String(Math.floor(Math.random() * 100000))
		});
	}

	public remove(component: DefaultComponent): void {
		const containerRef = this.getContainerRef(component.componentType);

		this.scheduleComponentService.removeDynamicComponent(containerRef, component);

		this.schedule.deactivate();
	}

	public removeAll(): void {
		this.scheduleComponentService.componentRefs.forEach((componentRef) => this.remove(componentRef.instance));
	}

	public exportSVG(): void {
		const svg = this.schedule.elementRef.nativeElement;

		// TODO fix scaling
		svg.setAttribute('width', '2000px');
		svg.setAttribute('height', '1500px');

		const string = new XMLSerializer().serializeToString(svg);

		svg.setAttribute('width', '100%');
		svg.setAttribute('height', '500px');

		const a = document.createElement('a');
		a.href = 'data:image/svg+xml;base64,' + btoa(string);
		a.download = 'image.svg';

		a.dispatchEvent(new MouseEvent('click'));
	}

	public exportPNG(): void {
		const svg = this.schedule.elementRef.nativeElement as SVGSVGElement;

		// TODO fix scaling
		svg.setAttribute('width', '2000px');
		svg.setAttribute('height', '1500px');

		const string = new XMLSerializer().serializeToString(svg);
		const svgSize = svg.getBoundingClientRect();

		svg.setAttribute('width', '100%');
		svg.setAttribute('height', '500px');

		const img = document.createElement('img');
		img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(string));

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = svgSize.width;
		canvas.height = svgSize.height;

		img.onload = function () {
			ctx.drawImage(img, 0, 0);

			const a = document.createElement('a');
			a.href = canvas.toDataURL('image/png');
			a.download = 'image.png';

			a.dispatchEvent(new MouseEvent('click'));
		};
	}

	public importSVG(event: Event): void {
		const input = event.target as HTMLInputElement;

		const fileReader = new FileReader();

		fileReader.onload = () => {
			const parser = new DOMParser();
			const svg = parser.parseFromString(fileReader.result, 'image/svg+xml').firstChild;

			this.removeAll();

			Array.from(svg.childNodes)
				.forEach((node: HTMLElement) => {
					if (node.tagName !== 'svg') {
						return;
					}

					if (node.hasAttribute('area-label')) {
						this.scheduleComponentType = ScheduleComponentType.AREA_LABEL;
					} else if (node.hasAttribute('event-label')) {
						this.scheduleComponentType = ScheduleComponentType.EVENT_LABEL;
					} else if (node.hasAttribute('block')) {
						this.scheduleComponentType = ScheduleComponentType.BLOCK;
					} else {
						return;
					}

					this.text = node.dataset.text;
					this.color = node.dataset.color;
					this.bgColor = node.dataset.bgColor;
					this.isExtraHeight = node.dataset.isExtraHeight === 'true';
					this.position = this.formatTime(Number(node.dataset.position));
					this.duration = this.formatTime(Number(node.dataset.duration));

					this.submit();
				})

		};

		fileReader.readAsText(input.files[0]);
	}

	protected parseTime(time: string): number {
		const [hours, minutes] = time.split(':');

		return parseInt(hours) * 60 + parseInt(minutes);
	}

	protected formatTime(time: number): string {
		const hours = String(Math.floor(time / 60));
		const minutes = String(time % 60);

		return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
	}

	protected getContainerRef(componentType: ScheduleComponentType): ViewContainerRef {
		switch (componentType) {
			case ScheduleComponentType.AREA_LABEL:
				return this.areaLabelContainerRef;

			case ScheduleComponentType.BLOCK:
				return this.blockContainerRef;

			case ScheduleComponentType.EVENT_LABEL:
				return this.eventLabelContainerRef;
		}
	}
}
