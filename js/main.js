document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle - revised version
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            console.log('Menu toggled - classes added:', navLinks.classList.contains('active')); // Debug info
        });
    } else {
        console.error('Menu toggle element not found');
    }
    
    // Recipe category filter and pagination
    const categoryItems = document.querySelectorAll('.category-item');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    // Pagination variables
    const cardsPerPage = 6;
    let currentPage = 1;
    let filteredCards = [];
    
    // Get pagination DOM elements
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Initialize pagination
    function initPagination() {
        // Get currently visible cards based on active category
        const activeCategory = document.querySelector('.category-item.active').getAttribute('data-category');
        
        if (activeCategory === 'all') {
            filteredCards = Array.from(recipeCards);
        } else {
            filteredCards = Array.from(recipeCards).filter(card => 
                card.getAttribute('data-category') === activeCategory
            );
        }
        
        // Calculate total pages
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        
        // Reset to page 1 when changing categories
        currentPage = 1;
        
        // Generate page numbers
        generatePageNumbers(totalPages);
        
        // Display cards for current page
        displayCards();
        
        // Update pagination buttons state
        updatePaginationState(totalPages);
    }
    
    // Generate page number elements with improved mobile display
    function generatePageNumbers(totalPages) {
        if (!pageNumbers) return; // Safety check
        
        pageNumbers.innerHTML = '';
        
        // Determine if we need mobile-specific pagination
        const isMobile = window.innerWidth <= 576;
        const manyPages = totalPages > 5;
        
        // Add pagination container class for styling
        const paginationContainer = document.querySelector('.pagination');
        if (paginationContainer) {
            if (manyPages) {
                paginationContainer.classList.add('many-pages');
            } else {
                paginationContainer.classList.remove('many-pages');
            }
        }
        
        // For mobile view with many pages, show a window of pages
        if (isMobile && manyPages) {
            let startPage, endPage;
            
            if (currentPage <= 2) {
                // Near the beginning
                startPage = 1;
                endPage = Math.min(3, totalPages);
            } else if (currentPage >= totalPages - 1) {
                // Near the end
                startPage = Math.max(totalPages - 2, 1);
                endPage = totalPages;
            } else {
                // Middle - show current page with one before and after
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
            
            // First page or ellipsis
            if (startPage > 1) {
                addPageNumber(1);
                if (startPage > 2) {
                    addEllipsis();
                }
            }
            
            // Add visible page range
            for (let i = startPage; i <= endPage; i++) {
                addPageNumber(i);
            }
            
            // Last page or ellipsis
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    addEllipsis();
                }
                addPageNumber(totalPages);
            }
        } else {
            // For desktop or few pages, show all or a standard window
            if (!isMobile && manyPages) {
                // Desktop with many pages
                if (currentPage <= 3) {
                    // Near the beginning
                    for (let i = 1; i <= 5; i++) {
                        addPageNumber(i);
                    }
                    addEllipsis();
                    addPageNumber(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    // Near the end
                    addPageNumber(1);
                    addEllipsis();
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                        addPageNumber(i);
                    }
                } else {
                    // Middle
                    addPageNumber(1);
                    addEllipsis();
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        addPageNumber(i);
                    }
                    addEllipsis();
                    addPageNumber(totalPages);
                }
            } else {
                // Few pages, show all
                for (let i = 1; i <= totalPages; i++) {
                    addPageNumber(i);
                }
            }
        }
        
        // Function to add a page number
        function addPageNumber(num) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${num === currentPage ? 'active' : ''}`;
            pageNumber.setAttribute('data-page', num);
            pageNumber.textContent = num;
            
            pageNumber.addEventListener('click', () => {
                currentPage = num;
                const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
                generatePageNumbers(totalPages); // Regenerate the pagination
                displayCards();
                updatePaginationState(totalPages);
            });
            
            pageNumbers.appendChild(pageNumber);
        }
        
        // Function to add ellipsis
        function addEllipsis() {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
    }
    
    // Display cards for current page with animation
    function displayCards() {
        // Hide all cards first and remove animation class
        recipeCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        });
        
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        
        // Display only the cards for current page with animation
        filteredCards.slice(startIndex, endIndex).forEach(card => {
            card.style.display = 'block';
            // Small delay for animation
            setTimeout(() => {
                card.classList.add('fade-in');
            }, 10);
        });
    }
    
    // Update prev/next buttons state
    function updatePaginationState(totalPages) {
        if (!prevBtn || !nextBtn) return; // Safety check
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }
    
    // Event listeners for pagination buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
                generatePageNumbers(totalPages); // Regenerate the pagination
                displayCards();
                updatePaginationState(totalPages);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                generatePageNumbers(totalPages); // Regenerate the pagination
                displayCards();
                updatePaginationState(totalPages);
            }
        });
    }
    
    // Add window resize handler to regenerate pagination for responsive layout
    window.addEventListener('resize', () => {
        const activeCategory = document.querySelector('.category-item.active');
        if (activeCategory) {
            const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
            generatePageNumbers(totalPages);
            updatePaginationState(totalPages);
        }
    });
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all category items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category item
            this.classList.add('active');
            
            // Initialize pagination with the new category
            if (document.querySelector('.pagination-container')) {
                initPagination();
            } else {
                // Fallback to original filter behavior
                const filterCategory = this.getAttribute('data-category');
                
                recipeCards.forEach(card => {
                    if (filterCategory === 'all' || card.getAttribute('data-category') === filterCategory) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('fade-in');
                        }, 10);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });
            }
        });
    });
    
    // Initialize pagination if pagination elements exist
    if (document.querySelector('.pagination-container')) {
        initPagination();
    }
    
    // Add click event for recipe cards
    recipeCards.forEach(card => {
        card.addEventListener('click', function() {
            const recipeTitle = this.querySelector('h3').textContent;
            console.log(`Clicked on recipe: ${recipeTitle}`);
        });
    });
    
    // Add scroll animation for elements
    function animateOnScroll() {
        const elements = document.querySelectorAll('.story-content, .ingredient-item, .process-step');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
});