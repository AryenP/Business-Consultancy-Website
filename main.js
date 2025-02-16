// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

// Observe stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

// Language switcher
async function changeLanguage() {
    const lang = document.getElementById('language-select').value;
    document.documentElement.lang = lang;
    try {
        const response = await fetch('./content.json');
        const content = await response.json();
        
        if (content[lang]) {
            // Update all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = getNestedValue(content[lang], key);
                if (translation) {
                    element.textContent = translation;
                    
                    // Handle placeholder attributes for inputs
                    if (element.placeholder) {
                        element.placeholder = translation;
                    }
                    // Handle button values
                    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
                        element.value = translation;
                    }
                    // Handle select options
                    if (element.tagName === 'OPTION') {
                        element.value = translation;
                    }
                }
            });
            
            // Update document direction for Hebrew
            document.dir = lang === 'he' ? 'rtl' : 'ltr';
            
            // Store language preference
            localStorage.setItem('preferred_language', lang);
            
            // Log success for debugging
            console.log('Language changed successfully to:', lang);
            
            // Update meta tags
            document.title = content[lang].meta.title || 'Indo-Israeli Business Consultancy';
            document.querySelector('meta[name="description"]').content = content[lang].meta.description;
        }
    } catch (error) {
        console.error('Error loading translations from content.json:', error);
        showNotification('Failed to load translations', 'error');
    }
}

// Helper function to get nested object values
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => 
        current && current[key] ? current[key] : null, obj);
}

// Chat functionality
function toggleChat() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate bot response after 1 second
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.textContent = "Thanks for your message! Our team will get back to you soon.";
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Initialize chat functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add enter key support for chat
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Add click handlers for chat buttons
    const chatWidget = document.querySelector('.chat-widget');
    const chatClose = document.querySelector('.chat-close');
    const sendButton = document.querySelector('.chat-input button');

    if (chatWidget) {
        chatWidget.addEventListener('click', toggleChat);
    }
    if (chatClose) {
        chatClose.addEventListener('click', toggleChat);
    }
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
});

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Theme toggling
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Email sending function
async function sendEmail(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const buttonText = submitBtn.querySelector('.button-text');
    const buttonLoader = submitBtn.querySelector('.button-loader');
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'block';
    submitBtn.disabled = true;

    const form = e.target;
    const templateParams = {
        from_name: form.name.value,
        company: form.company.value,
        email: form.email.value,
        sector: form.sector.value,
        message: form.message.value,
    };

    try {
        await emailjs.sendForm(
            'service_v86bzjy',  // Your service ID
            'rPTqktXRD6EA79KtcOrQI',  // Your template ID
            form,
            'Lmg2AbO702t5_lwr8'  // Your public key
        );
        showNotification('Thank you! We will contact you shortly.', 'success');
        form.reset();
    } catch (error) {
        console.error('FAILED...', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        buttonText.style.display = 'block';
        buttonLoader.style.display = 'none';
        submitBtn.disabled = false;
    }

    return false;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeIcon = document.querySelector('.theme-toggle i');
    const body = document.body;
    
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        // Ensure dark theme is set
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
        document.getElementById('language-select').value = savedLanguage;
        changeLanguage();
    }

    // Set initial text direction
    document.dir = savedLanguage === 'he' ? 'rtl' : 'ltr';
});

// Add click handler for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        // Toggle expanded class
        this.classList.toggle('expanded');
        
        // Close other cards
        document.querySelectorAll('.service-card').forEach(otherCard => {
            if (otherCard !== this) {
                otherCard.classList.remove('expanded');
            }
        });
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle i');
    
    navLinks.classList.toggle('active');
    navContainer.classList.toggle('active');
    
    // Toggle menu icon
    if (navContainer.classList.contains('active')) {
        mobileMenuBtn.classList.remove('fa-bars');
        mobileMenuBtn.classList.add('fa-times');
    } else {
        mobileMenuBtn.classList.remove('fa-times');
        mobileMenuBtn.classList.add('fa-bars');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navContainer = document.querySelector('.nav-container');
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    
    if (navContainer.classList.contains('active') && 
        !navContainer.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.stats-card, .service-card, .sector-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimations();
}); 