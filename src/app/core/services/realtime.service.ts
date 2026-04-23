import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface RealtimeEvent {
  type: string;
  payload: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private readonly auth = inject(AuthService);
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private readonly eventsSubject = new Subject<RealtimeEvent>();
  readonly events$ = this.eventsSubject.asObservable();

  async connect(): Promise<void> {
    if (this.socket) {
      return;
    }

    const token = await this.auth.getToken();
    this.socket = new WebSocket(this.resolveWebSocketUrl(token));
    this.socket.onopen = () => {
      this.clearReconnectTimer();
      this.startHeartbeat();
    };
    this.socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as RealtimeEvent;
        this.eventsSubject.next(payload);
      } catch {
        this.eventsSubject.next({ type: 'message', payload: event.data });
      }
    };

    this.socket.onclose = () => {
      this.disconnect();
      this.reconnectTimer = window.setTimeout(() => void this.connect(), 3000);
    };
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.socket?.close();
    this.socket = null;
  }

  private resolveWebSocketUrl(token: string | null): string {
    if (environment.apiBaseUrl.startsWith('http://') || environment.apiBaseUrl.startsWith('https://')) {
      const url = new URL(environment.apiBaseUrl);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      url.pathname = '/ws/realtime';
      url.search = token ? `token=${encodeURIComponent(token)}` : '';
      return url.toString();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const suffix = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${protocol}//${window.location.host}/ws/realtime${suffix}`;
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 20000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer != null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer != null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
