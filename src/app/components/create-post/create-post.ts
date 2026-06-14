import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService, PostService } from '../../services';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  imports: [FormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  error: string = '';
  selectedType: 'text' | 'multimedia' = 'text';
  fileSelected: File | null = null;

  setType(type: 'text' | 'multimedia', form: NgForm) {
    this.selectedType = type;
    form.controls['content']?.reset();
    this.fileSelected = null;
  }

 onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileSelected = file;
    }
  }

  create(form: NgForm) {
    if (this.selectedType === 'multimedia' && !this.fileSelected) {
      this.error = 'Por favor, selecciona un archivo multimedia.';
      return;
    }

    if (form.valid) {
      const user = this.authService.currentUser();
      const formData = new FormData();

      formData.append('title', form.value.title);
      formData.append('type', this.selectedType);
      formData.append('userId', user!.id.toString());

      if (this.selectedType === 'text') {
        formData.append('content', form.value.content);
      } else if (this.selectedType === 'multimedia' && this.fileSelected) {
        formData.append('content', this.fileSelected, this.fileSelected.name);
      }

      this.postService.createPost(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          this.error = err.message || 'Ocurrió un error al crear el post.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}