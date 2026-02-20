
export type JourneyType = 'AMINA' | 'CHUKA' | 'BOLA' | 'ADMIN';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
  audio?: string;
  isSynced?: boolean;
}

export interface AppEvent {
  id: string;
  timestamp: Date;
  message: string;
  type: 'success' | 'info' | 'alert';
}
