import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { PostCard } from '../post-card/post-card';
import { ApiResponse, Post, User } from '../../interfaces';
import { AuthService, PostService, UserService } from '../../services';
import { Subscription } from 'rxjs';
import { AvatarPipe } from '../../pipes/avatar-pipe';


@Component({
  selector: 'app-profile',
  imports: [PostCard, RouterLink, AvatarPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute); 
  private userService = inject(UserService);
  private postService = inject(PostService);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user: User | null = null;
  userPosts: Post[] = [];

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
      this.userService.getProfileById(userId).subscribe({
        next: (response: ApiResponse) => {
          this.user = response.data;
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error al cargar usuario', err)
      });

      this.postService.getPostsByUserId(userId).subscribe({
        next: (response: ApiResponse) => {
          this.userPosts = response.data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar posts del usuario', err)
      });
  }

  ngOnDestroy() {
      if (this.paramSub) {
          this.paramSub.unsubscribe();
      }
  }

}