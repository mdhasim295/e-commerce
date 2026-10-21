import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(
    null,
  );
  private nextId = 0;
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;
  readonly toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastType = 'info', duration = 3500): void {
    this.clearTimer();
    const toast = { id: ++this.nextId, message, type };
    this.toastSubject.next(toast);
    this.dismissTimer = setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id?: number): void {
    const current = this.toastSubject.value;
    if (id !== undefined && current?.id !== id) return;
    this.clearTimer();
    this.toastSubject.next(null);
  }

  getCurrent(): ToastMessage | null {
    return this.toastSubject.value;
  }

  private clearTimer(): void {
    if (this.dismissTimer !== null) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
}
