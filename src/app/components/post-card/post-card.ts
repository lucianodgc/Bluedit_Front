import { Component, Input } from '@angular/core';
import { Post } from '../../interfaces';
import { RouterLink } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, AvatarPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  @Input() post!: Post;
}
  