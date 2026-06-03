import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

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
              this.router.navigate(['/']);
            }
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Ocurrió un error durante el registro.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
