import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { UserService } from '../../services/user-service';
import { PostService } from '../../services/post-service';
import { PostCard } from '../post-card/post-card';

@Component({
  selector: 'app-profile',
  imports: [PostCard],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute); 
  private userService = inject(UserService);
  private postService = inject(PostService);

  user: any = null;
  userPosts: any[] = [];

  ngOnInit() {
    const idUrl = this.route.snapshot.paramMap.get('id');
    
    if (idUrl) {
      const userIdNum = Number(idUrl);
      this.user = this.userService.getProfileById(userIdNum);
      this.userPosts = this.postService.getPostsByUserId(userIdNum);
    }
  }
}
