import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DessertsComponent } from './desserts.component';

describe('DessertsComponent', () => {
  let component: DessertsComponent;
  let fixture: ComponentFixture<DessertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DessertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DessertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
