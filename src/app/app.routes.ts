import { Routes } from '@angular/router';
import { Feed } from './components/feed/feed';
import { CreatePost } from './components/create-post/create-post';
import { Profile } from './components/profile/profile';
import { PostDetail } from './components/post-detail/post-detail';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const routes: Routes = [
    { path: 'feed', component: Feed },
    { path: 'create-post', component: CreatePost },
    { path: 'profile/:id', component: Profile },
    { path: 'login', component: Login },
    { path: 'signup', component: Register },
    { path: 'post/:id', component: PostDetail },
    { path: '', redirectTo: '/feed', pathMatch: 'full' },
    { path: '**', redirectTo: '/feed' }
];
