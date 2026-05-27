/**
 * Custom JavaScript for XXX Hospitality website
 * Contains project-specific functionality and customizations
 */

// Custom configuration
const customConfig = {
    animationDuration: 300,
    scrollOffset: 100,
    debounceDelay: 250,
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        large: 1200
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomFeatures();
    initializeAdvancedAnimations();
    initializeCustomInteractions();
    initializePerformanceOptimizations();
    
    console.log('Custom scripts loaded successfully');
});

/**
 * Initialize custom features
 */
function initializeCustomFeatures() {
    // Custom loading screen
    handleLoadingScreen();
    
    // Custom cursor (optional)
    if (window.innerWidth > customConfig.breakpoints.tablet) {
        initializeCustomCursor();
    }
    
    // Advanced scroll effects
    initializeScrollTriggers();
    
    // Custom animations based on user preferences
    respectMotionPreferences();
}

/**
 * Handle loading screen
 */
function handleLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, customConfig.animationDuration);
            }, 500);
        });
    }
}

/**
 * Initialize custom cursor (for desktop)
 */
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #2c5aa0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = '#2c5aa0';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

/**
 * Initialize scroll triggers for advanced animations
 */
function initializeScrollTriggers() {
    const observerOptions = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-50px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const ratio = entry.intersectionRatio;
            
            // Parallax effects
            if (element.classList.contains('parallax')) {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
            
            // Stagger animations
            if (element.classList.contains('stagger-children')) {
                const children = element.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    }
                });
            }
            
            // Progress-based animations
            if (element.classList.contains('progress-animate')) {
                const progress = Math.min(ratio * 2, 1); // Double speed
                element.style.setProperty('--progress', progress);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.parallax, .stagger-children, .progress-animate');
    animatedElements.forEach(el => scrollObserver.observe(el));
}

/**
 * Respect user motion preferences
 */
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleMotionPreference() {
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.body.classList.add('reduce-motion');
            
            // Override CSS animations
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    handleMotionPreference();
    prefersReducedMotion.addEventListener('change', handleMotionPreference);
}

/**
 * Initialize advanced animations
 */
function initializeAdvancedAnimations() {
    // Text reveal animations
    initializeTextReveal();
    
    // Image reveal animations
    initializeImageReveal();
    
    // Counter animations with easing
    initializeAdvancedCounters();
    
    // Magnetic buttons
    initializeMagneticButtons();
}

/**
 * Text reveal animations
 */
function initializeTextReveal() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        // Split text into spans
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease ${index * 0.02}s;
            `;
            element.appendChild(span);
        });
        
        // Trigger animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

/**
 * Image reveal animations
 */
function initializeImageReveal() {
    const images = document.querySelectorAll('.image-reveal');
    
    images.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-reveal-wrapper';
        wrapper.style.cssText = `
            position: relative;
            overflow: hidden;
            display: inline-block;
        `;
        
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #2c5aa0;
            transform: translateX(-100%);
            transition: transform 0.8s ease;
        `;
        wrapper.appendChild(overlay);
        
        // Set initial image state
        img.style.cssText = `
            transform: scale(1.1);
            transition: transform 0.8s ease;
        `;
        
        // Trigger animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    overlay.style.transform = 'translateX(100%)';
                    img.style.transform = 'scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(wrapper);
    });
}

/**
 * Advanced counter animations with easing
 */
