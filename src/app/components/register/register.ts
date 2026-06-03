import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserService } from '../../services';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  
  error: string = '';

  register(form: NgForm) {
    if (form.valid) {

      this.userService.register(form.value).subscribe({
        next: (response) => {
          this.authService.login(form.value.email, form.value.password).subscribe({
            next: () => {
              this.router.navigate(['/edit-profile/' + response.data.id]);
            }
          });
        },
        error: (err) => {
          this.error = err.message || 'Ocurrió un error durante el registro.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
