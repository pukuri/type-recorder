export interface Question {
  id: number;
  content: string;
}

export interface KeystrokeEvent {
  type: 'keydown' | 'keyup';
  key: string;
  timestamp: number;
  value: string;
}

export interface ReplayableAnswer {
  id?: number;
  uuid?: string;
  username: string;
  question_id: number;
  recording_data: KeystrokeEvent[];
}

export interface ReplayableAnswerResponse {
  id: number;
  uuid: string;
  username: string;
  question: string;
  recording_data: KeystrokeEvent[];
  created_at: string;
}