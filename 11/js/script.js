let navMain = document.querySelector('.header-navigation');
let navToggle = document.querySelector('.header-navigation__toggle');

navMain.classList.remove('header-navigation--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('header-navigation--closed')) {
    navMain.classList.remove('header-navigation--closed');
    navMain.classList.add('header-navigation--opened');
  } else {
    navMain.classList.add('header-navigation--closed');
    navMain.classList.remove('header-navigation--opened');
  }
});
