import {PersonModel} from './person.model';

export class CallModel {
  call_id: string;
  calltype_id: string;
  agent: PersonModel[];
  customer: PersonModel[];
  call_start_time: string;
  gs_file_url: string;
  duration: number;
}
