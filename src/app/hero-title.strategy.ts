import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy, UrlSegment } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { HeroService } from './hero.service';

@Injectable()
export class HeroTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly heroService = inject(HeroService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  subscription: Subscription | null = null;

  async updateTitle(snapshot: RouterStateSnapshot): Promise<void> {
    const firstChild = snapshot.root.firstChild;
    const heroId = firstChild?.params['id'] || '';

    let customTitle = this.buildTitle(snapshot) || '';

    if (heroId) {
      // Set hero name as page title
      const hero = await firstValueFrom(this.heroService.getHero(heroId));
      customTitle = hero.name;
    } else {
      // Set page title to url segment sequence
      const routeSegments = firstChild?.url.map(({ path }: UrlSegment) => path.charAt(0).toUpperCase() + path.slice(1));
      customTitle = routeSegments?.join(' - ') || customTitle;
    }

    this.liveAnnouncer.announce(customTitle);
    this.title.setTitle(customTitle);
  }
}
