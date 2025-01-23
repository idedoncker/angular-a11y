import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError, map, of, take } from 'rxjs';
import { Hero } from './hero';
import { HeroService } from './hero.service';

export const heroResolver: ResolveFn<Observable<Hero>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Inject hero service
  const heroService = inject(HeroService);

  // Get hero id from snapshot
  const heroId = route.params['id'];

  // Get hero data by id
  return heroService.getHero(heroId).pipe(take(1));
};

export const heroTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<string> => {
  // Inject hero service
  const heroService = inject(HeroService);

  // Get hero id from snapshot
  const heroId = route.params['id'];

  // Get hero data by id and map to name
  return heroService.getHero(heroId).pipe(
    take(1),
    map((hero: Hero) => `${hero.name}`)
  );
};
