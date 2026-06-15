import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../interfaces';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './comment-list.html'
})
export class CommentList implements OnInit {
    @Input() postId!: number;
    
    private commentService = inject(CommentService);
    comments = signal<Comment[]>([]);
    newCommentText = '';

    ngOnInit() {
        this.loadComments();    
    }

    loadComments() {
        this.commentService.getCommentsByPostId(this.postId).subscribe({
            next: (res) => {
                if (res.success) this.comments.set(res.data);
            }
        });
    }

    onSubmitComment() {
        if (!this.newCommentText.trim()) return;

        const formData = new FormData();
        formData.append('content', this.newCommentText);
        formData.append('post_id', this.postId.toString());

        this.commentService.createComment(formData).subscribe({
            next: (res) => {
                if (res.success) {
                    this.newCommentText = '';
                    this.loadComments();
                }
            }
        })
    }
}