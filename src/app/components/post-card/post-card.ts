import { Component, Input } from '@angular/core';
import { Post } from '../../interfaces';
import { RouterLink } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, AvatarPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  @Input() post!: Post;

  readonly serverUrl = environment.serverUrl; 

  isVideo(url: string): boolean {
    if (!url) return false;
    const extension = url.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg'].includes(extension || '');
  }
}
  