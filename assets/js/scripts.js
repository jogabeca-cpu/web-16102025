/**
 * Main JavaScript file for XXX Hospitality website
 * Contains core functionality and interactions
 */

// Global variables
let site_url = window.location.origin;
let IS_LIVE = window.location.hostname !== 'localhost';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeSliders();
    initializeAnimations();
    initializeModals();
    initializeFilters();
    initializeFAQ();
    initializeScrollEffects();
    
    // Set responsive flag
    if (typeof responsive === 'undefined') {
        window.responsive = true;
    }
    
    console.log('Website scripts loaded successfully');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.privary-navigation__item a');
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === '/')) {
            link.closest('.privary-navigation__item').classList.add('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Slider initialization
 */
function initializeSliders() {
    // Hero slider
    const heroSlider = document.querySelector('.sym-slides-slider-home');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.slide');
        let currentSlide = 0;
        
        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].style.opacity = '0';
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].style.opacity = '1';
            }, 5000);
        }
    }
    
    // Services slider
    const servicesSlider = document.querySelector('.sym-slider');
    if (servicesSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        servicesSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            servicesSlider.classList.add('active');
            startX = e.pageX - servicesSlider.offsetLeft;
            scrollLeft = servicesSlider.scrollLeft;
        });
        
        servicesSlider.addEventListener('mouseleave', () => {
            isDown = false;
            servicesSlider.classList.remove('active');
        });
        
        servicesSlider.addEventListener('mouseup', () => {
            isDown = false;
            servicesSlider.classList.remove('active');
        });
        
        servicesSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - servicesSlider.offsetLeft;
            const walk = (x - startX) * 2;
            servicesSlider.scrollLeft = scrollLeft - walk;
        });
        
        // Touch support for mobile
        servicesSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - servicesSlider.offsetLeft;
            scrollLeft = servicesSlider.scrollLeft;
        });
        
        servicesSlider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - servicesSlider.offsetLeft;
            const walk = (x - startX) * 2;
            servicesSlider.scrollLeft = scrollLeft - walk;
        });
    }
}

/**
 * Animation initialization
 */
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for counter animations
                if (entry.target.classList.contains('metric-number') || 
                    entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Special handling for SVG line animations
                if (entry.target.classList.contains('rectangle-svg')) {
                    entry.target.classList.add('animate-lines');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-fade, .animate-clip, .animate-bottom, .animate-top').forEach(el => {
        observer.observe(el);
    });
    
    // Observe counters and SVGs
    document.querySelectorAll('.metric-number, .stat-number, .rectangle-svg').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Animate number counters
 */
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = element.textContent.replace(/\d+/, target);
            clearInterval(timer);
        } else {
            element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
        }
    }, 16);
}

/**
 * Modal functionality
 */
function initializeModals() {
    const modal = document.getElementById('fancyBox-form');
    const modalTriggers = document.querySelectorAll('[data-fancybox]');
    const modalContent = modal?.querySelector('.form-module-wrapper');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Animate in
                setTimeout(() => {
                    modal.style.opacity = '1';
                    if (modalContent) {
                        modalContent.style.transform = 'scale(1)';
                    }
                }, 10);
            }
        });
    });
    
    // Close modal
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        if (modal) {
            modal.style.opacity = '0';
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
            }
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    // Add close button functionality if exists
    const closeButtons = document.querySelectorAll('.modal-close, .close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
}

/**
 * Filter functionality for portfolio and jobs
 */
function initializeFilters() {
    // Portfolio filters
    const portfolioFilters = document.querySelectorAll('.filter-btn[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');
    
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            portfolioFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        if (item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
    
    // Job filters
    const jobFilters = document.querySelectorAll('.job-filter .filter-btn[data-filter]');
    const jobItems = document.querySelectorAll('.job-item[data-category]');
    
    jobFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            jobFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            let visibleCount = 0;
            jobItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            const noResults = document.querySelector('.no-openings');
            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
}

/**
 * FAQ functionality
 */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            slideUp(otherAnswer);
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    slideUp(answer);
                } else {
                    item.classList.add('active');
                    slideDown(answer);
                }
            });
        }
    });
}

/**
 * Scroll effects
 */
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.top-content .header-img');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

/**
 * Utility functions
 */

// Slide up animation
function slideUp(element, duration = 300) {
    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = duration + 'ms';
    element.style.boxSizing = 'border-box';
    element.style.height = element.offsetHeight + 'px';
    
    element.offsetHeight; // Force repaint
    
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    
    setTimeout(function() {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
    }, duration);
}

// Slide down animation
function slideDown(element, duration = 300) {
    element.style.removeProperty('display');
    let display = window.getComputedStyle(element).display;
    if (display === 'none') display = 'block';
    
    element.style.display = display;
    let height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    
    element.offsetHeight; // Force repaint
    
    element.style.boxSizing = 'border-box';
    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = duration + 'ms';
    element.style.height = height + 'px';
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    
    setTimeout(function() {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
    }, duration);
}

