import fs from 'fs';
import { Console } from '@woowacourse/mission-utils';
import Promotion from './Promotion.js';
import Inventory from './Inventory.js';
import Purchase from './Purchase.js';

export class PromotionList {
    #promotionList = [];
    #purchases = [];
    #inventory = null;
    promotionResult = [];

    constructor(purchases, inventory) {
        this.#purchases = purchases;
        this.#inventory = inventory;
    }

    async loadFile(filePath) {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.trim().split('\n');

        for (let line of lines.slice(1)) {
            const [promo, buy, free, startDate, endDate] = line.split(',');
            const promotion = new Promotion(promo, parseInt(buy), parseInt(free), new Date(startDate), new Date(endDate));

            if (promotion.checkPromotionPeriod()) {
                this.#promotionList.push(promotion);
            }
        }
    }

    async checkPromotionForItems() {
      for (let purchase of this.#purchases) {
        const productName = purchase.name;
        const productQuantity = purchase.quantity;
        const products = this.#inventory.getProductByName(productName);
        let promotionStock = null;
        let regularStock = null;
        let promotion = null;
        const price = products[0].getPrice();

        products.forEach(product => {
          if (product.getPromo() && (promotion = this.#promotionList.find(promo => promo.getPromo() === product.getPromo()))) {
            promotionStock = product;
          }
          if (!product.getPromo()) {
            regularStock = product;
          }
        });
        
        this.promotionResult.push(
          await this.applyPromotion(promotionStock, regularStock, promotion, productQuantity, productName, price)
        );
      }
    }

    async applyPromotion(promotionStock, regularStock, promotion, quantity, productName, price) {
      if (!promotionStock) {
        return this.notPromotion(productName, quantity, price);
      }
      if (promotionStock.getQuantity() >= quantity && quantity % (promotion.getBuy() + promotion.getFree()) === promotion.getBuy()) {
        return await this.handleExtraBonusPromotion(productName, promotion.getBuy(), promotion.getFree(), quantity, promotionStock, price);
      }
      if (promotionStock.getQuantity() < quantity) {
          return await this.handleLimitedPromotionStock(productName, promotion.getBuy(), promotion.getFree(), quantity, promotionStock, regularStock, price);
      }
      return this.handleStandardPromotion(productName, promotion.getBuy(), promotion.getFree(), quantity, price);
    }

    async handleExtraBonusPromotion(productName, buy, free, quantity, promotionStock, price) {
      const userAnswer = await this.askUserForExtraBonus(productName, free);
      if (userAnswer === 'Y') {
          return this.applyPromotionWithBonus(productName, quantity, buy, free, price);
      }
      return this.applyPromotionWithBonus(productName, quantity, buy, 0, price);
    }

    async askUserForExtraBonus(productName, free) {
      return await this.askUserForYesNo(
          `현재 ${productName}은(는) ${free}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
      );
    }

    async askUserForYesNo(message) {
      while (true) {
        try {
          let answer = await Console.readLine(message);
          if (answer.toUpperCase() !== 'Y' && answer.toUpperCase() !== 'N') {
            throw new Error('[ERROR] 잘못된 입력입니다. Y 또는 N을 입력해 주세요.');
          } 
          return answer;
        } catch (error) {
          Console.Print(error.message);
        }
      }
    }

    applyPromotionWithBonus(productName, promoQty, buy, free, price) {
        return {
            productName,
            price,
            buy,
            free,
            promotionQuantity: promoQty + free,
            regularQuantity: 0
        };
    }

    async handleLimitedPromotionStock(productName, buy, free, quantity, promotionStock, regularStock, price) {
      const promotionQty = Math.floor(promotionStock.getQuantity() / (buy + free)) * (buy + free);
      const remainingQty = quantity - promotionQty;
      const userAnswer = await this.askUserForNonPromoItems(productName, remainingQty);

      if (userAnswer === 'Y') {
          return this.applyLimitedPromoWithRemainingQty(productName, promotionQty, remainingQty, regularStock.getQuantity(), buy, free, price);
      }
      return this.applyLimitedPromoWithRemainingQty(productName, promotionQty, 0, regularStock.getQuantity(), buy, free, price);
    }

    async askUserForNonPromoItems(productName, remainingQty) {
      return await this.askUserForYesNo(
          `현재 ${productName} ${remainingQty}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
      );
    }

    applyLimitedPromoWithRemainingQty(productName, promoQty, regularQty, regularStock, buy, free, price) {
      return {
          productName,
          price,
          buy,
          free,
          promotionQuantity: promoQty,
          regularQuantity: regularQty + regularStock
      };
    }

    handleStandardPromotion(productName, buy, free, quantity, price) {
        return {
          productName,
          price,
          buy,
          free,
          promotionQuantity: quantity,
          regularQuantity: 0
        };
    }

    notPromotion(productName, regularQuantity, price) {
      return {
        productName,
        price,
        buy: 0,
        free: 0,
        promotionQuantity: 0,
        regularQuantity: regularQuantity
      };
    }
}

export default PromotionList;