function initializeAdvancedCounters() {
    const counters = document.querySelectorAll('.advanced-counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const easing = counter.dataset.easing || 'easeOutQuart';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounterWithEasing(counter, target, duration, easing);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

/**
 * Easing functions
 */
const easingFunctions = {
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeOutBounce: t => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
};

/**
 * Animate counter with easing
 */
function animateCounterWithEasing(element, target, duration, easingType) {
    const start = performance.now();
    const easing = easingFunctions[easingType] || easingFunctions.easeOutQuart;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        const current = Math.floor(target * easedProgress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Initialize magnetic buttons
 */
function initializeMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn, .btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            this.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Initialize custom interactions
 */
function initializeCustomInteractions() {
    // Tilt effect on cards
    initializeTiltEffect();
    
    // Custom hover effects
    initializeHoverEffects();
    
    // Advanced scroll indicators
    initializeScrollIndicators();
    
    // Custom right-click menu (if needed)
    initializeContextMenu();
}

/**
 * Tilt effect on cards
 */
function initializeTiltEffect() {
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 10;
            const rotateY = (centerX - x) / centerX * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

/**
 * Initialize hover effects
 */
function initializeHoverEffects() {
    // Ripple effect
    const rippleElements = document.querySelectorAll('.ripple-effect');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize scroll indicators
 */
function initializeScrollIndicators() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2c5aa0, #1e3d6f);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 10));
}

/**
 * Initialize context menu (optional)
 */
function initializeContextMenu() {
    // Only if specifically needed for the project
    const hasCustomMenu = document.querySelector('.custom-context-menu');
    
    if (hasCustomMenu) {
        document.addEventListener('contextmenu', function(e) {
            // Custom right-click menu logic here
            // This is optional and should only be implemented if specifically required
        });
    }
}

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
    // Lazy load images with fade-in effect
    const lazyImages = document.querySelectorAll('img[data-lazy]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.src = img.dataset.lazy;
                    img.onload = function() {
                        this.style.opacity = '1';
                        this.removeAttribute('data-lazy');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Monitor performance
    if (IS_LIVE) {
        monitorPerformance();
    }
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalImages = [
        // Add paths to critical images that should be preloaded
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Monitor performance
 */
function monitorPerformance() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log('Performance metric:', entry.name, entry.value);
                
                // Send to analytics if needed
                if (typeof gtag === 'function') {
                    gtag('event', 'performance_metric', {
                        metric_name: entry.name,
                        metric_value: entry.value
                    });
                }
            });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
}

/**
 * Utility functions for custom features
 */

// Advanced throttle with leading and trailing options
function advancedThrottle(func, limit, options = {}) {
    let inThrottle, lastFunc, lastRan;
    const { leading = true, trailing = true } = options;
    
    return function() {
        const context = this;
        const args = arguments;
        
        if (!inThrottle) {
            if (leading) func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            if (trailing) {
                lastFunc = setTimeout(function() {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    };
}

// Device detection
function getDeviceType() {
    const width = window.innerWidth;
    
    if (width <= customConfig.breakpoints.mobile) return 'mobile';
    if (width <= customConfig.breakpoints.tablet) return 'tablet';
    if (width <= customConfig.breakpoints.desktop) return 'desktop';
    return 'large';
}

// Export custom functions for global use
window.customConfig = customConfig;
window.getDeviceType = getDeviceType;
window.advancedThrottle = advancedThrottle;

// Add device class to body
document.body.classList.add('device-' + getDeviceType());

// Update device class on resize
window.addEventListener('resize', debounce(() => {
    document.body.className = document.body.className.replace(/device-\w+/, 'device-' + getDeviceType());
}, customConfig.debounceDelay));

// ================================
// HEADER COMPONENT FUNCTIONALITY
// ================================

document.addEventListener('componentsLoaded', function() {
    initializeHeader();
});

function initializeHeader() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-navigation');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const body = document.body;
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            body.classList.toggle('mobile-menu-open');
        });
        
        // Close mobile menu when clicking overlay
        mobileOverlay.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.classList.remove('mobile-menu-open');
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-nav__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                body.classList.remove('mobile-menu-open');
            });
        });
    }
    
    // Set active navigation based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === '/')) {
            link.closest('.privary-navigation__item').classList.add('active');
        }
    });
    
    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

class SimpleHospitalitySlider {
    constructor() {
        this.track = document.getElementById('sliderTrack');
        this.items = document.querySelectorAll('.slider__item');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        if (!this.track || !this.items.length) return;
        
        this.currentIndex = 0;
        this.itemWidth = 350 + 30; // width + gap
        this.visibleItems = this.getVisibleItems();
        this.maxIndex = Math.max(0, this.items.length - this.visibleItems);
        
        this.init();
    }
    
    init() {
        this.updateSlider();
        this.addEventListeners();
        this.handleResize();
        
        // Marcar el primer item como activo
        if (this.items[0]) {
            this.items[0].classList.add('active');
        }
    }
    
    getVisibleItems() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const maxVisible = Math.floor(containerWidth / this.itemWidth);
        return Math.max(1, Math.min(maxVisible, 3)); // Mínimo 1, máximo 3
    }
    
    updateSlider() {
        const translateX = -this.currentIndex * this.itemWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar botones
        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.maxIndex;
        
        // Actualizar items activos
        this.items.forEach((item, index) => {
            item.classList.remove('active', 'slide-in-left', 'slide-in-right');
            
            if (index >= this.currentIndex && index < this.currentIndex + this.visibleItems) {
                item.classList.add('active');
                
                // Añadir animación de entrada
                setTimeout(() => {
                    item.classList.add(index === this.currentIndex ? 'slide-in-left' : 'slide-in-right');
                }, 100);
            }
        });
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }
    
    addEventListeners() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
            });
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
            });
        }
        
        // Touch/swipe support para móviles
        let startX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        }, { passive: false });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
        }, { passive: true });
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }
    
    handleResize() {
        window.addEventListener('resize', debounce(() => {
            const newVisibleItems = this.getVisibleItems();
            if (newVisibleItems !== this.visibleItems) {
                this.visibleItems = newVisibleItems;
                this.maxIndex = Math.max(0, this.items.length - this.visibleItems);
                this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                this.updateSlider();
            }
        }, 250));
    }
}

// ===== SLIDER SIMPLE CON BOTONES CIRCULARES BLANCOS =====

