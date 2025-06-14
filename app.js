class PitchDeck {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        // Update total slides display
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch navigation
        this.addTouchNavigation();
        
        // Initialize navigation state
        this.updateNavigation();
        
        // Auto-advance timer (optional - commented out for user control)
        // this.startAutoAdvance();
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        // Remove active class from current slide
        this.slides[this.currentSlide - 1].classList.remove('active');
        
        // Update current slide
        this.currentSlide = slideNumber;
        
        // Add active class to new slide
        this.slides[this.currentSlide - 1].classList.add('active');
        
        // Update navigation
        this.updateNavigation();
        
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide;
        
        // Trigger slide change event for analytics or other purposes
        this.onSlideChange(this.currentSlide);
    }
    
    updateNavigation() {
        // Update previous button
        if (this.currentSlide === 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.style.opacity = '0.3';
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.style.opacity = '1';
        }
        
        // Update next button
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.disabled = true;
            this.nextBtn.style.opacity = '0.3';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.style.opacity = '1';
        }
    }
    
    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
        }
    }
    
    addTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.previousSlide();
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                }
            }
        });
    }
    
    onSlideChange(slideNumber) {
        // Add any slide-specific animations or actions here
        
        // Example: Log slide change for analytics
        console.log(`Slide changed to: ${slideNumber}`);
        
        // Example: Add specific animations based on slide content
        const currentSlideElement = this.slides[slideNumber - 1];
        
        // Add entrance animations for specific elements
        this.animateSlideElements(currentSlideElement);
        
        // Handle urgency messaging timing
        this.handleUrgencyMessages(slideNumber);
    }
    
    animateSlideElements(slideElement) {
        // Find elements to animate
        const stats = slideElement.querySelectorAll('.stat, .metric-card, .metric');
        const cards = slideElement.querySelectorAll('.capability, .service, .feature, .advantage');
        const pillars = slideElement.querySelectorAll('.pillar');
        
        // Animate stats with stagger
        stats.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                stat.style.transition = 'all 0.5s ease';
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Animate cards with stagger
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 150);
        });
        
        // Animate pillars with scale
        pillars.forEach((pillar, index) => {
            pillar.style.opacity = '0';
            pillar.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                pillar.style.transition = 'all 0.7s ease';
                pillar.style.opacity = '1';
                pillar.style.transform = 'scale(1)';
            }, index * 200);
        });
    }
    
    handleUrgencyMessages(slideNumber) {
        // Add urgency emphasis on specific slides
        const urgencySlides = [1, 2, 4, 18, 20]; // Title, Problem, Solution, Timing, CTA
        
        if (urgencySlides.includes(slideNumber)) {
            const urgencyElements = document.querySelectorAll('.urgency-banner, .urgency-text, .countdown');
            
            urgencyElements.forEach(element => {
                element.style.animation = 'pulse 2s ease-in-out';
            });
        }
    }
    
    // Auto-advance functionality (optional)
    startAutoAdvance(intervalMs = 30000) { // 30 seconds per slide
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                // Stop auto-advance at the end
                this.stopAutoAdvance();
            }
        }, intervalMs);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    // Presentation mode toggle
    togglePresentationMode() {
        document.body.classList.toggle('presentation-mode');
        
        if (document.body.classList.contains('presentation-mode')) {
            // Hide navigation in presentation mode
            document.querySelector('.navigation').style.display = 'none';
            document.querySelector('.logo').style.display = 'none';
        } else {
            // Show navigation in normal mode
            document.querySelector('.navigation').style.display = 'flex';
            document.querySelector('.logo').style.display = 'block';
        }
    }
    
    // Get slide analytics
    getSlideAnalytics() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            completionPercentage: Math.round((this.currentSlide / this.totalSlides) * 100)
        };
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
    }
    
    .presentation-mode {
        cursor: none;
    }
    
    .presentation-mode .slide {
        width: 100%;
        height: 100vh;
        border-radius: 0;
        padding: 80px;
    }
`;
document.head.appendChild(style);

// Initialize the pitch deck when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const pitchDeck = new PitchDeck();
    
    // Make pitchDeck globally accessible for debugging
    window.pitchDeck = pitchDeck;
    
    // Add keyboard shortcuts info
    console.log('Pitch Deck Controls:');
    console.log('→ / Space: Next slide');
    console.log('←: Previous slide');
    console.log('Home: First slide');
    console.log('End: Last slide');
    console.log('Swipe left/right on touch devices');
    
    // Add presentation mode toggle (P key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            pitchDeck.togglePresentationMode();
        }
        
        // ESC to exit presentation mode
        if (e.key === 'Escape') {
            document.body.classList.remove('presentation-mode');
            document.querySelector('.navigation').style.display = 'flex';
            document.querySelector('.logo').style.display = 'block';
        }
    });
    
    // Prevent context menu on right-click for cleaner presentation
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Re-calculate any dynamic layouts if needed
        console.log('Window resized, recalculating layouts...');
    });
    
    // Add focus management for accessibility
    document.addEventListener('focusin', (e) => {
        // Ensure focused elements are visible
        if (e.target.closest('.slide') && !e.target.closest('.slide').classList.contains('active')) {
            const slideIndex = Array.from(pitchDeck.slides).indexOf(e.target.closest('.slide'));
            if (slideIndex !== -1) {
                pitchDeck.goToSlide(slideIndex + 1);
            }
        }
    });
    
    // Performance monitoring
    let slideChangeStart = performance.now();
    
    // Override the original onSlideChange to add performance monitoring
    const originalOnSlideChange = pitchDeck.onSlideChange;
    pitchDeck.onSlideChange = function(slideNumber) {
        const slideChangeEnd = performance.now();
        const changeTime = slideChangeEnd - slideChangeStart;
        
        console.log(`Slide ${slideNumber} loaded in ${changeTime.toFixed(2)}ms`);
        
        // Call original function
        originalOnSlideChange.call(this, slideNumber);
        
        slideChangeStart = performance.now();
    };
    
    // Add slide progress to page title
    const originalGoToSlide = pitchDeck.goToSlide;
    pitchDeck.goToSlide = function(slideNumber) {
        originalGoToSlide.call(this, slideNumber);
        
        // Update page title with progress
        const progress = Math.round((slideNumber / this.totalSlides) * 100);
        document.title = `VersionTwo - Slide ${slideNumber}/${this.totalSlides} (${progress}%)`;
    };
    
    // Initialize title
    document.title = `VersionTwo - Slide 1/${pitchDeck.totalSlides} (5%)`;
});