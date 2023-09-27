'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll(X/Y)', window.pageXOffset, pageYOffset);
  // console.log('Current scroll(X/Y)', window.scrollX, scrollY);

  console.log(
    'height/width of viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(s1coords);
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // }); // OLD METHOD.

  section1.scrollIntoView({ behavior: 'smooth' }); // MODERN METHOD
});

////////////////////////////////////////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Building a Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  console.log(clicked);

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into event handler functions
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// // Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky Navigation: Intersection Observer API

// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const observerOptions = {
//   root: null, // viewport
//   threshold: [0, 0.2], // Callback function will get called each time that the observed element(section1) is intersecting the root element at the threshold that we defined.
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// const navHeight = nav.clientHeight; // without border (px) Ancak bu yontem degeri tam sayiya yuvarlar.

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Elements on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  /* Dusuk pikselli resimlerden buyuk pikselli resimlere gecilecegi icin
   o resimlerin yuklenmesi gerekmekte. Dusuk internet hizi olan biri 
   siteyi actigi zaman resimlerin yuklenmesi zaman alacak. Eger load event
   olmadan lazy-img classini silersek kullanici dusuk kalite resimleri
   gorecek. */
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // viewport
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Building a slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    // curSlide = 1: -100%, 0%, 100%, 200%
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Selecting, Creating and Deleting Elements
////////////////////////////////////////////////////////////

// // Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button'); // return HTML Collection. HTML collection sayfada silinen bir element oldugu zaman guncellenir.
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn')); // return HTML collection

// // Creating and inserting elements
// //insertAdjacentHTML

// const message = document.createElement('div'); // Creates DOM element. Suanlik DOM icerisinde bir yerde degil, sadece kullanilmak icin hazir vaziyette.
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   ' We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message); // Elementin basina ekler
// header.append(message); // Elementin sonuna ekler
// // header.append(message.cloneNode(true)); // Ayni mesajdan iki tane istiyorsak, clone olusturup eklemek gerekiyor,

// // header.before(message); // insert before header element
// // header.after(message); // insert after header element

// //Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // message.parentElement.removeChild(message); // Eskiden
//   });

/////////////////////////////////////////////////////////////
// Styles, Attributes and Classes
////////////////////////////////////////////////////////////

// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// console.log(message.style.backgroundColor); // This work only with inline styles

// console.log(getComputedStyle(message).color); // CSS dosyasi icerisindeki stylelar bu sekilde alinir.
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered'); // Changing custom css properties

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// //Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('company'));

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // Absolute URL
// console.log(link.getAttribute('href')); // Relative URL

// // Data attributes
// /* Data ile baslayan attributelar dataset yontemiyla alinir.
//  data-version-number orneginde goruldugu gibi datadan sonra gelen
//  kelime grubu camel size sekline donusturulup yazilmalidir. */
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes

// // Don't use because this will override all the existing classes and also
// // it allows us to only put one class on any element.
// // logo.className = 'tugay';

/////////////////////////////////////////////////////////////
// Types of Events and Event Handlers
////////////////////////////////////////////////////////////

// mouseenter: it is just like hover event.

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// // h1.onmouseenter = function (e) {
// //   alert('addEventListener: Great! You are reading the heading');
// // };

/////////////////////////////////////////////////////////////
// Event Propagation in Practice
////////////////////////////////////////////////////////////

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation(); // Not good idea
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor(0, 255);
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true // Capture Parameter. Default: false
// );

/////////////////////////////////////////////////////////////
// DOM Traversing
////////////////////////////////////////////////////////////

// const h1 = document.querySelector('h1');

// console.log('--- CHILDS ---');
// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); // Gives everything. Comments, text...
// console.log(h1.children); // HTML Collection
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// console.log('--- PARENTS ---');
// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Goind sideways: siblings
// console.log(h1.previousElementSibling); // It is first child of parent, so previous element return null.
// console.log(h1.nextElementSibling);

// console.log(h1.parentElement.children); // all siblings include itself
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

/////////////////////////////////////////////////////////////
// Lifecycle DOM Events
////////////////////////////////////////////////////////////

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parse and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// // window.addEventListener('beforeunload', function (e) {
// //   // e.preventDefault();
// //   console.log(e);
// //   e.returnValue = 'Are u sure ?';
// // });
