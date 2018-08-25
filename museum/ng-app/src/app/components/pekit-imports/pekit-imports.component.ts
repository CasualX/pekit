import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PeKitService } from '../../services/pekit/pekit.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-pekit-imports',
	templateUrl: './pekit-imports.component.html',
	styleUrls: ['./pekit-imports.component.scss']
})
export class PekitImportsComponent implements OnInit, OnDestroy {
	@Input()
	result: any;
	error: string;
	sub: Subscription;

	constructor(private pekitService: PeKitService ) {}

	ngOnInit() {
		this.sub = this.pekitService.resultObservable$.subscribe({
			next: value => (this.result = value.data),
			error: err => (this.result = err.data),
			complete: () => console.log('Observable completed')
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
