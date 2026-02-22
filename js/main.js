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
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                category: document.getElementById('category').value
            };

            try {
                const response = await fetch("/api/send-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                alert(result.message);
                contactForm.reset();

            } catch (error) {
                alert("Something went wrong!");
            }
        });
    }
    
});