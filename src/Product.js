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

    toString() {
        const formattedPrice = this.#price.toLocaleString();
        
        if (this.#quantity === 0) {
            return `- ${this.#name} ${formattedPrice}원 재고 없음`;
        } else if (this.#promotion) {
            return `- ${this.#name} ${formattedPrice}원 ${this.#quantity}개 ${this.#promotion}`;
        } else {
            return `- ${this.#name} ${formattedPrice}원 ${this.#quantity}개`;
        }
    }
}

export default Product;
