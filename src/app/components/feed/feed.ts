import { Component, inject } from '@angular/core';
import { PostCard } from '../post-card/post-card';
import { Post } from '../../interfaces/post';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-feed',
  imports: [PostCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private postService = inject(PostService);

  listOfPosts: Post[] = [];

  ngOnInit() {
    this.listOfPosts = this.postService.getPosts();
  }
}
