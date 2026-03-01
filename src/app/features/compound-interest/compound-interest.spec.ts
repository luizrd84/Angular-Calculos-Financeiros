import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundInterest } from './compound-interest';

describe('CompoundInterest', () => {
  let component: CompoundInterest;
  let fixture: ComponentFixture<CompoundInterest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompoundInterest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompoundInterest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
