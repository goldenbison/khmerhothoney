import { logPageView } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get the current page name
    let pageName = 'unknown';
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path === '/' || path === '') {
        pageName = 'home';
    } else if (path.endsWith('about.html')) {
        pageName = 'about';
    } else if (path.endsWith('shop.html')) {
        pageName = 'shop';
    } else if (path.endsWith('contact.html')) {
        pageName = 'contact';
    }
    
    // Log page view
    logPageView(pageName);
    
    // Track recipe category clicks
    const categoryItems = document.querySelectorAll('.category-item');
    if (categoryItems.length > 0) {
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                logEvent(analytics, 'select_content', {
                    content_type: 'recipe_category',
                    content_id: category
                });
            });
        });
    }
    
    // Track recipe card clicks
    const recipeCards = document.querySelectorAll('.recipe-card');
    if (recipeCards.length > 0) {
        recipeCards.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                const category = this.getAttribute('data-category');
                logEvent(analytics, 'select_content', {
                    content_type: 'recipe',
                    content_id: title,
                    category: category
                });
            });
        });
    }
    
    // Track social media button clicks
    const socialButtons = document.querySelectorAll('.social-icons a, .social-purchase-buttons a');
    if (socialButtons.length > 0) {
        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.href.includes('facebook') ? 'facebook' : 
                                  this.href.includes('instagram') ? 'instagram' : 
                                  this.href.includes('tiktok') ? 'tiktok' : 'unknown';
                
                logEvent(analytics, 'social_engagement', {
                    social_platform: platform,
                    content_type: 'profile_link',
                    method: 'app_open'
                });
            });
        });
    }
    
    // Track language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const currentLang = this.getAttribute('data-current');
            const newLang = currentLang === 'en' ? 'km' : 'en';
            
            logEvent(analytics, 'language_change', {
                from_language: currentLang,
                to_language: newLang
            });
        });
    }
});