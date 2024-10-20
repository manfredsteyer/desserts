import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DessertDetailComponent } from './dessert-detail.component';

describe('DessertDetailComponent', () => {
  let component: DessertDetailComponent;
  let fixture: ComponentFixture<DessertDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DessertDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DessertDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
