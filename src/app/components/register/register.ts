import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserService } from '../../services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class Register {
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);

  protected error: string = '';

  register(form: NgForm) {
    if (form.valid) {

      this.userService.register(form.value).subscribe({
        next: (response) => {
          this.authService.login(form.value.email, form.value.password).subscribe({
            next: () => {
              Swal.fire({
                title: "Registrado correctamente",
                icon: "success",
                text: `Te has registrado correctamente, bienvenido a Bluedit ${form.value.username}!`,
                confirmButtonText: "OK"
              }).then(() => {
                this.router.navigate(['/edit-profile/' + response.data.id]);
              })
            }
          });
        },
        error: (err) => {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: err.error?.message || "Ocurrio un error al intentar registrarte",
            confirmButtonText: "Entendido"
          }).then(() => {
            this.router.navigate(['/register']);
          })
        }
      });
    }
  }
}