// Fade in animation
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Fade out animation
function fadeOut(element, duration = 300) {
    const startTime = performance.now();
    const startOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = startOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for global use
window.slideUp = slideUp;
window.slideDown = slideDown;
window.fadeIn = fadeIn;
window.fadeOut = fadeOut;
window.debounce = debounce;
window.throttle = throttle;

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.querySelectorAll('img[data-src]').length > 0) {
    initializeLazyLoading();
}

// Performance monitoring
if (IS_LIVE && 'performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        }, 0);
    });
}
// ================================
// STATS COUNTER ANIMATION
// ================================

function startCounter() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        
        const updateCounter = () => {
            count += increment;
            
            if (count < target) {
                counter.textContent = Math.floor(count);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer - Inicia el contador cuando la sección es visible
function observeStatsSection() {
    const statsSection = document.querySelector('.hero-stats');
    
    if (!statsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter();
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(statsSection);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeStatsSection);
} else {
    observeStatsSection();
}

// ================================
// MEDIA SLIDER (VIDEO/IMAGES)
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.media-slide');
    const indicators = document.querySelectorAll('.indicator');
    const heroVideo = document.getElementById('heroVideo');
    const playPauseBtn = document.getElementById('playPauseMenuItem');
    const menuBtn = document.getElementById('videoMenuBtn');
    const dropdown = document.getElementById('videoMenuDropdown');
    const menuText = playPauseBtn?.querySelector('.menu-text');
    
    let currentSlide = 0;
    let isSliderPlaying = true;
    let sliderInterval;
    
    // Iniciar el video automáticamente
    if (heroVideo) {
        heroVideo.play().catch(e => console.log('Autoplay prevented:', e));
    }
    
    // 👉 Mostrar / ocultar menú dropdown
    if (menuBtn && dropdown) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Cerrar el menú si haces clic fuera
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Función para cambiar de slide
    function goToSlide(index) {
        // Remover clase active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Pausar video actual si existe
        const currentVideo = slides[currentSlide].querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }
        
        // Activar el nuevo slide
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        
        // Reproducir video si es un video
        const newVideo = slides[currentSlide].querySelector('video');
        if (newVideo && isSliderPlaying) {
            newVideo.play().catch(e => console.log('Play prevented:', e));
        }
    }
    
    // Función para avanzar al siguiente slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    // Iniciar slider automático
    function startSlider() {
        sliderInterval = setInterval(nextSlide, 3000); // Cambia cada 3 segundos
    }
    
    // Pausar slider
    function stopSlider() {
        clearInterval(sliderInterval);
    }
    
    // Toggle play/pause UNIFICADO (pausa TODO: slider + video + imágenes)
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            isSliderPlaying = !isSliderPlaying;
            
            if (isSliderPlaying) {
                // PLAY - Reanudar todo
                menuText.textContent = 'Pause';
                
                // Actualizar el ícono a "pause"
                const icon = playPauseBtn.querySelector('svg path');
                if (icon) {
                    icon.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
                }
                
                startSlider();
                
                // Reproducir video actual si es un video
                const currentVideo = slides[currentSlide].querySelector('video');
                if (currentVideo) {
                    currentVideo.play().catch(e => console.log('Play prevented:', e));
                }
            } else {
                // PAUSE - Pausar TODO (slider + video)
                menuText.textContent = 'Play';
                
                // Actualizar el ícono a "play"
                const icon = playPauseBtn.querySelector('svg path');
                if (icon) {
                    icon.setAttribute('d', 'M8 5v14l11-7z');
                }
                
                stopSlider();
                
                // Pausar video actual si es un video
                const currentVideo = slides[currentSlide].querySelector('video');
                if (currentVideo) {
                    currentVideo.pause();
                }
            }
            
            // Cerrar el dropdown después de hacer clic
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Click en indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            // Solo cambiar si el slider está activo
            if (isSliderPlaying) {
                stopSlider();
                goToSlide(index);
                startSlider();
            } else {
                // Si está pausado, solo cambia de slide sin reanudar
                goToSlide(index);
                // Pausar el video si hay uno
                const newVideo = slides[index].querySelector('video');
                if (newVideo) {
                    newVideo.pause();
                }
            }
        });
    });
    
    // Fullscreen functionality
    const fullscreenBtn = document.getElementById('fullscreenMenuItem');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const section = document.querySelector('.top-content');
            if (section) {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    section.requestFullscreen().catch(err => {
                        console.log('Error fullscreen:', err);
                    });
                }
            }
            
            // Cerrar el dropdown después de hacer clic
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Iniciar el slider automáticamente
    startSlider();
    
    // Pausar cuando el usuario cambia de pestaña
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopSlider();
            const currentVideo = slides[currentSlide].querySelector('video');
            if (currentVideo) currentVideo.pause();
        } else if (isSliderPlaying) {
            startSlider();
            const currentVideo = slides[currentSlide].querySelector('video');
            if (currentVideo) currentVideo.play();
        }
    });
});