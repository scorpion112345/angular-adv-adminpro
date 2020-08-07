import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  labels1: string[] = ['Ventas', 'Tiendas', 'Emails'];
  data1 = [[350, 450, 100]];

  labels2: string[] = ['Sandia', 'Manzanas', 'peras'];
  data2 = [[100, 1000, 500]];

}
