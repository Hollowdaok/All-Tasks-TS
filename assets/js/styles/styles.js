export const carouselStyles = `
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
export function initializeStyles() {
    try {
        const style = document.createElement('style');
        style.textContent = carouselStyles;
        document.head.appendChild(style);
    }
    catch (error) {
        const carouselError = {
            type: 'INITIALIZATION_ERROR',
            message: 'Failed to initialize carousel styles'
        };
        console.error(carouselError);
    }
}
