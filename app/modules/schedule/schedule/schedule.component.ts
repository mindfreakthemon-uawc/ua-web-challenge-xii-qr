import { Component, ElementRef, HostBinding, HostListener, ViewChild } from '@angular/core';
import { DefaultComponent } from './default.component';
import { ScheduleConfigurationService } from './services/schedule-configuration.service';
import { ScheduleComponentService } from './services/schedule-component.service';


@Component({
	moduleId: module.id,
	selector: 'svg[schedule]',
	templateUrl: 'tmpl/schedule.html',
	styleUrls: ['styles/schedule.css']
})
export class ScheduleComponent {

	@HostBinding('attr.viewBox')
	viewBox = '0 0 100 100';

	@HostBinding('attr.preserveAspectRatio')
	preserveAspectRatio = 'none';

	protected dragTarget: DefaultComponent;

	protected dragType: string = 'position';

	protected editTarget: DefaultComponent;

	constructor(
		public elementRef: ElementRef,
		protected scheduleConfigurationService: ScheduleConfigurationService,
		protected scheduleComponentService: ScheduleComponentService
	) {
	}

	@HostListener('mousedown', ['$event'])
	public grab(event: MouseEvent): void {
		const target = event.target as Element;

		const componentTarget = this.findComponent(target.closest('svg'));

		if (!componentTarget) {
			return;
		}

		if (target.classList.contains('resize')) {
			this.dragType = 'duration';
		} else {
			this.dragType = 'position';
		}

		this.dragTarget = componentTarget;
	}

	@HostListener('click', ['$event'])
	public activate(event: MouseEvent): void {
		const target = event.target as Element;

		if (this.editTarget) {
			this.editTarget.editable = false;
			this.editTarget = null;
		}

		const componentTarget = this.findComponent(target.closest('svg'));

		if (!componentTarget) {
			return;
		}

		this.editTarget = componentTarget;

		componentTarget.editable = true;

		event.stopPropagation();
	}

	@HostListener('mousemove', ['$event'])
	public drag(event: MouseEvent): void {
		if (!this.dragTarget) {
			return;
		}

		const dragTarget = this.dragTarget;
		const delta = event.movementX;
		const children = this.scheduleComponentService.componentRefs
			.map((componentRef) => componentRef.instance)
			.filter((component) => component.componentType === dragTarget.componentType);

		switch (this.dragType) {
			case 'duration':
				const duration = dragTarget.duration + delta;

				if (duration < 15 || duration + dragTarget.position > this.scheduleConfigurationService.duration) {
					return;
				}

				if (children.some((component) => {
					if (component === dragTarget) {
						// same component
						return false;
					}

					// if ((component.position + component.duration) >= position && component.position < position) {
					// 	return true;
					// }
					//
					// if ((position + this.dragTarget.duration) > component.position && position < component.position) {
					// 	return true;
					// }

					return false;
				})) {
					return;
				}

				dragTarget.duration = duration;

				break;
			case 'position':
				const position = dragTarget.position + delta;

				if (position < 0 || position + dragTarget.duration > this.scheduleConfigurationService.duration) {
					return;
				}

				if (children.some((component) => {
					if (component === dragTarget) {
						// same component
						return false;
					}

					// if ((component.position + component.duration) >= position && component.position < position) {
					// 	return true;
					// }
					//
					// if ((position + dragTarget.duration) > component.position && position < component.position) {
					// 	return true;
					// }

					return false;
				})) {
					return;
				}

				dragTarget.position = position;

				break;
		}
	}

	@HostListener('document:mouseup')
	public drop(): void {
		this.dragTarget = null;
	}

	public deactivate(): void {
		this.editTarget = null;
	}

	protected findComponent(svg: SVGSVGElement): DefaultComponent {
		return this.scheduleComponentService.componentRefs
			.map((componentRef) => componentRef.instance)
			.find((component) => component.elementRef.nativeElement === svg);
	}
}
