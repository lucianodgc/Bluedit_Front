import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostCard } from '../post-card/post-card';
import { ApiResponse, Post, User } from '../../interfaces';
import { AuthService, CountryService, PostService, UserService } from '../../services';
import { Subscription } from 'rxjs';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import { CountryNamePipe } from '../../pipes/country-name-pipe';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [PostCard, RouterLink, AvatarPipe, CountryNamePipe, AsyncPipe],
  templateUrl: './profile.html',
})
export class Profile implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private postService = inject(PostService);
  protected authService = inject(AuthService);
  public countryService = inject(CountryService);
  protected environment = environment;

  protected user = signal<User | null>(null);
  protected userPosts = signal<Post[]>([]);

  protected errorMessage = signal<string | null>(null);

  private paramSub?: Subscription;

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const idUrl = params.get('id');

      if (idUrl) {
        const userIdNum = Number(idUrl);
        this.loadUserData(userIdNum);
      }
    });
  }

  loadUserData(userId: number) {
    const currentUserId = this.authService.currentUser()?.id ?? null;
    this.errorMessage.set(null);

    this.userService.getProfileById(userId).subscribe({
      next: (response: ApiResponse) => {
        this.user.set(response.data);
      },
      error: (err) => console.error('Error al cargar usuario', err)
    });

    this.postService.getPostsByUserId(userId, currentUserId).subscribe({
      next: (response: ApiResponse) => {
        this.userPosts.set(response.data);
      },
      error: (err) => {
        console.error('Error al cargar posts del usuario', err);
        this.errorMessage.set(err.error?.message || 'No se pudo cargar el perfil del usuario.');
      }
    });
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}