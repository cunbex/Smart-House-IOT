const headerElement = document.querySelector('.header');
const headerToggleElement = document.querySelector('.header__menu-button');
const navigationElement = document.querySelector('.navigation');

class App {
    constructor() {
        headerToggleElement.addEventListener(
            'click',
            this._toggleMobileMenu.bind(this),
        );
    }

    _toggleMobileMenu() {
        headerElement.classList.toggle('header--open');
        navigationElement.classList.toggle('navigation--open');
    }
}

const app = new App();
