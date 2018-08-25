import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PekitHeadersComponent } from './pekit-headers.component';

describe('PekitHeadersComponent', () => {
	let component: PekitHeadersComponent;
	let fixture: ComponentFixture<PekitHeadersComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PekitHeadersComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PekitHeadersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
