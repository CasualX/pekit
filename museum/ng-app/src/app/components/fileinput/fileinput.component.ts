import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-fileinput',
	templateUrl: './fileinput.component.html',
	styleUrls: ['./fileinput.component.scss']
})
export class FileInputComponent {
	@Input()
	result: any;

	@Input()
	errorMsg: string;

	@Output()
	image: EventEmitter<ArrayBuffer> = new EventEmitter();

	loadFile(files: FileList) {
		if (files.length < 1) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => this.image.emit(reader.result as ArrayBuffer);
		reader.readAsArrayBuffer(files[0]);
	}

	get message(): string {
		if (this.result && !this.errorMsg) {
			return 'success';
		} else {
			return 'please choose a file and click submit';
		}
	}
}
