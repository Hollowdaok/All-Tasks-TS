var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Carousel = /** @class */ (function () {
    function Carousel(element) {
        this.element = element;
        this.inner = element.querySelector('.nk-carousel-inner');
        this.slides = Array.prototype.slice.call(this.inner.children);
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
    Carousel.prototype.parseOptions = function () {
        return {
            autoplay: parseInt(this.element.dataset.autoplay || '0') || false,
            dots: this.element.dataset.dots === 'true',
            slidesToShow: this.element.classList.contains('nk-carousel-x4') ? 4 :
                this.element.classList.contains('nk-carousel-x2') ? 2 : 1
        };
    };
    Carousel.prototype.setupCarousel = function () {
        var _this = this;
        this.slides.forEach(function (slide, index) {
            slide.dataset.index = index.toString();
            slide.style.flex = "0 0 ".concat(100 / _this.options.slidesToShow, "%");
        });
    };
    Carousel.prototype.createNavigationDots = function () {
        var _this = this;
        if (!this.options.dots)
            return;
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        this.slides.forEach(function (_, index) {
            var dot = document.createElement('span');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', function () { return _this.showSlide(index); });
            dotsContainer.appendChild(dot);
        });
        this.element.appendChild(dotsContainer);
    };
    Carousel.prototype.showSlide = function (index) {
        this.currentIndex = index;
        var offset = -index * (100 / this.options.slidesToShow);
        this.inner.style.transform = "translateX(".concat(offset, "%)");
        if (this.options.dots) {
            var dots = this.element.querySelectorAll('.carousel-dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }
    };
    Carousel.prototype.nextSlide = function () {
        var nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    };
    Carousel.prototype.startAutoplay = function () {
        var _this = this;
        this.autoplayInterval = window.setInterval(function () {
            _this.nextSlide();
        }, this.options.autoplay);
    };
    Carousel.prototype.stopAutoplay = function () {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    };
    return Carousel;
}());
function initializeCarousels() {
    var carousels = document.querySelectorAll('.nk-carousel, .nk-carousel-2');
    carousels.forEach(function (carousel) {
        new Carousel(carousel);
    });
}
function fetchAndReplaceImages() {
    return __awaiter(this, void 0, void 0, function () {
        var response, photos_1, imageElements, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4, fetch('https://jsonplaceholder.typicode.com/photos')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to fetch images');
                    }
                    return [4, response.json()];
                case 2:
                    photos_1 = _a.sent();
                    imageElements = document.querySelectorAll('img');
                    imageElements.forEach(function (img, index) {
                        var photo = photos_1[index % photos_1.length];
                        img.src = photo.url;
                        img.alt = photo.title;
                    });
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching or replacing images:", error_1);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        initializeCarousels();
        fetchAndReplaceImages();
    });
    var style = document.createElement('style');
    style.textContent = "\n        .nk-carousel-inner {\n            display: flex;\n            transition: transform 0.5s ease;\n        }\n        .carousel-dots {\n            display: flex;\n            justify-content: center;\n            margin-top: 10px;\n        }\n        .carousel-dot {\n            width: 10px;\n            height: 10px;\n            border-radius: 50%;\n            background-color: #ccc;\n            margin: 0 5px;\n            cursor: pointer;\n        }\n        .carousel-dot.active {\n            background-color: #333;\n        }\n    ";
    document.head.appendChild(style);
})();
