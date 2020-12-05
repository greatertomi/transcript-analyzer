import {Component, OnInit} from '@angular/core';
import {Color, Label, SingleDataSet} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import {DataService} from './shared/data.service';
import {PersonModel} from './models/person.model';
import {CallModel} from './models/call.model';
import {CallDetailModel} from './models/call-detail.model';
import {ScriptModel} from './models/script.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'transcript-analyser';
  agents: PersonModel[] = [];
  calls: CallModel[] = [];
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
  transcript: ScriptModel[] = [];
  script: ScriptModel[] = [];
  agentName;
  guestName;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.analyzeData();
    this.getAgents();
    this.selectedAgent = 'A7f63308a';
    this.selectedCall = '572a41e7a';
    this.getAgentCalls();
    this.getScripts();
  }

  getAgents(): void {
    this.agents = this.dataService.agents;
  }

  getAgentCalls(): void {
    const agent_calls: CallModel[] = this.dataService.calls;
    this.calls = [];
    for (const call of agent_calls) {
      const agentCallNos = call.agent.filter(e => e.agent_id === this.selectedAgent);
      if (agentCallNos.length > 0) {
        this.calls.push(call);
      }
      call.call_date = this.parseDateTime(call.call_start_time);
    }
  }

  parseDateTime(dateTime): string {
    const dateArr = dateTime.split(/[-: ]/);
    return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`;
  }

  getScripts(): void {
    const agentFullName = this.agents.filter(e => e.agent_id === this.selectedAgent)[0].full_name;
    this.agentName = agentFullName.split(' ')[0];
    const guestFullName = this.calls.filter(e => e.call_id === this.selectedCall)[0].customer[0].full_name;
    this.guestName = guestFullName.split(' ')[0];
    const currentTranscript = this.dataService.callDetails.transcript;
    for (const call of currentTranscript) {
      call.formattedTime = this.formatTimeFrom(call.timeFrom);
    }
    if (this.selectedCall) {
      this.script = this.dataService.callDetails.script;
      this.transcript = currentTranscript;
    }
  }

  formatTimeFrom(time): string {
    const minutes = Math.floor(time / 60);
    let seconds: any = Math.floor(time % 60);
    if (+seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  analyzeData(): void {
    this.pieChartData = [2, 10];
    this.pieChartReady = true;
  }

}
