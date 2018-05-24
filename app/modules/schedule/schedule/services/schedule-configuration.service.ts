import { Injectable } from '@angular/core';


@Injectable()
export class ScheduleConfigurationService {

	private _start: number = 300;

	private _end: number = 30 * 60;

	private _sidePadding: number = 25;

	get start(): number {
		return this._start;
	}

	set start(value: number) {
		this._start = value;
	}

	get end(): number {
		return this._end;
	}

	set end(value: number) {
		this._end = value;
	}

	get duration(): number {
		return this._end - this._start;
	}

	get sidePadding(): number {
		return this._sidePadding;
	}

	set sidePadding(value: number) {
		this._sidePadding = value;
	}
}
