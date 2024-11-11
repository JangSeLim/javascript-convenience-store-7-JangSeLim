import Product from './Product.js';
import fs from 'fs';
import { Console } from '@woowacourse/mission-utils';

export class Inventory {
    #products = [];

    constructor() {
        // 초기화 시에 products 배열을 빈 배열로 설정
    }

    loadAndDisplay(filePath) {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.trim().split('\n');

        lines.slice(1).forEach(line => {
            const [name, price, quantity, promotion] = line.split(',');
            let promo = null;

            if (promotion !== 'null') {
                promo = promotion;
            }

            const product = new Product(name, parseInt(price), parseInt(quantity), promo);
            this.#products.push(product);
        });

        this.displayProducts();
    }

    displayProducts() {
        Console.print("안녕하세요. W편의점입니다.");
        Console.print("현재 보유하고 있는 상품입니다.\n");

        this.#products.forEach(product => {
            Console.print(product.toString());
        });
        Console.print('')
    }

    getProductByName(name) {
        return this.#products.filter(product => product.getName() === name);
    }
}

export default Inventory;
