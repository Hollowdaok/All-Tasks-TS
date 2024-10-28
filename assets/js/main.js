import { Carousel } from './carousel/carousel.js';
import { fetchAndReplaceImages } from './imageloader/imageloader.js';
import { initializeStyles } from './styles/styles.js';
function initializeCarousels() {
    try {
        const carousels = document.querySelectorAll('.nk-carousel, .nk-carousel-x2');
        if (carousels.length === 0) {
            throw {
                type: 'INITIALIZATION_ERROR',
                message: 'No carousel elements found on the page'
            };
        }
        carousels.forEach(carousel => {
            try {
                new Carousel(carousel);
            }
            catch (error) {
                const carouselError = {
                    type: 'INITIALIZATION_ERROR',
                    message: `Failed to initialize carousel: ${error instanceof Error ? error.message : 'Unknown error'}`
                };
                console.error(carouselError);
            }
        });
    }
    catch (error) {
        if (error.type) {
            console.error(error);
        }
        else {
            const carouselError = {
                type: 'INITIALIZATION_ERROR',
                message: 'Failed to initialize carousels'
            };
            console.error(carouselError);
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    try {
        initializeStyles();
        initializeCarousels();
        fetchAndReplaceImages();
    }
    catch (error) {
        const carouselError = {
            type: 'INITIALIZATION_ERROR',
            message: 'Failed to initialize application'
        };
        console.error(carouselError);
    }
});
export { initializeCarousels, fetchAndReplaceImages };
