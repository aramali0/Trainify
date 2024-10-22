

import '../css/style.css'

import "@phosphor-icons/web/bold";
import "@phosphor-icons/web/thin";
import "@phosphor-icons/web/light";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/duotone";

class ThemeCustomizer {

    theme = "light";

    init() {
        this.html = document.getElementsByTagName('html')[0];
        const config = localStorage.getItem('__STUDYZEN_CONFIG__');
        if (config) {
            const parsed = JSON.parse(config);
            this.theme = parsed['theme'];
        }
        if (this.theme === 'dark') {
            this.html.classList.add('dark')
        }
        this.onThemeChange();
        window.addEventListener('DOMContentLoaded', () => {
            this.after();
        });
    }

    onThemeChange = () => {
        if (this.theme === 'dark') {
            this.html.classList.add('dark')
        } else {
            this.html.classList.remove('dark')
        }

        if (this.lightTheme && this.darkTheme) {
            if (this.theme === 'light') {
                this.lightTheme.classList.remove('hidden');
                this.darkTheme.classList.add('hidden');
            } else {
                this.darkTheme.classList.remove('hidden');
                this.lightTheme.classList.add('hidden');
            }
        }

        localStorage.setItem('__STUDYZEN_CONFIG__', JSON.stringify({
            theme: this.theme
        }))
    }

    after() {
        this.lightTheme = document.getElementById('light-theme');
        this.darkTheme = document.getElementById('dark-theme');

        if (this.lightTheme && this.darkTheme) {
            this.lightTheme.addEventListener('click', (e) => {
                this.theme = 'dark';
                this.onThemeChange();
            });
            this.darkTheme.addEventListener('click', (e) => {
                this.theme = 'light';
                this.onThemeChange();
            })
        }
        this.onThemeChange();
    }
}

new ThemeCustomizer().init();
