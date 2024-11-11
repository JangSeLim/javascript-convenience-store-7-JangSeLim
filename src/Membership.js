class MembershipDiscount {
  
  constructor(amount) {
    this.discountRate = 0.3;
    this.maxDiscount = 8000;
    this.membershipDiscountTotal = 0;
    this.isDiscountApplied = false;
    this.askForMembershipDiscount(amount);
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

  askForMembershipDiscount(amount) {
    const answer = askUserForYesNo("멤버십 할인을 받으시겠습니까? (Y/N)");
    this.isDiscountApplied = answer.toUpperCase() === "Y";
    this.applyMembershipDiscount(amount);
  }
  
  applyMembershipDiscount(amount) {
    if (!this.isDiscountApplied) {
      return 0;
    }
    
    const discount = Math.min(
      amount * this.discountRate,
      this.maxDiscount - this.membershipDiscountTotal
    );

    this.membershipDiscountTotal += discount;
    return discount;
  }
}
  