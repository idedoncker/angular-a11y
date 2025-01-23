import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy, UrlSegment } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Injectable()
export class HeroTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly heroService = inject(HeroService);

  subscription: Subscription | null = null;

  updateTitle(snapshot: RouterStateSnapshot): void {
    this.subscription?.unsubscribe();

    const customTitle = this.buildTitle(snapshot) || '';
    const firstChild = snapshot.root.firstChild;
    const heroId = firstChild?.params['id'] || '';

    if (heroId) {
      // Set hero name as page title
      this.subscription = this.heroService
        .getHero(heroId)
        .pipe(
          map((hero: Hero) => hero.name || ''),
          map((heroTitle: string) => `${heroTitle}`)
        )
        .subscribe((pageTitle) => this.title.setTitle(pageTitle));
    } else if (firstChild) {
      // Set page title to url segment sequence
      const routeSegments = firstChild.url.map(({ path }: UrlSegment) => path.charAt(0).toUpperCase() + path.slice(1));
      this.title.setTitle(routeSegments.join(' - '));
    } else {
      this.title.setTitle(customTitle);
    }
  }
}
