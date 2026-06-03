import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PostCard } from '../post-card/post-card';
import { Post } from '../../interfaces';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-feed',
  imports: [PostCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private postService = inject(PostService);

  constructor(private cdr: ChangeDetectorRef) {
    this.ngOnInit()
  }


  listOfPosts: Post[] = [];

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.listOfPosts = posts;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar posts', err)
    });
  }
}
