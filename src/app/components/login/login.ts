import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  error: string = '';

  login(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/']); 
        },
        error: (err) => {
          this.error = 'Email o contraseña incorrectos.';
        }
      });
    }
  }
}