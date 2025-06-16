// js/main.js - The primary script for all pages

/**
 * Initializes all sitewide functionality after the page has loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLanguageToggle();
    setActivePage();
});

/**
 * Initializes the mobile menu hamburger toggle.
 * This is the superior version from your second script.
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (menuToggle && navLinks && hamburger) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

/**
 * Initializes the language toggle button and loads the saved language.
 */
function initLanguageToggle() {
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        const savedLanguage = localStorage.getItem('preferred-language') || 'en';
        setLanguage(savedLanguage);
        
        langToggleBtn.addEventListener('click', function() {
            const newLang = this.getAttribute('data-current') === 'en' ? 'km' : 'en';
            setLanguage(newLang);
        });
    }
}

/**
 * Sets the website language.
 * @param {string} lang - The language to set ('en' or 'km').
 */
function setLanguage(lang) {
    const langToggleBtn = document.getElementById('lang-toggle');
    const enIcon = document.querySelector('.en-icon');
    const khIcon = document.querySelector('.kh-icon');

    // Update button state and icon visibility
    if (langToggleBtn && enIcon && khIcon) {
        langToggleBtn.setAttribute('data-current', lang);
        enIcon.classList.toggle('hidden', lang !== 'en');
        khIcon.classList.toggle('hidden', lang !== 'km');
    }

    // Update all translatable text elements
    // FIXED: This version correctly changes text without deleting icons inside links/buttons.
    document.querySelectorAll('[data-en], [data-km]').forEach(el => {
        const text = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-km');
        // Find the first text node child and update it.
        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) {
            textNode.textContent = ' ' + text; // Add space to separate from any preceding icon
        } else {
            el.textContent = text; // Fallback for elements with no icons.
        }
    });

    // Update the root HTML element's lang attribute for accessibility
    document.documentElement.lang = (lang === 'km') ? 'km' : 'en';
    
    // Save the preference for next time
    localStorage.setItem('preferred-language', lang);
}

/**
 * Adds the 'active' class to the navigation link corresponding to the current page.
 */
function setActivePage() {
    const currentPageFile = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        const linkFile = link.getAttribute('href').split('/').pop();
        // Clear previous active states
        link.classList.remove('active');
        // Add active state if the link's href matches the current page
        if (linkFile === currentPageFile) {
            link.classList.add('active');
        }
    });
}


/**
 * Handles opening social media apps with a fallback to web URLs.
 * Keep this function globally accessible for footers and contact pages.
 * MAKE SURE to call this with 'onclick' in your HTML: 
 *   onclick="openSocialApp(this, 'https://fallback-url.com')"
 */
function openSocialApp(link, fallbackUrl) {
    const appUrl = link.getAttribute('href');
    const timeout = setTimeout(function() {
        window.open(fallbackUrl, '_blank');
    }, 1500);

    const clear = () => clearTimeout(timeout);
    window.addEventListener('blur', clear, { once: true });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') clear(); }, { once: true });
    
    window.location = appUrl;
    return false;
}
