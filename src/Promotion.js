import { DateTimes } from '@woowacourse/mission-utils';

export class Promotion {
    #promo;
    #buy;
    #free;
    #startDate;
    #endDate;

    constructor(promo, buy, free, startDate, endDate) {
        this.#promo = promo;
        this.#buy = buy;
        this.#free = free;
        this.#startDate = startDate;
        this.#endDate = endDate;
    }

    getPromo() {
        return this.#promo;
    }

    getBuy() {
        return this.#buy;
    }

    getFree() {
        return this.#free;
    }

    getStartDate() {
        return this.#startDate;
    }

    getEndDate() {
        return this.#endDate;
    }

    checkPromotionPeriod() {
        const today = DateTimes.now()
        if (today >= this.#startDate && today <= this.#endDate) {
            return true;
        }
        return false;
    }
}

export default Promotion;
