import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, PostService } from '../../services';
import { Post, ApiResponse } from '../../interfaces'; // Asegurate de importar ApiResponse si lo usás
import { CommentList } from '../comment-list/comment-list';
import { PostCard } from '../post-card/post-card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  imports: [PostCard, CommentList],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private authService = inject(AuthService);

  post = signal<Post | null>(null);

  errorMessage = signal<string | null>(null);

  private paramSub?: Subscription;

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const idUrl = params.get('id');

      if (idUrl) {
        const postIdNum = Number(idUrl);
        this.loadPostData(postIdNum);
      }
    });
  }

  loadPostData(postId: number) {
    const currentUserId = this.authService.currentUser()?.id ?? null;
    this.errorMessage.set(null);

    this.postService.getPostById(postId, currentUserId).subscribe({
      next: (response: ApiResponse) => {
        this.post.set(response.data);
      },
      error: (err) => {
        console.error("Error al cargar el post", err);
        this.errorMessage.set(err.error?.message || 'No se pudo cargar la publicación.');
      }
    });
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}