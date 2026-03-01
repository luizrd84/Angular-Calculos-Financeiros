import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCalculator } from './fees-calculator';

describe('FeesCalculator', () => {
  let component: FeesCalculator;
  let fixture: ComponentFixture<FeesCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
