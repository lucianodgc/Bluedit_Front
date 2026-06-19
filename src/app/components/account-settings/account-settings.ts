import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService, UserService } from '../../services';

@Component({
  selector: 'app-account-settings',
  imports: [FormsModule, RouterLink],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
})
export class AccountSettings implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);

  userId: number = 0;
  private paramSub?: Subscription;

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const idUrl = params.get('id');
      if (idUrl) {
        this.userId = Number(idUrl);
      }
    });
  }

  updateUsername(form: NgForm) {
    Swal.fire({
      title: '¿Cambiar nombre de usuario?',
      text: 'Tu nombre de usuario se actualizará en toda la plataforma.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      background: '#212529',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          id: this.userId,
          username: form.value.username
        };

        this.userService.updateUsername(data).subscribe({
          next: (response) => {
            this.authService.updateUserState(response.data); 
            Swal.fire({
              title: '¡Actualizado!',
              text: 'Nombre de usuario cambiado con éxito.',
              icon: 'success',
              background: '#212529',
              color: '#fff'
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'Ocurrió un error en el servidor.',
              icon: 'error',
              background: '#212529',
              color: '#fff'
            });
          }
        });
      }
    });
  }

  updatePassword(form: NgForm) {

    Swal.fire({
      title: '¿Actualizar contraseña?',
      text: 'Se cambiará tu clave de acceso actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      background: '#212529',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          id: this.userId,
          currentPassword: form.value.currentPassword,
          newPassword: form.value.newPassword
        };

        this.userService.updatePassword(data).subscribe({
          next: (response) => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Contraseña actualizada correctamente.',
                icon: 'success',
                background: '#212529',
                color: '#fff'
              });
              form.resetForm();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'Ocurrió un error en el servidor.',
              icon: 'error',
              background: '#212529',
              color: '#fff'
            });
          }
        });
      }
    });
  }

  deleteAccount() {
    Swal.fire({
      title: '¿ELIMINAR CUENTA PERMANENTEMENTE?',
      text: 'Esta acción borrará toda tu información y no podrás recuperarla. ¿Estás absolutamente seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'Cancelar',
      background: '#212529',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.userId).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Cuenta eliminada',
              text: 'Tu cuenta ha sido dada de baja correctamente.',
              icon: 'success',
              background: '#212529',
              color: '#fff'
            }).then(() => {
              this.authService.logout();
              this.router.navigate(['/signup']);
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'Ocurrió un error en el servidor.',
              icon: 'error',
              background: '#212529',
              color: '#fff'
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}