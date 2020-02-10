class Hydration {
  constructor(hydrationData) {
    this.hydrationData = hydrationData;
  }

  calculateAverageFluidsConsumed(userID) {
   let currentUser = this.hydrationData.filter(data => data.userID === userID);
   let sum =  currentUser.reduce((acc, fluids) => {
      return acc += fluids.numOunces;
    }, 0)
    return sum / currentUser.length;
  }

  getFluidConsumedDay(userID, date) {
    let currentUser = this.hydrationData.filter(data => data.userID === userID);
    return currentUser.find(fluids => fluids.date === date).numOunces;
  }

  getPrevDaysHydration(userID, startDate) {
    let startDateParsed = new Date(startDate);
    let endDateParsed = new Date(startDate);
    endDateParsed.setDate(startDateParsed.getDate() - 7);
    let userHydrationData = this.hydrationData.filter(userEntry => userEntry.userID === userID);
    let userHydrationDaysData = userHydrationData.filter((hydrationDayData) => {
      let day = new Date(hydrationDayData.date);
      if (day <= startDateParsed && day >= endDateParsed) {
        return true;
      }
    });
    return userHydrationDaysData.map(data => data.numOunces);
   }
   getPreviousDates(userID,startDate){
     let startDateParsed = new Date(startDate);
     let endDateParsed = new Date(startDate);
     endDateParsed.setDate(startDateParsed.getDate() - 7);
     let userHydrationData = this.hydrationData.filter(userEntry => userEntry.userID === userID);
     let userPastDates = userHydrationData.filter(function(activeDay) {
       let day = new Date(activeDay.date);
       if (day < startDateParsed && day >= endDateParsed) {
         return true;
       }
     });
     return userPastDates.map(day => day = day.date);
   }
}

if (typeof module !== 'undefined') {
  module.exports = Hydration;
}
