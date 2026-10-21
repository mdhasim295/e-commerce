import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  templateUrl: './toast-host.component.html',
  styleUrls: ['./toast-host.component.scss'],
})
export class ToastHostComponent {
  readonly toast$ = this.toastService.toast$;

  constructor(private readonly toastService: ToastService) {}

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
