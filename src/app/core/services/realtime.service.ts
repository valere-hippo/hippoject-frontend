import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private source: EventSource | null = null;
  private readonly eventsSubject = new Subject<{ type: string; payload: string }>();
  readonly events$ = this.eventsSubject.asObservable();

  connect(): void {
    if (this.source) {
      return;
    }

    this.source = new EventSource(`${environment.apiBaseUrl}/realtime/events`);
    ['connected', 'project-updated', 'notifications-updated'].forEach((eventType) => {
      this.source?.addEventListener(eventType, (event: MessageEvent) => {
        this.eventsSubject.next({ type: eventType, payload: event.data });
      });
    });

    this.source.onerror = () => {
      this.disconnect();
      window.setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect(): void {
    this.source?.close();
    this.source = null;
  }
}
