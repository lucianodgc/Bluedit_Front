import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PostCard } from '../post-card/post-card';
import { ApiResponse, Post } from '../../interfaces';
import { PostService } from '../../services';

@Component({
  selector: 'app-feed',
  imports: [PostCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit {
  private postService = inject(PostService);
  private cdr = inject(ChangeDetectorRef);

  listOfPosts: Post[] = [];

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (response: ApiResponse) => {
        this.listOfPosts = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar posts', err)
    });
  }
}
