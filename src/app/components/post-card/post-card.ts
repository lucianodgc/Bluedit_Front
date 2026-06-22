import { Component, Input, OnInit, inject } from '@angular/core';
import { Post, VoteRequest } from '../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import { environment } from '../../../environments/environment';
import { AuthService, PostService, VoteService } from '../../services';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, AvatarPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard implements OnInit {
  @Input() post!: Post;
  @Input() isDetailView: boolean = false;

  private postService = inject(PostService)
  private voteService = inject(VoteService);
  private router = inject(Router);
  protected environment = environment
  protected authService = inject(AuthService);

  readonly serverUrl = environment.serverUrl;
  protected voteCount: number = 0;
  protected userVote: 'up' | 'down' | null = null;
  protected isMediaExpanded: boolean = false;


  ngOnInit() {
    this.voteCount = this.post.votesCount || 0;

    this.userVote = this.post.userLoggedVote === 1 ? 'up' :
      this.post.userLoggedVote === -1 ? 'down' : null;
  }

  handleVote(type: 'up' | 'down') {
    const currentUserId = this.authService.currentUser()?.id;
    if (!currentUserId) {
      this.router.navigate(['/login']);
      return;
    }

    const previousUserVote = this.userVote;
    const previousVoteCount = this.voteCount;

    const currentValue = this.userVote === 'up' ? 1 : (this.userVote === 'down' ? -1 : 0);
    const newVote = this.userVote === type ? null : type;
    const newValue = newVote === 'up' ? 1 : (newVote === 'down' ? -1 : 0);

    this.userVote = newVote;
    this.voteCount += (newValue - currentValue);

    this.post.votesCount = this.voteCount;
    this.post.userLoggedVote = newValue;

    const voteData: VoteRequest = {
      postId: this.post.id,
      userId: currentUserId,
      voteType: newValue
    };

    this.voteService.votePost(voteData).subscribe({
      next: (response) => { },
      error: (err) => {
        console.error('Error en el servidor, revirtiendo voto:', err);
        this.userVote = previousUserVote;
        this.voteCount = previousVoteCount;
        this.post.votesCount = previousVoteCount;
        this.post.userLoggedVote = currentValue;
      }
    });
  }

  isVideo(url: string): boolean {
    return url ? ['mp4', 'webm', 'ogg'].includes(url.split('.').pop()?.toLowerCase() || '') : false;
  }

  toggleMedia() {
    this.isMediaExpanded = !this.isMediaExpanded;
  }

  goToPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

  deletePost(postId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la publicación permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#212529',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId).subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La publicación ha sido borrada correctamente.',
              icon: 'success',
              confirmButtonText: 'Entendido',
              background: '#212529',
              color: '#fff'
            }).then(() => {
              this.router.navigate(['/feed']);
            });
          },
          error: (err) => {
            console.error('Error en el servidor al intentar eliminar:', err);
            Swal.fire({
              title: 'Error interno',
              text: err.error?.message || 'Ocurrió un error en el servidor. Inténtalo más tarde.',
              icon: 'error',
              background: '#212529',
              color: '#fff'
            });
          }
        });

      }
    });
  }
}