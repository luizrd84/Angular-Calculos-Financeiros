import { Component } from '@angular/core';

import { FeesCalculator } from '../../shared/components/fees-calculator/fees-calculator';


@Component({
  selector: 'app-home',
  imports: [FeesCalculator],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
