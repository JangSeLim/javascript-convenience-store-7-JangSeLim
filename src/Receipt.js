import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import PromotionList from './PromotionList.js';
import Purchase from './Purchase.js';
import Inventory from './Inventory';
import Membership from './Membership.js';

export class Receipt {
    constructor(promotionResult, inventory) {
      this.purchaseItems = [];
      this.giftItems = [];
      this.totalAmount = 0;
      this.eventDiscount = 0;
      this.membershipDiscount = 0;
      this.inventory = inventory;
    }
    
    calculateAmount(promotionResult) {
        promotionResult.forEach(item => {
            changeInventory(item.productName, item.promotionQuantity, item.regularQuantity)
            this.purchaseItems.push({productName: item.productName, quantity: item.promotionQuantity+
                item.regularQuantity, price: item.price});
            if (item.promotionQuantity > 0) {
                this.giftItems.push({productName: item.productName, promotionQuantity: item.promotionQuantity});
                this.eventDiscount -= Math.floor(item.promotionQuantity / (item.buy + item.free)) * item.price;
            }
            this.totalAmount += item.price * (item.promotionQuantity + item.regularQuantity);
        })
        this.membershipDiscount -= new Membership(this.totalAmount + this.eventDiscount);
    }

    getFinalAmount() {
        return this.totalAmount + this.eventDiscount + this.membershipDiscount;
    }

    // 영수증 출력 메서드
    printReceipt() {
      Console.Print("=========== W 편의점 ===========");
      
      // 구매 상품 목록 출력
      Console.Print("상품명\t\t수량\t금액");
      this.purchaseItems.forEach(item => {
        Console.Print(`${item.productName}\t${item.quantity}\t${item.quantity * item.price}`);
      });
  
      Console.Print("=========== 증정 ===========");
      this.giftItems.forEach(item => {
        Console.Print(`${item.productName}\t${item.promotionQuantity}`);
      });
  
      // 금액 정보 출력
      Console.Print("===============================");
      Console.Print(`총구매액\t\t\t${this.totalAmount}`);
      Console.Print(`행사할인\t\t\t${this.eventDiscount}`);
      Console.Print(`멤버십할인\t\t\t${this.membershipDiscount}`);
      Console.Print(`내실돈\t\t\t${this.getFinalAmount()}`);
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

    askForMoreItems() {
        const answer = this.askUserForYesNo('감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)')
        return answer; 
        }

    changeInventory(productName, promotionQuantity, regularQuantity) {
        this.inventory.updateProducts(productName, promotionQuantity, regularQuantity);
    }
}
  
export default Receipt
  