// Toast Notification Function
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarLinks = document.getElementById('navbarLinks');
    const menuToggle = document.getElementById('menuToggle');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            this.innerHTML = navbarLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Add/remove body class for overlay effect on mobile
            if (window.innerWidth <= 480) {
                document.body.classList.toggle('menu-open');
            }
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
            document.body.classList.remove('menu-open');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // Close mobile menu when a nav link is clicked
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navbarLinks) {
                navbarLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
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
    
    // Contact form submission with EmailJS
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const firstName = document.getElementById('firstName')?.value || '';
            const lastName = document.getElementById('lastName')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || 'Not provided';
            const organization = document.getElementById('organization')?.value || 'Not provided';
            const inquiryType = document.getElementById('inquiryType')?.value || '';
            const subject = document.getElementById('subject')?.value || '';
            const message = document.getElementById('message')?.value || '';

            // Disable submit button and show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: `${firstName} ${lastName}`,
                first_name: firstName,
                last_name: lastName,
                from_email: email,
                phone: phone,
                organization: organization,
                inquiry_type: inquiryType,
                subject: subject,
                message: message,
                to_email: 'himanshu.dhakad23@pccoepune.org' // Developer's email
            };

            // Send email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS credentials
            // Get these from: https://dashboard.emailjs.com/
            emailjs.send('service_cijruvf', 'template_a8w3pvq', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showToast('Message sent successfully! We will get back to you soon.', 'success');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, function(error) {
                    console.error('FAILED...', error);
                    showToast('Failed to send message. Please try again or contact us directly via email.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
    
    // Handle window resize - close mobile menu if window is resized to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && navbarLinks) {
                navbarLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }, 250);
    });
    
    // Prevent body scroll when mobile menu is open
    if (menuToggle && navbarLinks) {
        const body = document.body;
        menuToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                if (navbarLinks.classList.contains('active')) {
                    body.style.overflow = 'hidden';
                } else {
                    body.style.overflow = '';
                }
            }
        });
    }
    
});