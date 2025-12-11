document.addEventListener('DOMContentLoaded', function () {
    console.log('Documento cargado - Script ejecutándose');

   
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        console.log('Elementos del menú encontrados');
       
        let menuOverlay = document.querySelector('.menu-overlay');
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            body.appendChild(menuOverlay);
            console.log('Overlay creado dinámicamente');
        }

        function toggleMenu() {
            console.log('toggleMenu ejecutado');
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            console.log('Estado del menú:', {
                menuToggleActive: menuToggle.classList.contains('active'),
                navLinksActive: navLinks.classList.contains('active'),
                menuOpen: body.classList.contains('menu-open')
            });
        }

        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Click en botón menú');
            toggleMenu();
        });

        menuOverlay.addEventListener('click', function () {
            console.log('Click en overlay');
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    console.log('Click en enlace móvil');
                    toggleMenu();
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                console.log('Tecla ESC presionada');
                toggleMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                console.log('Redimensionando ventana - cerrando menú');
                toggleMenu();
            }
        });

        console.log('Event listeners añadidos al menú');
    } else {
        console.error('No se encontraron elementos del menú:', {
            menuToggle: menuToggle,
            navLinks: navLinks
        });
    }

    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            backToTopBtn.classList.toggle('active', window.scrollY > 300);
        });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const animatedElements = document.querySelectorAll(
        '.service, .trainer-card, .comment-card, .reveal-animation'
    );

    function checkScroll() {
        animatedElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 150) {
                el.classList.add('active');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }

    checkScroll();
    window.addEventListener('scroll', checkScroll);

    const currentYearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    currentYearElements.forEach(el => {
        el.textContent = currentYear;
    });

    const stars = document.querySelectorAll('.stars i');
    const ratingValue = document.getElementById('ratingValue');

    if (stars.length > 0 && ratingValue) {
        console.log('Sistema de calificación encontrado');
        
        stars[0].classList.replace('far', 'fas');
        stars[0].classList.add('active');

        stars.forEach(star => {
            star.addEventListener('click', function () {
                const rating = this.dataset.rating;
                ratingValue.value = rating;

                stars.forEach(s => {
                    const sRating = s.dataset.rating;
                    s.classList.toggle('fas', sRating <= rating);
                    s.classList.toggle('active', sRating <= rating);
                    s.classList.toggle('far', sRating > rating);
                });
            });

            star.addEventListener('mouseover', function () {
                const rating = this.dataset.rating;
                stars.forEach(s => {
                    if (s.dataset.rating <= rating) s.classList.add('hover');
                });
            });

            star.addEventListener('mouseout', function () {
                stars.forEach(s => s.classList.remove('hover'));
            });
        });
    }

    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.querySelector('.comments-container');
    
    if (commentForm && commentsContainer) {
        console.log('Sistema de comentarios encontrado');
        const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
        
        savedComments.forEach(c => renderComment(c));
        
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const text = this.querySelector('textarea').value;
            const rating = ratingValue ? ratingValue.value : '5';

            if (!name || !email || !text) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }

            const newComment = {
                name,
                rating,
                text,
                time: "Hace un momento",
                avatar: "img/avatarDefault.png"
            };

            savedComments.push(newComment);
            localStorage.setItem('comments', JSON.stringify(savedComments));

            renderComment(newComment);

            this.reset();
            if (ratingValue) ratingValue.value = "5";

            if (stars.length > 0) {
                stars.forEach(s => s.classList.remove('fas', 'active', 'hover'));
                stars.forEach(s => s.classList.add('far'));
                stars[0].classList.replace('far', 'fas');
                stars[0].classList.add('active');
            }
        });
    }

    function renderComment(data) {
        const starHTML = Array.from({ length: 5 })
            .map((_, i) => i < data.rating
                ? `<i class="fas fa-star"></i>`
                : `<i class="far fa-star"></i>`
            ).join("");

        const card = document.createElement("div");
        card.classList.add("comment-card");

        card.innerHTML = `
            <div class="comment-header">
                <div class="comment-avatar">
                    <img src="${data.avatar}" alt="avatar">
                </div>

                <div class="comment-info">
                    <h3>${data.name}</h3>
                    <span class="comment-time">${data.time}</span>
                </div>

                <div class="comment-rating">
                    ${starHTML}
                </div>
            </div>

            <div class="comment-body">
                <p>"${data.text}"</p>
            </div>
        `;

        if (commentsContainer) {
            commentsContainer.appendChild(card);
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.getElementById(href.substring(1));

                if (targetElement) {
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (navLinks && navLinks.classList.contains('active') && menuToggle) {
                        menuToggle.click();
                    }

                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    document.querySelectorAll('form').forEach(form => {
        if (form.id !== 'commentForm') {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });
        }
    });

    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');

        document.querySelectorAll('button, .hero-btn, .about-btn, .history-btn, .submit-btn')
            .forEach(btn => {
                btn.addEventListener('touchstart', () => btn.classList.add('touch-active'));
                btn.addEventListener('touchend', () => btn.classList.remove('touch-active'));
            });
    }

    window.addEventListener('load', function () {
        setTimeout(() => {
            document.querySelectorAll('.hero-content h3').forEach(el => el.style.opacity = '1');
        }, 400);

        setTimeout(() => {
            document.querySelectorAll('.hero-content h1').forEach(el => el.style.opacity = '1');
        }, 700);

        setTimeout(() => {
            document.querySelectorAll('.hero-btn').forEach(el => el.style.opacity = '1');
        }, 1200);
    });

    console.log('Script cargado completamente');
});

function debugMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    console.log('=== DEBUG MENÚ ===');
    console.log('menuToggle encontrado:', !!menuToggle);
    console.log('navLinks encontrado:', !!navLinks);
    
    if (menuToggle) {
        console.log('Estilos de menuToggle:');
        console.log('- display:', getComputedStyle(menuToggle).display);
        console.log('- visibility:', getComputedStyle(menuToggle).visibility);
        console.log('- opacity:', getComputedStyle(menuToggle).opacity);
        console.log('- z-index:', getComputedStyle(menuToggle).zIndex);
    }
    
    if (navLinks) {
        console.log('Estilos de navLinks:');
        console.log('- position:', getComputedStyle(navLinks).position);
        console.log('- right:', getComputedStyle(navLinks).right);
    }
}

window.addEventListener('load', function() {
});