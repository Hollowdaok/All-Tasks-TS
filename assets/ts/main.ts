import { Carousel } from './carousel/carousel';
import { fetchAndReplaceImages } from './imageLoader/imageloader';
import { initializeStyles } from './styles/styles';
import { CarouselElement, CarouselError } from './types/types';

function initializeCarousels(): void {
    try {
        const carousels = document.querySelectorAll<CarouselElement>('.nk-carousel, .nk-carousel-x2');
        
        if (carousels.length === 0) {
            throw {
                type: 'INITIALIZATION_ERROR' as const,
                message: 'No carousel elements found on the page'
            } satisfies CarouselError;
        }

        carousels.forEach(carousel => {
            try {
                new Carousel(carousel);
            } catch (error) {
                const carouselError: CarouselError = {
                    type: 'INITIALIZATION_ERROR',
                    message: `Failed to initialize carousel: ${error instanceof Error ? error.message : 'Unknown error'}`
                };
                console.error(carouselError);
            }
        });
    } catch (error) {
        if ((error as CarouselError).type) {
            console.error(error);
        } else {
            const carouselError: CarouselError = {
                type: 'INITIALIZATION_ERROR',
                message: 'Failed to initialize carousels'
            };
            console.error(carouselError);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeStyles();
        initializeCarousels();
        fetchAndReplaceImages();
    } catch (error) {
        const carouselError: CarouselError = {
            type: 'INITIALIZATION_ERROR',
            message: 'Failed to initialize application'
        };
        console.error(carouselError);
    }
});

export { initializeCarousels, fetchAndReplaceImages };