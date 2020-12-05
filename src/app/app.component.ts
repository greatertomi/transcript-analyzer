import {Component, OnInit} from '@angular/core';
import {Color, Label, SingleDataSet} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import {DataService} from './shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'transcript-analyser';
  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  agents;
  pieChartLabels: Label[] = ['Matched', 'Expected'];
  pieChartData: SingleDataSet;
  pieChartLegend = false;
  pieChartPlugins = [];
  pieChartReady = false;
  pieChartOptions: ChartOptions = {
    responsive: true
  };
  selectedAgent = '';
  selectedCall = '';

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.analyzeData();
  }

  getAgents(): void {

  }

  analyzeData(): void {
    this.pieChartData = [2, 10];
    this.pieChartReady = true;
  }

}
