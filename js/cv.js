const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Language switching
const langBtn = document.getElementById('lang-btn');
let currentLang = 'en';

langBtn.addEventListener('click', () => {
    if (currentLang === 'en') {
        currentLang = 'zh';
        langBtn.textContent = 'English';
    } else {
        currentLang = 'en';
        langBtn.textContent = '中文';
    }

    document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.dataset.lang === currentLang) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
});
