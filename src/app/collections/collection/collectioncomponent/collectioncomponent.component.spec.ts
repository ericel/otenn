import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectioncomponentComponent } from './collectioncomponent.component';

describe('CollectioncomponentComponent', () => {
  let component: CollectioncomponentComponent;
  let fixture: ComponentFixture<CollectioncomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectioncomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectioncomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
