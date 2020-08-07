import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
	selector: 'switch-control',
	templateUrl: './switch-control.html',
	styleUrls: ['./switch-control.scss']
})

export class SwitchControlComponent {
	@Output() changed = new EventEmitter<boolean>();

	@Input() active = false;
	@Input() disabled = false;
	@Input() loading = false;

	switchState(active: boolean) {
		this.changed.emit(active);
	}
}
