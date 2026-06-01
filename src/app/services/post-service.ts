import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [
    { 
      id: 101, 
      userId: 1, 
      username: 'nacho_sugo', 
      avatarUrl: '',
      title: 'Mi primer post en Bluedit', 
      content: 'Hola gente, armando el clon de reddit con Angular standalone.', 
      type: 'text',
      votesCount: 15, 
      commentsCount: 3,
      createdAt: 'Hace 2 horas'
    },
    { 
      id: 102, 
      userId: 2, 
      username: 'luciano_dg', 
      title: '¿Qué opinan de Angular en 2026?', 
      content: 'Para mí con las nuevas optimizaciones de renderizado la rompe toda.', 
      type: 'text',
      votesCount: 99, 
      commentsCount: 25,
      createdAt: 'Hace 5 horas'
    },
    { 
      id: 103, 
      userId: 2, 
      username: 'luciano_dg', 
      title: 'Debate picante: PHP vs Java para el backend', 
      content: '¿Cuál prefieren ustedes a la hora de estructurar las API de los laboratorios?', 
      type: 'text',
      votesCount: 42, 
      commentsCount: 14,
      createdAt: 'Ayer'
    }
  ];

  getPostsByUserId(userId: number): Post[] {
    return this.posts.filter(post => post.userId === userId);
  }

  getPosts(): Post[] {
    return this.posts;
  }
}
