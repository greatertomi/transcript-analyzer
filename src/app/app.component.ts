import {Component, OnInit} from '@angular/core';
import {Label, SingleDataSet} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import {DataService} from './shared/data.service';
import {PersonModel} from './models/person.model';
import {CallModel} from './models/call.model';
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
  pieChart1Data: SingleDataSet;
  pieChart2Data: SingleDataSet;
  pieChartLegend = false;
  pieChartPlugins = [];
  pieChart1Ready = false;
  pieChart2Ready = true;
  pieChartOptions: ChartOptions = {
    responsive: true
  };
  selectedAgent = '';
  selectedCall = '';
  transcript: ScriptModel[] = [];
  script: ScriptModel[] = [];
  agentName;
  guestName;
  currentMatchingPercent;
  currentMatchingSentence = '';
  highlightOrder = 4;
  selected = false;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.getAgents();
    this.getAgentCalls();
    this.pieChart2Data = [0, 100];
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
      this.selected = true;
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

  calculateMatchPercent(agentSentence, scriptSentence): number {
    const sentenceMap = {};
    const scriptMap = {};
    const agentBreakdown = agentSentence.replace(/[&\/\\#,+()$~%.":*?<>{}-]/g, '').split(/[., ]/);
    const scriptBreakdown = scriptSentence.replace(/[&\/\\#,+()$~%.":*?<>{}-]/g, '').split(/[., ]/);
    for (const word of agentBreakdown) {
      if (word in sentenceMap) {
        sentenceMap[word] += 1;
      } else {
        sentenceMap[word] = 1;
      }
    }
    for (const word of scriptBreakdown) {
      if (word in scriptMap) {
        scriptMap[word] += 1;
      } else {
        scriptMap[word] = 1;
      }
    }
    let count = 0;
    for (const word in sentenceMap) {
      if (word in scriptMap) {
        count += sentenceMap[word];
      }
    }
    const matchPercent = (count / scriptBreakdown.length) * 100;
    return Math.round(matchPercent);
  }

  matchSentences(word): void {
    const matchPercent = this.calculateMatchPercent(word.sentence, word.matching_sentence);
    const scriptWord = this.script.filter(e => e.similarity === word.similarity)[0];
    if (scriptWord) {
      this.highlightOrder = scriptWord.order;
      this.currentMatchingSentence = `${matchPercent}% matching with line #${scriptWord.order} "${scriptWord.matching_sentence}"`;
    }
    this.analyzeData(matchPercent);
    this.currentMatchingPercent = matchPercent;
  }

  analyzeData(num): void {
    this.pieChart1Data = [num, 100 - num];
    this.pieChart1Ready = true;
  }

}
