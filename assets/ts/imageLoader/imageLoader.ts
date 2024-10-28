import { Photo, CarouselError } from './types';

export async function fetchAndReplaceImages(): Promise<void> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        
        if (!response.ok) {
            throw {
                type: 'IMAGE_LOAD_ERROR' as const,
                message: `Failed to fetch images: ${response.statusText}`
            } satisfies CarouselError;
        }

        const photos: Photo[] = await response.json();

        const imageElements: NodeListOf<HTMLImageElement> = document.querySelectorAll('img');
        imageElements.forEach((img: HTMLImageElement, index: number) => {
            const photo = photos[index % photos.length];
            img.src = photo.url;
            img.alt = photo.title;
            
            // Add error handling for individual images
            img.onerror = () => {
                console.error({
                    type: 'IMAGE_LOAD_ERROR' as const,
                    message: `Failed to load image: ${photo.url}`
                } satisfies CarouselError);
                
                // Optionally set a fallback image
                img.src = photo.thumbnailUrl;
            };
        });
    } catch (error) {
        const carouselError: CarouselError = {
            type: 'IMAGE_LOAD_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
        console.error("Error fetching or replacing images:", carouselError);
    }
}