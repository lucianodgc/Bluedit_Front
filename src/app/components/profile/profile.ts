import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { PostCard } from '../post-card/post-card';
import { Post, User } from '../../interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [PostCard],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute); 
  private userService = inject(UserService);
  private postService = inject(PostService);
  authService = inject(AuthService);

  constructor(private cdr: ChangeDetectorRef) {
    this.ngOnInit()
  }

  user: User | null = null;
  userPosts: Post[] = [];

  ngOnInit() {
    const idUrl = this.route.snapshot.paramMap.get('id');
    
    if (idUrl) {
      const userIdNum = Number(idUrl);

      this.userService.getProfileById(userIdNum).subscribe({
        next: (data) => {
          this.user = data;
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error al cargar usuario', err)
      });

      this.postService.getPostsByUserId(userIdNum).subscribe({
        next: (posts) => {
          this.userPosts = posts;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar posts del usuario', err)
      });
    }
  }
}