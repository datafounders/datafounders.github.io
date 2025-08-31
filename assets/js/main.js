// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('[aria-controls="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            // Toggle between menu and close icons
            const menuIcon = this.querySelector('svg:not(.hidden)');
            const closeIcon = this.querySelector('svg.hidden');
            if (menuIcon) menuIcon.classList.add('hidden');
            if (closeIcon) closeIcon.classList.remove('hidden');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    // Reset menu icons
                    const icons = mobileMenuButton.querySelectorAll('svg');
                    if (icons.length === 2) {
                        icons[0].classList.remove('hidden');
                        icons[1].classList.add('hidden');
                    }
                }
            }
        });
    });

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const successMessage = document.getElementById('formSuccess');
            
            // Simple validation
            let isValid = true;
            contactForm.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    field.addEventListener('input', () => field.classList.remove('border-red-500'));
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            
            try {
                // Replace with your form submission endpoint
                const response = await fetch('YOUR_FORM_SUBMISSION_ENDPOINT', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData)),
                });
                
                if (response.ok) {
                    contactForm.reset();
                    if (successMessage) {
                        successMessage.classList.remove('hidden');
                        setTimeout(() => successMessage.classList.add('hidden'), 5000);
                    } else {
                        alert('Thank you! Your message has been sent.');
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
            }
        });
    }

    // Add animation classes on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };

    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Add current year to footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Simple analytics (optional)
const trackEvent = (category, action, label) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
};

// Track outbound links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    if (link.hostname !== window.location.hostname) {
        trackEvent('outbound', 'click', link.href);
    }
});
