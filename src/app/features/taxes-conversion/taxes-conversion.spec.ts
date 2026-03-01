import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesConversion } from './taxes-conversion';

describe('TaxesConversion', () => {
  let component: TaxesConversion;
  let fixture: ComponentFixture<TaxesConversion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxesConversion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxesConversion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
