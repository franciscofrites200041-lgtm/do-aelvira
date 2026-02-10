/**
 * Quinta Doña Elvira — Landing Page Scripts
 * Handles: Navbar scroll behavior, side menu, scroll reveal animations
 */

(function () {
    'use strict';

    // ─── ELEMENTS ───────────────────────────────
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('[data-menu-link]');
    const revealElements = document.querySelectorAll('.reveal-element');

    // ─── NAVBAR: Transparent → Sticky with stone texture ──────
    const SCROLL_THRESHOLD = 80;
    let lastScrollY = 0;
    let ticking = false;

    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    handleNavbarScroll();

    // ─── SIDE MENU ──────────────────────────────
    function openMenu() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        sideMenu.setAttribute('aria-hidden', 'false');
        menuOverlay.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');

        // Focus trap: focus the close button
        setTimeout(function () {
            menuClose.focus();
        }, 400);
    }

    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        sideMenu.setAttribute('aria-hidden', 'true');
        menuOverlay.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu on link click
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ─── SCROLL REVEAL (Intersection Observer) ──────────
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // ─── SMOOTH SCROLL for anchor links ─────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── PARALLAX-LIKE SUBTLE EFFECT ON HERO VIDEO ──────
    let heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        let parallaxTicking = false;

        window.addEventListener('scroll', function () {
            if (!parallaxTicking) {
                window.requestAnimationFrame(function () {
                    const scrollY = window.scrollY;
                    const heroHeight = window.innerHeight;

                    if (scrollY < heroHeight) {
                        const translateY = scrollY * 0.3;
                        heroVideo.style.transform = 'translateY(' + translateY + 'px) scale(1.05)';
                    }

                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }

    // ─── BANQUETE PHOTO HOVER: subtle parallax ─────────
    const banqueteFrame = document.querySelector('.banquete-photo-frame');
    if (banqueteFrame && window.matchMedia('(min-width: 1024px)').matches) {
        banqueteFrame.addEventListener('mousemove', function (e) {
            const rect = banqueteFrame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            banqueteFrame.style.transform =
                'rotate(' + (-4 + x * 3) + 'deg) ' +
                'perspective(800px) ' +
                'rotateY(' + (x * 5) + 'deg) ' +
                'rotateX(' + (-y * 5) + 'deg) ' +
                'scale(1.02)';
        });

        banqueteFrame.addEventListener('mouseleave', function () {
            banqueteFrame.style.transform = 'rotate(-4deg)';
        });
    }

})();
