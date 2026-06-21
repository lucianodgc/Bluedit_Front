import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { PostCard } from '../post-card/post-card';
import { ApiResponse, Post } from '../../interfaces';
import { AuthService, PostService } from '../../services';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feed',
  imports: [PostCard, FormsModule],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit {
  private postService = inject(PostService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  listOrderedByDate: Post[] = [];
  listOrderedByVotes: Post[] = [];

  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const currentUserId = this.authService.currentUser()?.id ?? null;
    this.errorMessage.set(null);
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['q'] || null;
      this.loadPosts(currentUserId, searchQuery);
    });
  }

  loadPosts(currentUserId: number | null, query: string | null) {
    this.errorMessage.set(null);

    this.postService.getPosts(currentUserId, query).subscribe({
      next: (response: ApiResponse) => {
        this.listOrderedByDate = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar posts', err);
        this.errorMessage.set(err.error?.message || 'No se pudo cargar el feed de inicio.');
      }
    });

    this.postService.getPostsByVotes(currentUserId).subscribe({
      next: (response: ApiResponse) => {
        this.listOrderedByVotes = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar posts', err);
        this.errorMessage.set(err.error?.message || 'No se pudieron cargar las publicaciones populares.');
      }
    });  
  }
}
