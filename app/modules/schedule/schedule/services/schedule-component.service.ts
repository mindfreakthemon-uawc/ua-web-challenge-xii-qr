import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { AreaLabelComponent } from '../area-label.component';
import { BlockComponent } from '../block.component';
import { EventLabelComponent } from '../event-label.component';
import { RulerComponent } from '../ruler.component';
import { DefaultComponent } from '../default.component';
import { ScheduleComponentType } from '../enums/schedule-component-type.enum';

type ScheduleComponentMap = { [P in ScheduleComponentType]: typeof DefaultComponent };

@Injectable()
export class ScheduleComponentService {

	protected componentMap: ScheduleComponentMap = {
		[ScheduleComponentType.DEFAULT]: AreaLabelComponent,
		[ScheduleComponentType.AREA_LABEL]: AreaLabelComponent,
		[ScheduleComponentType.BLOCK]: BlockComponent,
		[ScheduleComponentType.EVENT_LABEL]: EventLabelComponent,
		[ScheduleComponentType.RULER]: RulerComponent,
	};

	public componentRefs: ComponentRef<DefaultComponent>[] = [];

	constructor(protected factoryResolver: ComponentFactoryResolver) {}

	addDynamicComponent(viewContainerRef: ViewContainerRef, componentType: ScheduleComponentType, options: any = {}): void {
		const componentTypeConstructor = this.componentMap[componentType];

		const factory = this.factoryResolver
			.resolveComponentFactory(componentTypeConstructor);

		const component = factory
			.create(viewContainerRef.parentInjector);

		Object.assign(component.instance, options);

		this.componentRefs.push(component);

		viewContainerRef.insert(component.hostView);
	}

	removeDynamicComponent(viewContainerRef: ViewContainerRef, component: DefaultComponent): void {
		let index = this.componentRefs.findIndex((componentRef) => componentRef.instance === component);

		viewContainerRef.remove(viewContainerRef.indexOf(this.componentRefs[index] as any));
		this.componentRefs.splice(index, 1);
	}
}
