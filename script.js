// Image slider functionality
class ImageSlider {
    constructor(options = {}) {
        this.sliderElement = document.querySelector(options.sliderSelector || '.slider');
        this.slides = this.sliderElement.querySelectorAll('img');
        this.navButtons = document.querySelectorAll('.slider-nav a');
        this.currentIndex = 0;
        this.interval = null;
        this.autoPlayDelay = options.autoPlayDelay || 3000;
        this.isAutoPlaying = options.autoPlay !== false;
        
        this.init();
    }
    
    init() {
        // Set up navigation buttons
        this.navButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
            });
        });
        
        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.sliderElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        this.sliderElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
        
        // Start autoplay if enabled
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
        
        // Pause autoplay on hover
        this.sliderElement.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.sliderElement.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }
    
    handleSwipe(startX, endX) {
        const difference = startX - endX;
        const threshold = 50; // minimum distance for swipe
        
        if (Math.abs(difference) > threshold) {
            if (difference > 0) {
                // Swipe left
                this.next();
            } else {
                // Swipe right
                this.previous();
            }
        }
    }
    
    goToSlide(index) {
        // Update current index
        this.currentIndex = index;
        
        // Calculate scroll position
        const scrollPosition = this.slides[index].offsetLeft;
        this.sliderElement.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Update navigation buttons
        this.updateNavigation();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(this.currentIndex);
    }
    
    previous() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(this.currentIndex);
    }
    
    updateNavigation() {
        this.navButtons.forEach((button, index) => {
            if (index === this.currentIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        if (!this.interval) {
            this.interval = setInterval(() => this.next(), this.autoPlayDelay);
        }
    }
    
    pauseAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }
}

// Initialize the slider
document.addEventListener('DOMContentLoaded', () => {
    const slider = new ImageSlider({
        autoPlay: true,
        autoPlayDelay: 3000
    });
});