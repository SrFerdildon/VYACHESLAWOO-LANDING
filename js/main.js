// Элементы
const burger = document.getElementById('burger-btn');
const nav = document.getElementById('nav');
const navClose = document.getElementById('navClose');
const navLinks = document.querySelectorAll('.nav__link');

// Функция открытия меню
function openNav() {
	nav.classList.add('nav--open');
	burger.setAttribute('aria-expanded', 'true');
	document.body.style.overflow = 'hidden'; // Блокируем прокрутку
}

// Функция закрытия меню
function closeNav() {
	nav.classList.remove('nav--open');
	burger.setAttribute('aria-expanded', 'false');
	document.body.style.overflow = ''; // Возвращаем прокрутку
}

// Слушатели событий
burger.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);

// Закрываем меню при клике на ссылку
navLinks.forEach(link => {
	link.addEventListener('click', closeNav);
});

// Закрываем меню при клике вне его
document.addEventListener('click', (e) => {
	if (nav.classList.contains('nav--open') &&
		!nav.contains(e.target) &&
		!burger.contains(e.target)) {
		closeNav();
	}
});

// Закрываем меню при нажатии Escape
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
		closeNav();
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const video = document.querySelector('.header__video');

	// Проверка: пользователь хочет меньше анимаций?
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	// Проверка: медленное соединение?
	const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	const isSlowConnection = connection &&
		(connection.effectiveType === '2g' || connection.effectiveType === '3g');

	// Если есть ограничения — не загружаем видео
	if (prefersReducedMotion || isSlowConnection) {
		video.removeAttribute('autoplay');
		video.pause();
		// Можно заменить на картинку
		video.parentElement.style.backgroundImage =
			`url(${video.getAttribute('poster')})`;
		video.parentElement.style.backgroundSize = 'cover';
		video.style.display = 'none';
	}
});