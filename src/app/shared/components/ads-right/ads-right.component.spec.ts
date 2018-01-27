import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsRightComponent } from './ads-right.component';

describe('AdsRightComponent', () => {
  let component: AdsRightComponent;
  let fixture: ComponentFixture<AdsRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
