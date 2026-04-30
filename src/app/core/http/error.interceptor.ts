import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UiFeedbackService } from '../services/ui-feedback.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const uiFeedback = inject(UiFeedbackService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message = resolveErrorMessage(req.method, error);
        if (message) {
          uiFeedback.showError(message);
        }
      }

      return throwError(() => error);
    })
  );
};

function resolveErrorMessage(method: string, error: HttpErrorResponse): string {
  const apiMessage = typeof error.error?.message === 'string' ? error.error.message.trim() : '';

  if (error.status === 403) {
    return apiMessage || 'Berechtigung nicht ausreichend.';
  }

  if (error.status === 0) {
    return 'Die Verbindung zum Server ist fehlgeschlagen.';
  }

  if (isWriteMethod(method)) {
    return apiMessage || 'Die Aktion konnte nicht abgeschlossen werden.';
  }

  if (error.status >= 500) {
    return apiMessage || 'Der Server hat einen Fehler zurückgegeben.';
  }

  return '';
}

function isWriteMethod(method: string): boolean {
  return method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
}
