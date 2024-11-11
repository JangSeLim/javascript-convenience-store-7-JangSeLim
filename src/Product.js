export class Product {
    #name;
    #price;
    #quantity;
    #promotion;

    constructor(name, price, quantity, promotion) {
        this.#name = name;
        this.#price = price;
        this.#quantity = quantity;
        this.#promotion = promotion;
    }

    // getter와 setter
    getName() {
        return this.#name;
    }

    getPrice() {
        return this.#price;
    }

    getQuantity() {
        return this.#quantity;
    }

    getPromotion() {
        return this.#promotion;
    }
    
    setQuantity(quantity) {
        this.#quantity = quantity;
    }
}

export default Product;
