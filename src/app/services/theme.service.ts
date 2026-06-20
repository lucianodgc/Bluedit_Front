import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  
  // Exponemos el tema de forma reactiva usando Angular Signals
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    // 1. Intentar cargar el tema guardado anteriormente por el usuario
    let theme = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | null;

    // 2. Si no hay configuración previa, leer la preferencia del sistema operativo
    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }

    this.setTheme(theme);
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    
    // Aplicamos el atributo data-bs-theme en la etiqueta <html> del DOM
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  toggleTheme() {
    const nextTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }
}
