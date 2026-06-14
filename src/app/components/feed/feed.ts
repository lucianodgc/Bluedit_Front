import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PostCard } from '../post-card/post-card';
import { ApiResponse, Post } from '../../interfaces';
import { AuthService, PostService } from '../../services';

@Component({
  selector: 'app-feed',
  imports: [PostCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit {
  private postService = inject(PostService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  listOfPosts: Post[] = [];

  ngOnInit() {
    const currentUserId = this.authService.currentUser()?.id ?? null;

    this.postService.getPosts(currentUserId).subscribe({
      next: (response: ApiResponse) => {
        this.listOfPosts = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar posts', err)
    });
  }
}
