import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'avatarUrl',
})
export class AvatarPipe implements PipeTransform {
  transform(user: any): unknown {
    if (user?.avatarUrl) {
      if (user.avatarUrl.startsWith('http')) {
        return user.avatarUrl;
      }
      return `${environment.serverUrl}${user.avatarUrl}`;
    }

    const seed = typeof user === 'string' ? user : (user?.username || 'default');
    return `${environment.avatarUrl}${seed}`;
  }
}
