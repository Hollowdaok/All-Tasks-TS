type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description?: string;
};

type Electronics = BaseProduct & {
    category: 'electronics';
    warranty: number;
};

type Clothing = BaseProduct & {
    category: 'clothing';
    size: string;
};

const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(product => product.id === id);
};

const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(product => product.price <= maxPrice);
};

type CartItem<T> = {
    product: T;
    quantity: number;
};

const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }

    return cart;
};

const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const electronics: Electronics[] = [
    {
        id: 1,
        name: "Телефон",
        price: 10000,
        category: 'electronics',
        warranty: 24
    },
    {
        id: 2,
        name: "Ноутбук",
        price: 20000,
        category: 'electronics',
        warranty: 36
    }
];

const clothing: Clothing[] = [
    {
        id: 3,
        name: "Футболка",
        price: 500,
        category: 'clothing',
        size: "M"
    }
];

const phone = findProduct(electronics, 1);
console.log("Знайдений товар:", phone);

const filteredElectronics = filterByPrice(electronics, 15000);
console.log("Товари до 15000:", filteredElectronics);

let cart: CartItem<BaseProduct>[] = [];
if (phone) {
    cart = addToCart(cart, phone, 1);
}
console.log("Кошик після додавання:", cart);

const total = calculateTotal(cart);
console.log("Загальна вартість:", total);