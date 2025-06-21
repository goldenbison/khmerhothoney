// js/uses.js - Script specifically for the recipe/uses page

// Global variables (adjusted to fit the existing uses.js structure)
let currentCategory = 'all'; // Keep track of the active category
let allRecipeCards = []; // Store all recipe cards in their initial DOM order
let filteredCards = []; // Stores the currently filtered (and potentially shuffled) recipes for pagination
let currentPage = 1;
const cardsPerPage = 6; // Renamed from recipesPerPage to match your uses.js

document.addEventListener('DOMContentLoaded', function() {
    const recipeContainer = document.querySelector('.recipes-grid-container');
    
    // If we're not on the recipe page, do nothing.
    if (!recipeContainer) {
        return;
    }

    // Capture all recipe cards once the DOM is loaded
    allRecipeCards = Array.from(document.querySelectorAll('.recipe-card'));
    console.log('Total recipe cards found:', allRecipeCards.length);

    // Initial setup: filter for 'all' and then display the first page.
    // This will also handle the initial shuffle if 'all' is the default.
    filterAndShuffleRecipes('all'); 
});

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    console.log('Shuffling array of length:', array.length);
    const shuffled = [...array]; // Create a copy to avoid modifying the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to filter and then shuffle recipes based on category
function filterAndShuffleRecipes(category) {
    console.log('Filtering and shuffling for category:', category);
    currentCategory = category; // Update global currentCategory

    // 1. Filter the recipes
    if (category === 'all') {
        filteredCards = Array.from(allRecipeCards); // Start with all original cards
    } else {
        filteredCards = Array.from(allRecipeCards).filter(card => card.getAttribute('data-category') === category);
    }
    console.log('Filtered cards count:', filteredCards.length);

    // 2. Shuffle the filtered recipes
    // We want to shuffle every time a category is selected, including 'all'
    filteredCards = shuffleArray(filteredCards);
    console.log('Filtered cards shuffled.');

    // Reset to the first page after filtering/shuffling
    currentPage = 1; 

    // Now, display the correct page based on the new filtered and shuffled order
    displayPage();
    updatePaginationUI(); // Ensure pagination reflects new total pages
}

// Function to display the current page of recipes
function displayPage() {
    const recipeCards = document.querySelectorAll('.recipe-card'); // Re-select to ensure all are included
    // Hide all cards first, regardless of their current visibility state
    recipeCards.forEach(card => card.style.display = 'none');
    
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    
    // Get the cards for the current page from the 'filteredCards' array
    const cardsToShow = filteredCards.slice(startIndex, endIndex);
    
    // Display only the cards that should be on the current page
    cardsToShow.forEach(card => {
        card.style.display = 'block'; // Make it visible
        card.classList.remove('fade-in'); // Remove to allow re-applying animation
        void card.offsetWidth; // Trigger reflow for animation reset
        card.classList.add('fade-in'); // Apply fade-in animation
    });

    console.log(`Displaying page ${currentPage}. Cards from index ${startIndex} to ${endIndex}.`);
}

// Function to update the pagination UI (prev/next buttons and page numbers)
function updatePaginationUI() {
    const pageNumbersContainer = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    
    // Clear existing page numbers
    if (pageNumbersContainer) pageNumbersContainer.innerHTML = '';
    
    // Hide pagination controls if there's only one or no pages
    if (totalPages <= 1) {
         if (prevBtn) prevBtn.style.display = 'none';
         if (nextBtn) nextBtn.style.display = 'none';
         return;
    }

    // Show pagination controls
    if (prevBtn) prevBtn.style.display = 'inline-flex';
    if (nextBtn) nextBtn.style.display = 'inline-flex';

    // Disable/enable prev/next buttons
    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages);

    // Create page number spans
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('span');
        pageNumber.className = 'page-number';
        pageNumber.textContent = i;
        if (i === currentPage) {
            pageNumber.classList.add('active');
        }
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            displayPage(); // Just display the page, filterAndShuffle handles reset
        });
        if (pageNumbersContainer) pageNumbersContainer.appendChild(pageNumber);
    }
    console.log(`Pagination UI updated. Total pages: ${totalPages}, Current page: ${currentPage}`);
}

// Event Listeners for Category Filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(cat => cat.classList.remove('active')); // Deactivate all
            this.classList.add('active'); // Activate clicked one
            
            const category = this.getAttribute('data-category');
            filterAndShuffleRecipes(category); // Filter, shuffle, and display
        });
    });

    // Event Listeners for Pagination Buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage(); // Just display the next/prev page
                updatePaginationUI(); // Update button states and active page number
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayPage(); // Just display the next/prev page
                updatePaginationUI(); // Update button states and active page number
            }
        });
    }
});

// Smooth scrolling for anchor links (kept from your original code)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const targetId = anchor.getAttribute('href');
    if (targetId.length > 1 && targetId.startsWith('#') && document.getElementById(targetId.substring(1))) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Language toggle (placeholder - kept from your original code)
const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
    langToggle.addEventListener('click', function() {
        console.log('Language toggle clicked');
        // Add language switching logic here
    });
}

// Add some visual feedback for recipe card interactions (kept from your original code)
document.addEventListener('click', function(e) {
    if (e.target.closest('.recipe-card')) {
        const card = e.target.closest('.recipe-card');
        const title = card.querySelector('h3').textContent;
        console.log('Recipe card clicked:', title);
        
        // Add a subtle animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
});