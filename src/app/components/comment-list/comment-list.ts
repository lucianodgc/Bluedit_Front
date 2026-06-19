import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Comment, Post } from '../../interfaces';
import { FormsModule } from '@angular/forms';
import { AuthService, CommentService } from '../../services';
import { CommentRequest } from '../../interfaces/comment-request';
import { Router } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';

@Component({
    selector: 'app-comment-list',
    imports: [FormsModule, AvatarPipe],
    templateUrl: './comment-list.html',
    styleUrl: './comment-list.scss',
})
export class CommentList implements OnInit {
    @Input() post!: Post;

    private authService = inject(AuthService);
    private commentService = inject(CommentService);
    private router = inject(Router);

    comments = signal<Comment[]>([]);
    newCommentText = '';
    commentCount: number = 0; 

    errorMessage = signal<string | null>(null);

    ngOnInit() {
        this.loadComments();    
    }

    loadComments() {
        this.commentService.getCommentsByPostId(this.post.id).subscribe({
            next: (response) => {
                this.comments.set(response.data);
            },
            error: (err) => {
                console.error('Error al cargar comentarios', err);
                this.errorMessage.set('No se pudieron cargar los comentarios.');
            }
        });
    }

    onSubmitComment() {
        if (!this.newCommentText.trim()) return;

        const currentUserId = this.authService.currentUser()?.id;

        if (!currentUserId) {
            this.router.navigate(['/login']);
            return;
        }

        this.errorMessage.set(null);

        this.commentCount = this.post.commentsCount || 0;
        const previousCommentCount = this.commentCount;

        this.post.commentsCount += 1;

        const commentData: CommentRequest = {
            content: this.newCommentText,
            postId: this.post.id,
            userId: currentUserId
        };

        this.commentService.createComment(commentData).subscribe({
            next: (response) => {
                this.newCommentText = '';
                this.loadComments();
            },
            error: (err) => {
                console.error('Error al crear comentarios', err);
                this.post.commentsCount = previousCommentCount;
                this.errorMessage.set(err.error?.message || 'No se pudo publicar tu comentario.');
            }
        });
    }
}