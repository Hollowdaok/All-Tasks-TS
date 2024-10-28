interface CarouselOptions {
    autoplay: number | false;
    dots: boolean;
    slidesToShow: number;
}

class Carousel {
    private element: HTMLElement;
    private inner: HTMLElement;
    private slides: HTMLElement[];
    private currentIndex: number;
    private autoplayInterval: number | null;
    private options: CarouselOptions;

    constructor(element: HTMLElement) {
        this.element = element;
        this.inner = element.querySelector('.nk-carousel-inner') as HTMLElement;
        this.slides = Array.prototype.slice.call(this.inner.children) as HTMLElement[];
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.options = this.parseOptions();

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
        this.currentIndex = index;
        const offset = -index * (100 / this.options.slidesToShow);
        this.inner.style.transform = `translateX(${offset}%)`;

        if (this.options.dots) {
            const dots = this.element.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    private nextSlide(): void {
        let nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    private startAutoplay(): void {
        this.autoplayInterval = window.setInterval(() => {
            this.nextSlide();
        }, this.options.autoplay as number);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

function initializeCarousels(): void {
    const carousels = document.querySelectorAll('.nk-carousel, .nk-carousel-2');
    carousels.forEach(carousel => {
        new Carousel(carousel as HTMLElement);
    });
}

async function fetchAndReplaceImages(): Promise<void> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        

        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }

        const photos: { url: string; thumbnailUrl: string; title: string }[] = await response.json();

        const imageElements: NodeListOf<HTMLImageElement> = document.querySelectorAll('img');
        imageElements.forEach((img: HTMLImageElement, index: number) => {
            const photo = photos[index % photos.length]; 
            img.src = photo.url; 
            img.alt = photo.title; 
        });
    } catch (error) {
        console.error("Error fetching or replacing images:", error);
    }
}

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        initializeCarousels();
        fetchAndReplaceImages();
    });

    const style = document.createElement('style');
    style.textContent = `
        .nk-carousel-inner {
            display: flex;
            transition: transform 0.5s ease;
        }
        .carousel-dots {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ccc;
            margin: 0 5px;
            cursor: pointer;
        }
        .carousel-dot.active {
            background-color: #333;
        }
    `;
    document.head.appendChild(style);
})();
