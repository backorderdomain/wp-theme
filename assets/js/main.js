/**
 * NYTimes-Inspired News Theme
 * Main JavaScript
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSearchOverlay();
        initSmoothScroll();
        initDateDisplay();
        initShareButtons();
    });

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const primaryNav = document.querySelector('.primary-navigation');

        if (!menuToggle || !primaryNav) return;

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            primaryNav.classList.toggle('active');

            // Update aria-expanded attribute
            const isExpanded = primaryNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.primary-navigation') && !e.target.closest('.menu-toggle')) {
                primaryNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && primaryNav.classList.contains('active')) {
                primaryNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });

        // Close menu when clicking on menu links
        const navLinks = primaryNav.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                primaryNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /**
     * Search Overlay Functionality
     */
    function initSearchOverlay() {
        const searchToggleBtn = document.querySelector('.search-toggle-btn');
        const searchOverlay = document.querySelector('.search-overlay');
        const searchOverlayClose = document.querySelector('.search-overlay-close');
        const searchForm = searchOverlay ? searchOverlay.querySelector('.search-form') : null;
        const searchInput = searchOverlay ? searchOverlay.querySelector('.search-input') : null;

        if (!searchToggleBtn || !searchOverlay) return;

        // Open search overlay
        searchToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus on search input
            setTimeout(function() {
                if (searchInput) searchInput.focus();
            }, 100);
        });

        // Close search overlay
        function closeSearchOverlay() {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (searchOverlayClose) {
            searchOverlayClose.addEventListener('click', closeSearchOverlay);
        }

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearchOverlay();
            }
        });

        // Close when clicking outside
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchOverlay();
            }
        });

        // Handle search form submission
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', function(e) {
                const query = searchInput.value.trim();

                if (!query) {
                    e.preventDefault();
                    alert('Please enter a search term');
                    searchInput.focus();
                    return false;
                }

                // For WordPress conversion, this will be handled by WP
                // For static HTML, redirect to search.html
                if (window.location.hostname === 'localhost' || !window.wp) {
                    e.preventDefault();
                    window.location.href = 'search.html?s=' + encodeURIComponent(query);
                }
            });
        }
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, '', href);
                }
            });
        });
    }

    /**
     * Display Current Date in Header
     */
    function initDateDisplay() {
        const dateElement = document.querySelector('.header-date');

        if (!dateElement) return;

        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    /**
     * Share Buttons Functionality
     */
    function initShareButtons() {
        const shareButtons = document.querySelectorAll('.share-button');

        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                const platform = this.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);

                let shareUrl = '';

                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=${url}`;
                        break;
                    case 'copy':
                        copyToClipboard(window.location.href);
                        showCopyNotification(this);
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, 'share-dialog', 'width=626,height=436');
                }
            });
        });
    }

    /**
     * Copy to Clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                console.log('Link copied to clipboard');
            }).catch(function(err) {
                console.error('Failed to copy:', err);
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }

    /**
     * Fallback Copy Method
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            console.log('Link copied to clipboard (fallback)');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textArea);
    }

    /**
     * Show Copy Notification
     */
    function showCopyNotification(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';

        setTimeout(function() {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 2000);
    }

    /**
     * Lazy Loading Images (optional enhancement)
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Reading Progress Bar (optional enhancement for articles)
     */
    function initReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');

        if (!progressBar) return;

        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;

            progressBar.style.width = progress + '%';
        });
    }

    /**
     * Infinite Scroll (optional - for WordPress implementation)
     */
    function initInfiniteScroll() {
        const loadMoreBtn = document.querySelector('.load-more');

        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // This would be implemented with AJAX in WordPress
            console.log('Load more articles');
        });
    }

    // Initialize optional features if elements exist
    if (document.querySelector('img[data-src]')) {
        initLazyLoading();
    }

    if (document.querySelector('.reading-progress')) {
        initReadingProgress();
    }

    if (document.querySelector('.load-more')) {
        initInfiniteScroll();
    }

})();
