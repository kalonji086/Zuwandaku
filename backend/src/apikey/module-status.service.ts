import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface ModuleStatusEvent {
  role: string;
  module: string;
  enabled: boolean;
}

@Injectable()
export class ModuleStatusService {
  private events$ = new Subject<ModuleStatusEvent>();

  get stream$() {
    return this.events$.asObservable();
  }

  broadcast(event: ModuleStatusEvent) {
    this.events$.next(event);
  }
}
