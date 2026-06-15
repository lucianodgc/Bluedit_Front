import { Component, inject, Injectable, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services';
import { Post } from '../../interfaces';
import { CommentList } from '../comment-list/comment-list';
import { PostCard } from '../post-card/post-card';

@Component({
  selector: 'app-post-detail',
  imports: [PostCard, CommentList],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);

  post = signal<Post | null>(null);

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(+postId).subscribe({
        next: (response) => {
          this.post.set(response.data);
        },
        error: (err) => console.error("Error al cargar el post", err)
      })
    }
  }
}
