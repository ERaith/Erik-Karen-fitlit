class Activity {
  constructor(activityData) {
    this.activityData = activityData;
  }

  calculateMilesToday(userID, date, strideLength) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    let distance = currentUser.find(stride => stride.date === date).numSteps * strideLength;
    return Number((distance / 5280).toFixed(2));
 }

  getMinutesActive(userID, date) {
    let currentUser = this.activityData.filter(data => data.userID === userID);
    return currentUser.find(minute => minute.date === date).minutesActive;
  }

  getPrevDaysActive(userID, startDate) {
    let startDateParsed = new Date(startDate);
    let endDateParsed = new Date(startDate);
    endDateParsed.setDate(startDateParsed.getDate() - 7);
    let userActiveData = this.activityData.filter(userEntry => userEntry.userID === userID);
    let userActiveDaysData = userActiveData.filter((activeDayData) => {
      let day = new Date(activeDayData.date);
      if (day <= startDateParsed && day >= endDateParsed) {
        return true;
      }
    });
    return userActiveDaysData.map(data => data.minutesActive);
  }

  calculateActiveAverage(userID, startDate) {
    let prevMinutesActive = this.getPrevDaysActive(userID, startDate);
    let totalActiveMinutes = prevMinutesActive.reduce((total, curVal) => {
      total += curVal;
      return total
    }, 0);
    return Number((totalActiveMinutes / prevMinutesActive.length).toFixed(2));
  }

  checkReachedStepGoal(userData, date) {
    let currentUser = this.activityData.filter(data => data.userID === userData.id);
    let steps = currentUser.find(step => step.date === date)
      if(userData.dailyStepGoal > steps.numSteps) {
        return false
      } else {
        return true
      }
  }

  getExceededStepGoal(userData) {
    let currentUser = this.activityData.filter(data => data.userID === userData.id);
    let daysThatExceededStepGoal = currentUser.reduce((acc, activity) => {
      if (userData.dailyStepGoal <= activity.numSteps) {
        acc.push(activity.date);
      }
      return acc;
    }, [])
    return daysThatExceededStepGoal;
  }


}

if (typeof module !== 'undefined') {
  module.exports = Activity;
}
