import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');
  private links: NodeListOf<Element> = null;

  constructor() {
    const theme = localStorage.getItem('theme') || './assets/css/colors/red-dark.css';
    this.linkTheme.setAttribute('href', theme);
  }

  changeTheme(theme: string) {
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme()
  }

  checkCurrentTheme() {
    if (!this.links) {
      this.links = document.querySelectorAll('.selector');
    }

    this.links.forEach(elem => {
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`
      const currentTheme = this.linkTheme.getAttribute('href')
      if (btnThemeUrl === currentTheme) {
        elem.classList.add('working');
      }

    });


  }


}