class SimpleSlider {
    constructor() {
        this.track = document.getElementById('sliderTrack');
        this.items = document.querySelectorAll('.slider__item');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        console.log('Initializing slider...', {
            track: this.track,
            items: this.items.length,
            prevBtn: this.prevBtn,
            nextBtn: this.nextBtn
        });
        
        if (!this.track || !this.items.length) {
            console.log('Slider elements not found');
            return;
        }
        
        this.currentIndex = 0;
        this.itemWidth = 350 + 30; // width + gap
        this.visibleItems = this.getVisibleItems();
        this.maxIndex = Math.max(0, this.items.length - this.visibleItems);
        
        this.init();
    }
    
    init() {
        console.log('Slider initialized with:', {
            currentIndex: this.currentIndex,
            visibleItems: this.visibleItems,
            maxIndex: this.maxIndex
        });
        
        this.updateSlider();
        this.addEventListeners();
        this.handleResize();
        
        // Marcar el primer item como activo
        if (this.items[0]) {
            this.items[0].classList.add('active');
        }
    }
    
    getVisibleItems() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const maxVisible = Math.floor(containerWidth / this.itemWidth);
        return Math.max(1, Math.min(maxVisible, 3)); // Mínimo 1, máximo 3
    }
    
    updateSlider() {
        const translateX = -this.currentIndex * this.itemWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        console.log('Slider updated:', {
            currentIndex: this.currentIndex,
            translateX: translateX
        });
        
        // Actualizar botones
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.4' : '1';
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.maxIndex;
            this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.4' : '1';
        }
        
        // Actualizar items activos
        this.items.forEach((item, index) => {
            item.classList.remove('active', 'slide-in-left', 'slide-in-right');
            
            if (index >= this.currentIndex && index < this.currentIndex + this.visibleItems) {
                item.classList.add('active');
                
                // Añadir animación de entrada
                setTimeout(() => {
                    item.classList.add(index === this.currentIndex ? 'slide-in-left' : 'slide-in-right');
                }, 100);
            }
        });
    }
    
    next() {
        console.log('Next clicked, current:', this.currentIndex, 'max:', this.maxIndex);
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }
    
    prev() {
        console.log('Prev clicked, current:', this.currentIndex);
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }
    
    addEventListeners() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.next();
            });
            console.log('Next button listener added');
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Prev button clicked');
                this.prev();
            });
            console.log('Prev button listener added');
        }
        
        // Touch/swipe support para móviles
        let startX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        }, { passive: false });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
        }, { passive: true });
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }
    
    handleResize() {
        window.addEventListener('resize', debounce(() => {
            const newVisibleItems = this.getVisibleItems();
            if (newVisibleItems !== this.visibleItems) {
                this.visibleItems = newVisibleItems;
                this.maxIndex = Math.max(0, this.items.length - this.visibleItems);
                this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                this.updateSlider();
            }
        }, 250));
    }
}

// Múltiples formas de inicializar para asegurar que funcione
function initializeSlider() {
    console.log('Attempting to initialize slider...');
    
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack && !window.sliderInstance) {
        window.sliderInstance = new SimpleSlider();
        console.log('Slider initialized successfully!');
    } else if (!sliderTrack) {
        console.log('Slider track not found');
    } else {
        console.log('Slider already initialized');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing slider...');
    setTimeout(initializeSlider, 500);
});

// Inicializar después de que se carguen los componentes
document.addEventListener('componentsLoaded', function() {
    console.log('Components loaded, initializing slider...');
    setTimeout(initializeSlider, 500);
});

// Inicializar cuando la ventana esté completamente cargada
window.addEventListener('load', function() {
    console.log('Window loaded, initializing slider...');
    setTimeout(initializeSlider, 1000);
});

// Función manual para debugging
window.initSliderManually = function() {
    console.log('Manual slider initialization...');
    initializeSlider();
};

// Animaciones para Success & Press Section
function initializeSuccessPressAnimations() {
    // Simple animation on scroll observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Add hover effects
    const successPressItems = document.querySelectorAll('.success-press-item');
    successPressItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSuccessPressAnimations();
});

// Prevenir que el logo pierda estilo al hacer clic
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.header__logo');
    const logoLink = document.querySelector('.header__logo a, a.header__logo');
    
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            // Mantener estilos del logo después del clic
            setTimeout(() => {
                if (logo) {
                    logo.style.color = '#ffffff';
                    logo.style.visibility = 'visible';
                    logo.style.opacity = '1';
                }
                if (logoLink) {
                    logoLink.style.color = '#ffffff';
                    logoLink.style.visibility = 'visible';
                }
            }, 10);
        });
    }
    
    // Prevenir pérdida de estilo en cualquier navegación
    const allLogoElements = document.querySelectorAll('.header__logo, .header__logo *, .logo-text');
    allLogoElements.forEach(el => {
        el.addEventListener('click', function() {
            setTimeout(() => {
                this.style.visibility = 'visible';
                this.style.opacity = '1';
            }, 10);
        });
    });
});