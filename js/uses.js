// js/uses.js - Script specifically for the recipe/uses page

document.addEventListener('DOMContentLoaded', function() {
    const recipeContainer = document.querySelector('.recipes-grid-container');
    // If we're not on the recipe page, do nothing.
    if (!recipeContainer) {
        return;
    }

    const categoryItems = document.querySelectorAll('.category-item');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const pageNumbersContainer = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const cardsPerPage = 6;
    let currentPage = 1;
    let filteredCards = Array.from(recipeCards);

    function displayPage() {
        // Hide all cards
        recipeCards.forEach(card => card.style.display = 'none');
        
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        
        // Show cards for the current page
        const cardsToShow = filteredCards.slice(startIndex, endIndex);
        cardsToShow.forEach(card => {
            card.style.display = 'block';
            card.classList.remove('fade-in');
            // Trigger reflow to re-apply animation
            void card.offsetWidth; 
            card.classList.add('fade-in');
        });

        updatePaginationUI();
    }

    function updatePaginationUI() {
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        
        if (pageNumbersContainer) pageNumbersContainer.innerHTML = '';
        
        if (totalPages <= 1) {
             if (prevBtn) prevBtn.style.display = 'none';
             if (nextBtn) nextBtn.style.display = 'none';
             return;
        }

        if (prevBtn) prevBtn.style.display = 'inline-flex';
        if (nextBtn) nextBtn.style.display = 'inline-flex';

        if (prevBtn) prevBtn.disabled = (currentPage === 1);
        if (nextBtn) nextBtn.disabled = (currentPage === totalPages);

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = 'page-number';
            pageNumber.textContent = i;
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                displayPage();
            });
            if (pageNumbersContainer) pageNumbersContainer.appendChild(pageNumber);
        }
    }

    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            if (category === 'all') {
                filteredCards = Array.from(recipeCards);
            } else {
                filteredCards = Array.from(recipeCards).filter(card => card.getAttribute('data-category') === category);
            }
            
            currentPage = 1; // Reset to first page
            displayPage();
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayPage();
            }
        });
    }

    // Initial display
    displayPage();
});