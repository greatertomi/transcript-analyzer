export class ScriptModel {
  order: number;
  similarity: number;
  sentence: string;
  matching_sentence: string;
  channel?: number;
  timeFrom?: number;
  timeTo?: number;
  formattedTime?: string;
}
