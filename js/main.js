// HOP Framework Documentation - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAccordions();
    initializeSearch();
    initializeCopyButtons();
    initializeSmoothScroll();
    initializeSidebarHighlight();
    initializeCodeHighlighting();
    initializeTooltips();
    initializeMobileMenu();
    initializeResponsiveTable();
});

// Tab System
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs').parentElement;
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents in this group
            tabGroup.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabGroup.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const activeContent = tabGroup.querySelector(`#${tabId}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// Accordion System
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all accordions in the same group
            const accordionGroup = item.closest('.accordion');
            accordionGroup.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Toggle current accordion
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const searchableItems = document.querySelectorAll('.card, .accordion-item, h2, h3');
        
        searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const parent = item.closest('.main-content');
            
            if (text.includes(searchTerm) || searchTerm === '') {
                item.style.display = '';
                highlightSearchTerm(item, searchTerm);
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show "No results" message if needed
        updateSearchResults(searchTerm);
    });
}

function highlightSearchTerm(element, term) {
    if (term === '') {
        // Remove existing highlights
        element.querySelectorAll('.search-highlight').forEach(span => {
            span.outerHTML = span.textContent;
        });
        return;
    }
    
    // Add highlight (simplified version)
    // In production, use a more robust highlighting library
}

function updateSearchResults(term) {
    const mainContent = document.querySelector('.main-content');
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (term && !mainContent.querySelector('[style*="display: block"], [style=""]')) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'alert alert-warning no-results-message';
            noResultsMsg.textContent = `No results found for "${term}"`;
            mainContent.insertBefore(noResultsMsg, mainContent.firstChild);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Copy Code Button
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('pre').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                // Visual feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.backgroundColor = '#4caf50';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                this.textContent = 'Failed!';
                this.style.backgroundColor = '#f44336';
                
                setTimeout(() => {
                    this.textContent = 'Copy';
                    this.style.backgroundColor = '';
                }, 2000);
            });
        });
    });
}

// Smooth Scrolling
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 120;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Sidebar Active Link Highlighting
function initializeSidebarHighlight() {
    const sections = document.querySelectorAll('h2[id], h3[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    if (sections.length === 0 || sidebarLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Basic Code Syntax Highlighting
function initializeCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        let html = block.innerHTML;
        
        // C++ Keywords
        const cppKeywords = ['class', 'struct', 'void', 'int', 'float', 'bool', 'const', 'static', 
                             'virtual', 'override', 'public', 'private', 'protected', 'return', 
                             'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
                             'namespace', 'template', 'typename', 'auto', 'enum', 'using'];
        
        cppKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Unreal Engine Macros
        const ueMacros = ['UCLASS', 'UPROPERTY', 'UFUNCTION', 'USTRUCT', 'UENUM', 
                          'GENERATED_BODY', 'GENERATED_USTRUCT_BODY', 'BlueprintCallable',
                          'BlueprintReadWrite', 'EditAnywhere', 'EditDefaultsOnly', 'Category'];
        
        ueMacros.forEach(macro => {
            const regex = new RegExp(`\\b${macro}\\b`, 'g');
            html = html.replace(regex, `<span class="class-name">${macro}</span>`);
        });
        
        // Strings
        html = html.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        
        // Numbers
        html = html.replace(/\b(\d+\.?\d*f?)\b/g, '<span class="number">$1</span>');
        
        // Comments
        html = html.replace(/\/\/(.*?)(<br>|$)/g, '<span class="comment">//$1</span>$2');
        html = html.replace(/\/\*([\s\S]*?)\*\//g, '<span class="comment">/*$1*/</span>');
        
        block.innerHTML = html;
    });
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background-color: var(--bg-tertiary);
                color: var(--gold-primary);
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.9rem;
                box-shadow: var(--shadow-md);
                border: 1px solid var(--gold-primary);
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
}

// Utility: Toggle Mobile Menu
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    nav.classList.toggle('mobile-active');
}

// Utility: Filter by Category
function filterByCategory(category) {
    const items = document.querySelectorAll('.card, .accordion-item');
    
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Export functions for use in HTML
window.HOPDocs = {
    toggleMobileMenu,
    filterByCategory
};

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
    }
    
    // ESC to close accordions
    if (e.key === 'Escape') {
        document.querySelectorAll('.accordion-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Print preparation
window.addEventListener('beforeprint', function() {
    // Expand all accordions for printing
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.add('active');
    });
});

window.addEventListener('afterprint', function() {
    // Collapse accordions after printing
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
});

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    const sidebarHeading = sidebar.querySelector('h3');
    if (!sidebarHeading) return;
    
    // Add mobile menu toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.innerHTML = '📑 Menu';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    
    sidebarHeading.style.display = 'flex';
    sidebarHeading.style.justifyContent = 'space-between';
    sidebarHeading.style.alignItems = 'center';
    sidebarHeading.style.cursor = 'pointer';
    
    // Only show toggle on mobile
    if (window.innerWidth <= 768) {
        sidebarHeading.appendChild(toggleBtn);
    }
    
    // Toggle sidebar menu on mobile
    const toggleMenu = () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open');
            const isOpen = sidebar.classList.contains('mobile-open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
            toggleBtn.innerHTML = isOpen ? '✕ Close' : '📑 Menu';
        }
    };
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    sidebarHeading.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking a link
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.innerHTML = '📑 Menu';
            }
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('mobile-open');
                if (toggleBtn.parentElement) {
                    toggleBtn.remove();
                }
            } else if (!toggleBtn.parentElement) {
                sidebarHeading.appendChild(toggleBtn);
            }
        }, 250);
    });
}

// Responsive Table Wrapper
function initializeResponsiveTable() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Skip if already wrapped
        if (table.parentElement.classList.contains('table-container')) {
            return;
        }
        
        // Wrap table in responsive container if not already wrapped
        const wrapper = document.createElement('div');
        wrapper.className = 'table-container';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
    
    // Add horizontal scroll indicator for mobile
    const tableContainers = document.querySelectorAll('.table-container');
    tableContainers.forEach(container => {
        const table = container.querySelector('table');
        if (!table) return;
        
        const checkScroll = () => {
            const hasScroll = table.offsetWidth > container.offsetWidth;
            if (hasScroll && window.innerWidth <= 768) {
                container.setAttribute('data-scroll-hint', 'Scroll horizontally →');
            } else {
                container.removeAttribute('data-scroll-hint');
            }
        };
        
        checkScroll();
        window.addEventListener('resize', checkScroll);
        
        // Add scroll indicator styling
        if (container.hasAttribute('data-scroll-hint')) {
            container.style.position = 'relative';
        }
    });
}

// Mobile-friendly touch enhancements
if ('ontouchstart' in window) {
    // Add touch-active class for better touch feedback
    document.addEventListener('touchstart', function(e) {
        const target = e.target;
        if (target.matches('button, a, .accordion-header, .tab-button, .copy-button')) {
            target.classList.add('touch-active');
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const target = e.target;
        if (target.matches('button, a, .accordion-header, .tab-button, .copy-button')) {
            setTimeout(() => target.classList.remove('touch-active'), 150);
        }
    }, { passive: true });
}

// Viewport height fix for mobile browsers
function setVhProperty() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhProperty();
window.addEventListener('resize', setVhProperty);

console.log('🎯 HOP Framework Documentation loaded successfully!');
