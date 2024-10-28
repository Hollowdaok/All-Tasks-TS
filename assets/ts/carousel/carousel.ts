import { 
    CarouselOptions, 
    CarouselElement, 
    CarouselSlide,
    CarouselAnimationState,
    CarouselEvents
} from './types';

export class Carousel {
    private element: CarouselElement;
    private inner: HTMLElement;
    private slides: CarouselSlide[];
    private currentIndex: number;
    private autoplayInterval: number | null;
    private options: CarouselOptions;
    private animationState: CarouselAnimationState;

    constructor(element: CarouselElement) {
        this.element = element;
        this.inner = element.querySelector('.nk-carousel-inner') as HTMLElement;
        this.slides = Array.from(this.inner.children) as CarouselSlide[];
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.options = this.parseOptions();
        this.animationState = 'idle';

        this.setupCarousel();
        this.createNavigationDots();
        this.showSlide(0);

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    private parseOptions(): CarouselOptions {
        return {
            autoplay: parseInt(this.element.dataset.autoplay || '0') || false,
            dots: this.element.dataset.dots === 'true',
            slidesToShow: this.element.classList.contains('nk-carousel-x4') ? 4 : 
                         this.element.classList.contains('nk-carousel-x2') ? 2 : 1
        };
    }

    private setupCarousel(): void {
        this.slides.forEach((slide, index) => {
            slide.dataset.index = index.toString();
            slide.style.flex = `0 0 ${100 / this.options.slidesToShow}%`;
        });
    }

    private createNavigationDots(): void {
        if (!this.options.dots) return;

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.showSlide(index));
            dotsContainer.appendChild(dot);
        });
        this.element.appendChild(dotsContainer);
    }

    private showSlide(index: number): void {
        const previousIndex = this.currentIndex;
        this.currentIndex = index;
        this.animationState = 'sliding';
        
        const offset = -index * (100 / this.options.slidesToShow);
        this.inner.style.transform = `translateX(${offset}%)`;

        if (this.options.dots) {
            const dots = this.element.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        // Create and dispatch the custom event
        const slideChangeEvent = new CustomEvent('slideChange', {
            bubbles: true,
            detail: {
                previousIndex,
                currentIndex: index
            }
        });
        this.element.dispatchEvent(slideChangeEvent);

        setTimeout(() => {
            this.animationState = 'idle';
        }, 500); // Match transition duration from CSS
    }

    private nextSlide(): void {
        if (this.animationState === 'sliding') return;
        let nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    private startAutoplay(): void {
        this.autoplayInterval = window.setInterval(() => {
            this.nextSlide();
        }, this.options.autoplay as number);
        
        // Create and dispatch the autoplay start event
        const autoplayStartEvent = new CustomEvent('autoplayStart', {
            bubbles: true
        });
        this.element.dispatchEvent(autoplayStartEvent);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
            
            // Create and dispatch the autoplay stop event
            const autoplayStopEvent = new CustomEvent('autoplayStop', {
                bubbles: true
            });
            this.element.dispatchEvent(autoplayStopEvent);
        }
    }
}