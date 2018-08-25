import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PekitOutputComponent } from './pekit-output.component';

describe('PekitOutputComponent', () => {
	let component: PekitOutputComponent;
	let fixture: ComponentFixture<PekitOutputComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PekitOutputComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PekitOutputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
