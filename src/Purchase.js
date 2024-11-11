import { Console } from '@woowacourse/mission-utils';
import Product from './Product.js';
import Inventory from './Inventory.js';

export class Purchase {
    #inventory;
    #purchases;
    static ERROR_INVALID_FORMAT = '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.';
    static ERROR_PRODUCT_NOT_FOUND = '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.';
    static ERROR_QUANTITY_EXCEEDED = '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.';

    constructor(inventory) {
        this.#inventory = inventory;
        this.#purchases = [];
    }

    processPurchase(input) {
        this.#purchases = [];
        this.parseInput(input);
    }

    parseInput(input) {
        if (!(input.startsWith('[') && input.endsWith(']'))) {
            throw new Error(Purchase.ERROR_INVALID_FORMAT);
        }

        const items = input.split('],[');
        items[0] = items[0].replace(/^\[/, '');
        items[items.length - 1] = items[items.length - 1].replace(/\]$/, '');
        this.validateInput(items);
    }

    validateInput(items) {
        items.forEach(item => {
            const [productName, quantity] = item.split('-');
            this.validateFormat(productName, quantity);
            const parsedQuantity = parseInt(quantity.trim());
            const product = this.#inventory.getProductByName(productName.trim());
            this.validateProductExistence(product);
            this.validateQuantity(parsedQuantity, product);
            this.#purchases.push({
                name: productName.trim(),
                quantity: parsedQuantity
            });
        });
    }

    validateFormat(productName, quantity) {
        if (!productName || !quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
            throw new Error(Purchase.ERROR_INVALID_FORMAT);
        }
    }

    validateProductExistence(product) {
        if (product.length===0) {
            throw new Error(Purchase.ERROR_PRODUCT_NOT_FOUND);
        }
    }

    validateQuantity(parsedQuantity, product) {
        var totalQuantity = 0;
        product.forEach(item => {
            totalQuantity +=item.getQuantity()
        })
        if (parsedQuantity >totalQuantity) {
            throw new Error(Purchase.ERROR_QUANTITY_EXCEEDED);
        }
    }

}

export default Purchase;
