import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Camera360Component } from './camera360.component';

describe('Camera360Component', () => {
  let component: Camera360Component;
  let fixture: ComponentFixture<Camera360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Camera360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Camera360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
