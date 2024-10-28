export interface CarouselOptions {
    autoplay: number | false;
    dots: boolean;
    slidesToShow: number;
}

export interface CarouselSlide extends HTMLElement {
    dataset: {
        index: string;
        [key: string]: string;
    };
}

export interface Photo {
    url: string;
    thumbnailUrl: string;
    title: string;
    id?: number;
    albumId?: number;
}

export interface CarouselElement extends HTMLElement {
    dataset: {
        autoplay?: string;
        dots?: string;
        [key: string]: string | undefined;
    };
    classList: DOMTokenList;
}

export interface CarouselStyles {
    readonly carouselStyles: string;
}

export interface CarouselEvents {
    slideChange: CustomEvent<{
        previousIndex: number;
        currentIndex: number;
    }>;
    autoplayStart: CustomEvent<void>;
    autoplayStop: CustomEvent<void>;
}

export type CarouselError = 
    | { type: 'INITIALIZATION_ERROR'; message: string }
    | { type: 'NAVIGATION_ERROR'; message: string }
    | { type: 'IMAGE_LOAD_ERROR'; message: string };

export type CarouselAnimationState = 'idle' | 'sliding' | 'transitioning';
