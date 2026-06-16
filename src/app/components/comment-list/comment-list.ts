import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Comment } from '../../interfaces';
import { FormsModule } from '@angular/forms';
import { AuthService, CommentService } from '../../services';
import { CommentRequest } from '../../interfaces/comment-request';
import { Router } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';

@Component({
    selector: 'app-comment-list',
    imports: [FormsModule, AvatarPipe],
    templateUrl: './comment-list.html'
})
export class CommentList implements OnInit {
    @Input() postId!: number;

    private authService = inject(AuthService);
    private commentService = inject(CommentService);
    private router = inject(Router);

    comments = signal<Comment[]>([]);
    newCommentText = '';

    ngOnInit() {
        this.loadComments();    
    }

    loadComments() {
        this.commentService.getCommentsByPostId(this.postId).subscribe({
            next: (response) => {
                this.comments.set(response.data);
            },
            error: (err) => console.error('Error al cargar comentarios', err)
        });
    }

    onSubmitComment() {
        if (!this.newCommentText.trim()) return;

        const currentUserId = this.authService.currentUser()?.id;

        if (!currentUserId) {
            this.router.navigate(['/login']);
            return;
        }

        const commentData: CommentRequest = {
            content: this.newCommentText,
            postId: this.postId,
            userId: currentUserId
        };

        this.commentService.createComment(commentData).subscribe({
            next: (response) => {
                this.newCommentText = '';
                this.loadComments();
            },
            error: (err) => console.error('Error al crear comentarios', err)
        });
    }
}