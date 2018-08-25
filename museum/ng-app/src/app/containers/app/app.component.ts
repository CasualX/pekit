import { Component, OnDestroy, OnInit } from '@angular/core';
import { PeKitService } from '../../services/pekit/pekit.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
	selector: 'app-root',
	styleUrls: ['app.component.scss'],
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
	result: any;
	error: string;
	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
	sub: Subscription;

	constructor(private pekitService: PeKitService, private breakpointObserver: BreakpointObserver) {}

	handleImage(image: ArrayBuffer) {
		const array = new Uint8Array(image);
		this.pekitService.parseNext(array);
	}

	ngOnInit() {
		this.sub = this.pekitService.resultObservable$.subscribe({
			next: (value) => ({ data : this.result, error: this.error } = value),
			error: (err) => ({ data : this.result, error: this.error } = err),
			complete: () => console.log('Observable completed')
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
