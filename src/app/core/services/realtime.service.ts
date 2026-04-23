import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private socket: WebSocket | null = null;
  private readonly eventsSubject = new Subject<{ type: string; payload: string }>();
  readonly events$ = this.eventsSubject.asObservable();

  connect(): void {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(this.resolveWebSocketUrl());
    this.socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { type: string; payload: string };
        this.eventsSubject.next(payload);
      } catch {
        this.eventsSubject.next({ type: 'message', payload: event.data });
      }
    };

    this.socket.onclose = () => {
      this.disconnect();
      window.setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  private resolveWebSocketUrl(): string {
    if (environment.apiBaseUrl.startsWith('http://') || environment.apiBaseUrl.startsWith('https://')) {
      const url = new URL(environment.apiBaseUrl);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      url.pathname = '/ws/realtime';
      url.search = '';
      return url.toString();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws/realtime`;
  }
}
