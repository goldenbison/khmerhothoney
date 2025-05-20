// File: js/language.js
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation link based on current page
    setActivePage();
    
    // Language toggle functionality
    initLanguageToggle();
    
    // Mobile menu toggle
    initMobileMenu();
});

function setActivePage() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Special case for home page
    if (currentPage === '' || currentPage === 'index.html') {
        document.getElementById('nav-recipes').classList.add('active');
    }
}

function initLanguageToggle() {
    const langToggleBtn = document.getElementById('lang-toggle');
    const enIcon = document.querySelector('.en-icon');
    const khIcon = document.querySelector('.kh-icon');
    
    if (langToggleBtn) {
        // Check for saved language preference
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
        
        // Add click event listener
        langToggleBtn.addEventListener('click', function() {
            const currentLang = this.getAttribute('data-current');
            const newLang = currentLang === 'en' ? 'km' : 'en';
            
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        });
    }
}

function setLanguage(lang) {
    const langToggleBtn = document.getElementById('lang-toggle');
    const enIcon = document.querySelector('.en-icon');
    const khIcon = document.querySelector('.kh-icon');
    
    if (langToggleBtn) {
        // Update button data attribute
        langToggleBtn.setAttribute('data-current', lang);
        
        // Show/hide appropriate language icon
        if (lang === 'en') {
            enIcon.classList.remove('hidden');
            khIcon.classList.add('hidden');
        } else {
            enIcon.classList.add('hidden');
            khIcon.classList.remove('hidden');
        }
        
        // Update all elements with data-en and data-km attributes
        const elementsWithLang = document.querySelectorAll('[data-en][data-km]');
        
        elementsWithLang.forEach(el => {
            if (lang === 'en') {
                el.textContent = el.getAttribute('data-en');
            } else {
                el.textContent = el.getAttribute('data-km');
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
    }
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}