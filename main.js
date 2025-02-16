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

// Chat widget
function openChat() {
    // Initialize chat widget (e.g., Intercom or custom solution)
    console.log('Opening chat...');
}

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
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.submit-button');
    const formData = new FormData(form);
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Replace with your actual API endpoint
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showNotification('Thank you! We will contact you shortly.', 'success');
            form.reset();
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = document.getElementById('language-select').value === 'he' ? 'קבע ייעוץ' : 'Schedule Consultation';
    }
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
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