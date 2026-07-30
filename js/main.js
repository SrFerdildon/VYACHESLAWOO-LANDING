/*ДЛЯ АНИМАЦИИ КНОПКИ МЕНЮ*/
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
	// Загрузка постера видео
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

	/*ДЛЯ АНИМАЦИИ ВСПЛЫТИЯ ТЕКСТА*/
	// Находим все текстовые блоки в секции About
	const upAnimation = document.querySelectorAll(".about__text-up, .about__header, .about__text, .about__content-item, .portfolio__header, .portfolio__item, .portfolio__item-image, .portfolio__all-big, .portfolio__all-small");
	// Настройки Observer
	const observerOptions = {
		root: null, // наблюдение относительно viewport
		rootMargin: '0px',
		threshold: 0.5 // анимация запустится, когда 50% элемента видно
	};

	// Создаем Observer
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			// Если элемент появился в viewport
			if (entry.isIntersecting) {
				// Добавляем класс для запуска анимации
				entry.target.classList.add('animated');

				// Перестаем наблюдать за этим элементом (анимация один раз)
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Начинаем наблюдение за каждым текстовым блоком
	upAnimation.forEach(text => {
		observer.observe(text);
	});


	// ===== АНИМАЦИЯ СЕКЦИИ SERVICES =====
	// Анимация с привязкой к скроллу
	gsap.registerPlugin(ScrollTrigger);

	const scrollAnimation = document.querySelectorAll('.services__item, .services__header');

	gsap.utils.toArray(scrollAnimation).forEach((item, index) => {
		gsap.to(item, {
			scrollTrigger: {
				trigger: item,
				start: 'top 100%',
				/*end: 'bottom 20%',*/
				toggleActions: 'play none none reverse',
			},
			y: 0,
			scale: 1,
			duration: 1.5,
			delay: 0.1,
			ease: 'power3.out',
		});
	});

	// ===== АНИМАЦИЯ СЕКЦИИ STAGES =====
	const stagesSection = document.querySelector('.stages');
	const stagesReveal = document.querySelector('.stages__reveal');
	const stagesTrack = document.querySelector('.stages__wrapper');
	const stagesHeader = document.querySelector('.stages__header');

	if (stagesSection && stagesTrack) {
		// Вычисляем длину горизонтального скролла
		const getScrollAmount = () => {
			return -(stagesTrack.scrollWidth + window.innerWidth * 1.5);
		};

		// Создаем ЕДИНЫЙ timeline для всей секции
		const stagesTl = gsap.timeline({
			scrollTrigger: {
				trigger: stagesSection,
				start: 'top top', // Начинаем, когда верх секции достигает верха экрана
				end: () => `+=${Math.abs(getScrollAmount()) * 2}`, // Длина = ширина трека + 500px на раскрытие круга
				pin: true, // Приклеиваем секцию
				pinSpacing: true,
				scrub: 2, // Плавная привязка к скроллу
				invalidateOnRefresh: true,
				anticipatePin: 1,
			}
		});

		// 1. Сначала раскрываем круг
		stagesTl.to(stagesReveal, {
			clipPath: 'circle(150% at 50% 50%)',
			duration: 1.5,
			ease: 'power2.inOut',
		});

		// 2. Начинаем двигать карточки
		stagesTl.to(stagesTrack, {
			x: getScrollAmount,
			ease: 'none',
			duration: 3,
		}, '+=0');
	}
});