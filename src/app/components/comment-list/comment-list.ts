import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Comment, Post } from '../../interfaces';
import { FormsModule } from '@angular/forms';
import { AuthService, CommentService } from '../../services';
import { CommentRequest } from '../../interfaces/comment-request';
import { Router } from '@angular/router';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-comment-list',
    imports: [FormsModule, AvatarPipe],
    templateUrl: './comment-list.html',
    styleUrl: './comment-list.scss',
})
export class CommentList implements OnInit {
    @Input() post!: Post;
    @Output() commentsCountChange = new EventEmitter<number>();

    authService = inject(AuthService);
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
                const fetchedComments = response.data || [];
                this.comments.set(fetchedComments);

                this.commentsCountChange.emit(fetchedComments.length);
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

        this.commentsCountChange.emit(this.commentCount + 1);

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
                this.commentsCountChange.emit(previousCommentCount);
                this.errorMessage.set(err.error?.message || 'No se pudo publicar tu comentario.');
            }
        });
    }

    deleteComment(commentId: number) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el comentario permanentemente.',
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
                this.commentService.deleteComment(commentId).subscribe({
                    next: (response) => {
                        const newCount = Math.max(0, (this.post.commentsCount || 0) - 1);
                        this.commentsCountChange.emit(newCount);
                        this.loadComments();
                    },
                    error: (err) => {
                        console.error('Error al borrar comentario', err);
                        this.errorMessage.set(err.error?.message || 'No se pudo eliminar tu comentario.');
                    }
                });
            }
        });
    }
}