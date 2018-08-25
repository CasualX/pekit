import { TestBed, inject } from '@angular/core/testing';

import { PeKitService } from './pekit.service';

describe('PeKitService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PeKitService]
		});
	});

	it('should be created', inject([PeKitService], (service: PeKitService) => {
		expect(service).toBeTruthy();
	}));
});
