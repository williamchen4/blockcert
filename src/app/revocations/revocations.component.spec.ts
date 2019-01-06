import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevocationsComponent } from './revocations.component';

describe('RevocationsComponent', () => {
  let component: RevocationsComponent;
  let fixture: ComponentFixture<RevocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
