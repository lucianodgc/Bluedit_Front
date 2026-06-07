import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'avatarUrl',
})
export class AvatarPipe implements PipeTransform {
  transform(user: any): unknown {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }

    const seed = user?.username || user || 'default';
    return `${environment.avatarUrl}${seed}`;
  
  }
}
