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
	/* ЗАГРУЗКА ВСТУПИТЕЛЬНОГО ВИДЕО */
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

	// ===== АНИМАЦИЯ СЕКЦИИ STAGES =====
	const stagesSection = document.querySelector('.stages');
	const stagesReveal = document.querySelector('.stages__reveal');
	const stagesWrapper = document.querySelector('.stages__wrapper');
	const stagesTrack = document.querySelector('.stages__track');
	const stagesHeader = document.querySelector('.stages__header');

	if (stagesSection && stagesTrack) {
		// Вычисляем длину горизонтального скролла
		const getScrollAmount = () => {
			return -(stagesTrack.scrollWidth);
		};

		// Создаем ЕДИНЫЙ timeline для всей секции
		const stagesTl = gsap.timeline({
			scrollTrigger: {
				trigger: stagesSection,
				start: 'top top', // Начинаем, когда верх секции достигает верха экрана
				end: () => `+=${Math.abs(getScrollAmount()) * 2}`, // Длина = ширина трека + 500px на раскрытие круга
				pin: true, // Приклеиваем секцию
				pinSpacing: true,
				scrub: 1.3, // Плавная привязка к скроллу
				invalidateOnRefresh: true,
				anticipatePin: 1,
			}
		});

		// 1. Сначала раскрываем круг
		stagesTl.to(stagesReveal, {
			clipPath: 'circle(100% at 50% 50%)',
			duration: 7,
			ease: 'power2.inOut',
		});

		stagesTl.to(stagesWrapper, {
			clipPath: 'circle(100% at 50% 50%)',
			duration: 7,
			ease: 'power2.inOut',
		}, 0);

		// 2. Начинаем двигать карточки
		stagesTl.to(stagesTrack, {
			x: getScrollAmount,
			ease: 'none',
			duration: 10,
		}, '+=0');
	}


	// ===== АНИМАЦИЯ СЕКЦИИ FOOTER =====
	function createFooterSliceTrail(selector, slicesCount = 25) {
		const container = document.querySelector(selector);
		if (!container) return;

		const text = container.dataset.text;
		container.style.setProperty('--slices', slicesCount);

		// Создаем основной текст
		const baseText = document.createElement('div');
		baseText.className = 'footer__slice-text__base';
		baseText.textContent = text;
		container.appendChild(baseText);
		const offsets = [];
		let total = 0;
		// Создаем полосы
		for (let i = 0; i < slicesCount; i++) {
			const slice = document.createElement('div');
			slice.className = 'footer__slice-text__slice';
			slice.textContent = text;

			offsets.push(total);

			const visibleHeight = 21 - (i / 3 * 1.9);
			total += visibleHeight;

			// Подставляем готовый polygon
			const clipValue = `polygon(0% 0%, 100% 0%, 100% ${visibleHeight}%, 0% ${visibleHeight}%)`;
			slice.style.clipPath = clipValue;
			slice.style.webkitClipPath = clipValue;

			container.appendChild(slice);
		}

		const slices = container.querySelectorAll('.footer__slice-text__slice');
		const footer = container.querySelector('.footer');
		gsap.set(slices, { opacity: 1, y: 0 });
		const heightSelector = gsap.getProperty(selector, 'height') / 100;
		gsap.to(slices, {
			opacity: 1,
			y: i => -offsets[i] * container.offsetHeight / 300,
			duration: 1,
			stagger: {
				each: 0.05,
				from: 'start'
			},
			ease: 'power2.out',
			scrollTrigger: {
				trigger: selector,
				start: 'top 100%',
				end: 'bottom 150%',
				scrub: 3,
				toggleActions: 'play none none reverse',
			},
		});
	}

	// Запуск анимации для футера
	createFooterSliceTrail('.footer__slice-text', 9);

	// ===== КНОПКА "НАВЕРХ" =====
	const scrollTopBtn = document.getElementById('scrollTop');

	if (scrollTopBtn) {
		// Показываем/скрываем кнопку при скролле
		window.addEventListener('scroll', () => {
			if (window.scrollY > 400) { // Показываем после 400px прокрутки
				scrollTopBtn.classList.add('scroll-top--visible');
			} else {
				scrollTopBtn.classList.remove('scroll-top--visible');
			}
		});

		// Плавная прокрутка наверх при клике
		scrollTopBtn.addEventListener('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}

	/* СНИЖЕНИЕ ПРОЗРАЧНОСТИ КНОПКИ МЕНЮ */
	const scrollBurgerBtn = document.getElementById('burger-btn');

	if (scrollBurgerBtn) {
		// Показываем/скрываем кнопку при скролле
		window.addEventListener('scroll', () => {
			if (window.scrollY > 400) { // Показываем после 400px прокрутки
				scrollBurgerBtn.classList.add('burger-btn--visible');
			} else {
				scrollBurgerBtn.classList.remove('burger-btn--visible');
			}
		});

		// Плавная прокрутка наверх при клике
		scrollBurgerBtn.addEventListener('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}
});