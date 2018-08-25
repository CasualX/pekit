import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PekitIndexComponent } from './pekit-index.component';

describe('PekitIndexComponent', () => {
  let component: PekitIndexComponent;
  let fixture: ComponentFixture<PekitIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PekitIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PekitIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
