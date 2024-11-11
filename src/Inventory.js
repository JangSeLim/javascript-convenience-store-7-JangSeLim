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
    }
}

export default Inventory;
