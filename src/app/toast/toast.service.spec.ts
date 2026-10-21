import { fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  afterEach(() => service.dismiss());

  it('publishes a toast and automatically dismisses it', fakeAsync(() => {
    service.show('Added to bag', 'success', 1000);

    expect(service.getCurrent()?.message).toBe('Added to bag');
    expect(service.getCurrent()?.type).toBe('success');

    tick(1000);
    expect(service.getCurrent()).toBeNull();
  }));

  it('replaces the current toast and ignores stale dismiss requests', fakeAsync(() => {
    service.show('First message', 'info', 1000);
    const firstId = service.getCurrent()!.id;

    service.show('Second message', 'error', 2000);
    service.dismiss(firstId);

    expect(service.getCurrent()?.message).toBe('Second message');
    tick(2000);
    expect(service.getCurrent()).toBeNull();
  }));

  it('dismisses the current toast immediately', () => {
    service.show('Saved', 'success');
    const id = service.getCurrent()!.id;

    service.dismiss(id);

    expect(service.getCurrent()).toBeNull();
  });
});
