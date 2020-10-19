import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: Message[] = [];
  messagesCount: number;

  add(message: string) {
    this.messages.push({created: Date.now(), message: message, isError: false});
    this.messagesCount = this.messages.length;
    console.info(message);
  }

  error(message: string) {
    this.messages.push({created: Date.now(), message: message, isError: true});
    this.messagesCount = this.messages.length;
    console.error(message);
  }

  clear() {
    this.messages = [];
    this.messagesCount = this.messages.length;
  }
}

export class Message {
  public created: number;
  public message: string;
  public isError: boolean;
}