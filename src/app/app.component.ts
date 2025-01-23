import { Component } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Tour of Heroes';
  skipLinksPath = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((routerEvent: Event) => routerEvent instanceof NavigationEnd),
        map(({ url }: NavigationEnd) => this.trimmedUrl(url)),
        distinctUntilChanged()
      )
      .subscribe((currentUrl: string) => {
        this.skipLinksPath = `${currentUrl}#content`;
      });
  }

  private trimmedUrl(url: string): string {
    return url.replace('#content', '');
  }
}
