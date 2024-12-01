import {
  Component,
  inject,
  REQUEST,
  REQUEST_CONTEXT,
  RESPONSE_INIT,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, RouterLink, ToastComponent, ToastComponent],
})
export class AppComponent {
  request = inject(REQUEST);
  requestContext = inject(REQUEST_CONTEXT);
  responseInit = inject(RESPONSE_INIT);

  constructor() {
    if (this.request) {
      console.log('url', this.request.url);
      console.log('lang', this.request.headers.get('accept-language'));
    }

    if (this.responseInit) {
      this.responseInit.status = 201;
    }

    const headers = this.responseInit?.headers as Headers;

    if (headers) {
      headers.append('X-Secret', 'Manfred was here!');
    }
  }
}
