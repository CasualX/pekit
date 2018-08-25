import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PeKitService } from '../../services/pekit/pekit.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-pekit-headers',
	templateUrl: './pekit-headers.component.html',
	styleUrls: ['./pekit-headers.component.scss']
})
export class PekitHeadersComponent implements OnInit, OnDestroy {
	@Input()
	result: any;
	error: string;
	sub: Subscription;

	constructor(private pekitService: PeKitService ) {}

	get dos_header(): any {
		return Object.entries(this.result.headers.DosHeader);
	}
	get file_header(): any {
		return Object.entries(this.result.headers.NtHeaders.FileHeader);
	}
	get optional_header(): any {
		return Object.entries(this.result.headers.NtHeaders.OptionalHeader);
	}
	get data_directory_keys(): any {
		return Object.keys(this.result.headers.DataDirectory[0]);
	}
	get data_directory_array(): any {
		return this.result.headers.DataDirectory;
	}
	get section_headers_keys(): any {
		return Object.keys(this.result.headers.SectionHeaders[0]);
	}
	get section_headers_array(): any {
		return this.result.headers.SectionHeaders;
	}


	ngOnInit() {
		this.sub = this.pekitService.resultObservable$.subscribe({
			next: (value) => this.result = value.data,
			error: (err) => this.result = err.data,
			complete: () => console.log('Observable completed')
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
