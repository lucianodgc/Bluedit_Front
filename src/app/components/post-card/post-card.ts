import { Component, Input, OnInit, inject } from '@angular/core';
import { Post, VoteRequest } from '../../interfaces'; 
import { Router, RouterLink } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import { environment } from '../../../environments/environment';
import { VoteService } from '../../services/vote.service';
import { AuthService } from '../../services';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, AvatarPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard implements OnInit {
  @Input() post!: Post;

  private voteService = inject(VoteService);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly serverUrl = environment.serverUrl;
  voteCount: number = 0; 
  userVote: 'up' | 'down' | null = null;

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
      next: (response) => {},
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
}