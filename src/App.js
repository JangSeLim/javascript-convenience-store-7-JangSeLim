import Purchase from './Purchase.js';
import Inventory from './Inventory.js';
import PromotionList from './PromotionList.js';
import Receipt from './Receipt.js';


class App {
  async run() {
    const inventory = new Inventory();
    await inventory.loadAndDisplay('../public/products.md');

    while (true) {
      const purchase = new Purchase(inventory);
      await purchase.startPurchaseProcess();

      const promotionList = new PromotionList(purchase.getPurchases(), inventory);
      await promotionList.loadFile('../public/promotions.md');

      const Receipt = new Receipt(await promotionList.checkPromotionForItems(), inventory);
      Receipt.printReceipt();
      const answer = Receipt.askForMoreItems();

      if (answer.toUpperCase() === 'N') {
        break;
      }
    }
  }
}

export default App;

