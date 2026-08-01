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
	const stagesWrapper = document.querySelector('.stages__wrapper');
	const stagesTrack = document.querySelector('.stages__track');
	const stagesHeader = document.querySelector('.stages__header');

	if (stagesSection && stagesTrack) {
		// Вычисляем длину горизонтального скролла
		const getScrollAmount = () => {
			return -(stagesTrack.scrollWidth + window.innerWidth / 2);
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

		stagesTl.to(stagesWrapper, {
			clipPath: 'circle(100% at 50% 50%)',
			duration: 7,
			ease: 'power2.inOut',
		}, 0);

		stagesTl.to(stagesTrack, {
			x: getScrollAmount,
			ease: 'none',
			duration: 10,
		}, 0);
	}


	// ===== АНИМАЦИЯ СЕКЦИИ FOOTER =====
	// Анимация с привязкой к скроллу
	function updateFooterViewBox() {
		const svgElements = document.querySelectorAll('.footer__svg');
		const scrollAnimation = document.querySelector('.footer__img-container');

		if (!svgElements.length) return; // Проверяем, что элементы найдены

		const viewportWidth = window.innerWidth;
		const baseWidth = 1799;
		const baseHeight = 299;

		// Вычисляем относительную высоту (10% от оригинала)

		// Или обрезать снизу на 20%
		const offsetY = baseHeight * 0;
		const visibleHeight = baseHeight * 10;

		gsap.utils.toArray(svgElements).forEach((item, index) => {
			const relativeHeight = baseHeight / 100 * (2 + index);
			if (index < svgElements.length - 1) {
				item.setAttribute('viewBox', `0 ${offsetY} ${baseWidth} ${relativeHeight}`);
			} else {
				item.setAttribute('viewBox', `0 0 ${baseWidth} ${baseHeight}`);
			}

			item.style.zIndex = index;
			let translateYValue = relativeHeight * index / 8;
			let temp = -100 * index;
			/*item.style.transform = `translateY(${translateYValue}px)`;*/
			item.style.bottom = `${temp}px)`;
			gsap.to(item, {
				scrollTrigger: {
					trigger: scrollAnimation,
					start: 'top 40%',
					end: 'bottom 30%',
					toggleActions: 'play none none reverse',
				},
				y: 0,
				duration: 0.3,
				delay: 0.1,
				ease: 'power2.out',
			});
		});
	}

	window.addEventListener('load', updateFooterViewBox);
	window.addEventListener('resize', updateFooterViewBox);



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