import { Injectable, signal } from '@angular/core';

export type UiFeedbackKind = 'success' | 'error';

export interface UiFeedbackMessage {
  id: number;
  kind: UiFeedbackKind;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
  readonly messages = signal<UiFeedbackMessage[]>([]);

  showSuccess(message: string): void {
    this.push('success', message);
  }

  showError(message: string): void {
    this.push('error', message);
  }

  dismiss(id: number): void {
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }

  private push(kind: UiFeedbackKind, message: string): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    this.messages.update((messages) => [...messages, { id, kind, message }]);
    window.setTimeout(() => this.dismiss(id), kind === 'error' ? 7000 : 4500);
  }
}
