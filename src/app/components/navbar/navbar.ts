import { Component, HostListener, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ThemeService, PostService } from '../../services';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import Swal from 'sweetalert2';
import { Subscription, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Post } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AvatarPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit, OnDestroy {
  protected authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  private postService = inject(PostService);
  private router = inject(Router);
  protected environment = environment

  protected isMenuOpen = signal(false);
  protected shouldAnimate = signal(false);

  protected recommendations = signal<Post[]>([]);
  protected showRecommendations = signal(false);
  private searchQuery$ = new Subject<string>();

  private userSub?: Subscription;
  private searchSub?: Subscription;

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.shouldAnimate.set(true);
        setTimeout(() => this.shouldAnimate.set(false), 1000);
      }
    });

    this.searchSub = this.searchQuery$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          return of({ data: [] });
        }
        const currentUserId = this.authService.currentUser()?.id ?? null;
        return this.postService.getPosts(currentUserId, query);
      })
    ).subscribe({
      next: (response: any) => {
        const results = response.data || [];
        this.recommendations.set(results.slice(0, 5));
        this.showRecommendations.set(results.length > 0);
      },
      error: (err) => {
        console.error('Error al obtener sugerencias', err);
        this.recommendations.set([]);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.searchSub) this.searchSub.unsubscribe();
  }

  onTyping(query: string) {
    this.searchQuery$.next(query);
  }

  onFocus(query: string) {
    if (query.trim() && this.recommendations().length > 0) {
      this.showRecommendations.set(true);
    }
  }

  clearSearch(searchBox: HTMLInputElement) {
    searchBox.value = '';
    this.recommendations.set([]);
    this.showRecommendations.set(false);
  }

  onSearch(query: string) {
    this.showRecommendations.set(false);
    if (query.trim()) {
      this.router.navigate(['/feed'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/feed']);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.profile-container')) {
      this.isMenuOpen.set(false);
    }
    if (!event.target.closest('.search-bar')) {
      this.showRecommendations.set(false);
    }
  }

  logout() {
    const username = this.authService.currentUser()?.username;
    this.isMenuOpen.set(false);
    this.authService.logout();
    Swal.fire({
      title: "Deslogueado correctamente",
      icon: "success",
      text: `Has cerrado correctamente la sesion, vuelve pronto ${username}!`,
      confirmButtonText: "OK"
    }).then(() => {
      this.router.navigate(['/login']);
    })
  }
}



