import {PersonModel} from './person.model';
import {ScriptModel} from './script.model';

export class CallDetailModel {
  call_id: string;
  file_url: string;
  calltype_id: string;
  call_datetime: string;
  duration: number;
  agent: PersonModel[];
  customer: PersonModel[];
  script: ScriptModel[];
  transcript: ScriptModel[];
}
