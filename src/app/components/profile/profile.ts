import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { PostCard } from '../post-card/post-card';
import { ApiResponse, Post, User } from '../../interfaces';
import { AuthService, PostService, UserService } from '../../services';


@Component({
  selector: 'app-profile',
  imports: [PostCard, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute); 
  private userService = inject(UserService);
  private postService = inject(PostService);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user: User | null = null;
  userPosts: Post[] = [];

  ngOnInit() {
    const idUrl = this.route.snapshot.paramMap.get('id');
    
    if (idUrl) {
      const userIdNum = Number(idUrl);

      this.userService.getProfileById(userIdNum).subscribe({
        next: (response: ApiResponse) => {
          this.user = response.data;
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error al cargar usuario', err)
      });

      this.postService.getPostsByUserId(userIdNum).subscribe({
        next: (response: ApiResponse) => {
          this.userPosts = response.data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar posts del usuario', err)
      });
    }
  }

}