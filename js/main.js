// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarLinks = document.getElementById('navbarLinks');
    const menuToggle = document.getElementById('menuToggle');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarLinks.classList.toggle('active');
            this.innerHTML = navbarLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            navbarLinks && 
            !navbarLinks.contains(e.target) && 
            menuToggle && 
            !menuToggle.contains(e.target)) {
            navbarLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // Set active navigation link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.parentElement.classList.remove('active');
            
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
                link.parentElement.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // Section Navigation Active State on Scroll (works for both index.html and support.html)
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    
    // Dynamically detect sections based on current page
    let sections = document.querySelectorAll('#vision, #objectives, #services'); // For index.html
    if (sections.length === 0) {
        // For support.html or other pages
        sections = document.querySelectorAll('#forums, #higher-education, #competitive-exams');
    }
    
    function updateSectionNavigation() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset + 200; // Offset for better triggering
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        sectionNavButtons.forEach(btn => {
            btn.classList.remove('active');
            const btnHref = btn.getAttribute('href').substring(1);
            if (btnHref === currentSection) {
                btn.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    if (sections.length > 0) {
        window.addEventListener('scroll', updateSectionNavigation);
    }
    
    // Smooth scroll for section navigation
    sectionNavButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 120; // Account for sticky headers
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.objective-card, .team-card, .faculty-row-card, .forum-card, .edu-card').forEach(card => {
        observer.observe(card);
    });
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                category: document.getElementById('category').value
            };
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
});
// Image Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliderSection = document.querySelector('.image-slider-section');
    if (!sliderSection) return;

    const sliderTrack = sliderSection.querySelector('.slider-track');
    const slides = sliderSection.querySelectorAll('.slide');
    const indicators = sliderSection.querySelectorAll('.indicator');
    const prevArrow = sliderSection.querySelector('.prev-arrow');
    const nextArrow = sliderSection.querySelector('.next-arrow');
    const autoplayToggle = sliderSection.querySelector('#autoplayToggle');
    
    let currentSlide = 0;
    let slideInterval;
    let autoplay = true;
    const slideDuration = 3000; // 3 seconds
    
    // Initialize slider
    function initSlider() {
        updateSlider();
        if (autoplay) {
            startAutoplay();
        }
    }
    
    // Update slider position
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active classes
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        updateSlider();
        resetAutoplay();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Start autoplay
    function startAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
        autoplayToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    // Stop autoplay
    function stopAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
        autoplayToggle.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // Reset autoplay timer
    function resetAutoplay() {
        if (autoplay) {
            startAutoplay();
        }
    }
    
    // Toggle autoplay
    function toggleAutoplay() {
        autoplay = !autoplay;
        if (autoplay) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
    }
    
    // Event Listeners
    prevArrow.addEventListener('click', prevSlide);
    nextArrow.addEventListener('click', nextSlide);
    autoplayToggle.addEventListener('click', toggleAutoplay);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!sliderSection.contains(document.activeElement)) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            e.preventDefault();
        } else if (e.key === ' ') {
            toggleAutoplay();
            e.preventDefault();
        }
    });
    
    // Pause on hover
    sliderSection.addEventListener('mouseenter', function() {
        if (autoplay) stopAutoplay();
    });
    
    sliderSection.addEventListener('mouseleave', function() {
        if (autoplay) startAutoplay();
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderSection.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderSection.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }
    
    // Initialize the slider
    initSlider();
});