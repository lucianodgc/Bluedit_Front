import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
          const username = response.data?.username || form.value.email;
          Swal.fire({
            title: "Logueado correctamente",
            icon: "success",
            text: `Has iniciado correctamente, bienvenido nuevamente ${username}!`,
            confirmButtonText: "OK"
          }).then(() => {
            this.router.navigate(['/']); 
          })
        },
        error: (err) => {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Ocurrio un error al intentar loguearte",
            confirmButtonText: "Entendido"
          }).then(() => {
            this.router.navigate(['/login']); 
          })
        }
      });
    }
  }
}