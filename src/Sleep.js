class Sleep {
  constructor(sleepData) {
    this.sleepData = sleepData;
  }

  calcAvgSleepHrTotalDays(userID) {
    let filteredSleep = this.sleepData.filter(userEntry => userEntry.userID === userID);
    let totalSleep = filteredSleep.reduce(function(runningTotal, curVal) {
      return runningTotal + curVal.hoursSlept;
    }, 0);
    return Number((totalSleep / filteredSleep.length).toFixed(2));
  }

  calcAvgSleepQualityTotalDays(userID) {
    let filteredSleepQuality = this.sleepData.filter(userEntry => userEntry.userID === userID);
    let totalQuality = filteredSleepQuality.reduce(function(runningTotal, curVal) {
      return runningTotal + curVal.sleepQuality;
    }, 0);
    return Number((totalQuality / filteredSleepQuality.length).toFixed(2));
  }

  getDailySleep(userID, date) {
    let filteredSleep = this.sleepData.filter(userEntry => userEntry.userID === userID);
    return filteredSleep.find(day => day.date === date).hoursSlept;
  }

  getDailySleepQuality(userID, date) {
    let filteredSleepQuality = this.sleepData.filter(userEntry => userEntry.userID === userID);
    return filteredSleepQuality.find(day => day.date === date).sleepQuality;
  }

  getDailySleepDays(userID, startDate) {
    let startDateParsed = new Date(startDate);
    let endDateParsed = new Date(startDate);
    endDateParsed.setDate(startDateParsed.getDate() - 7);
    let userSleepData = this.sleepData.filter(userEntry => userEntry.userID === userID);
    let userSleepDaysData = userSleepData.filter(function(sleedDayData) {
      let day = new Date(sleedDayData.date);
      if (day < startDateParsed && day >= endDateParsed) {
        return true;
      }
    });
    return userSleepDaysData.map(day => day = day.date);
  }

  getPrevDaysSleepHrs(userID, startDate) {
    let userSleepDaysData = this.getPreviousDaysData(userID, startDate);
    return userSleepDaysData.map(dailyUserSleep => dailyUserSleep.hoursSlept);
  }

  getPrevDaysSleepQuality(userID, startDate) {
    let userSleepDaysData = this.getPreviousDaysData(userID, startDate);
    return userSleepDaysData.map(dailyUserSleep => dailyUserSleep.sleepQuality);
  }

  getPreviousDaysData(userID, startDate) {
    let startDateParsed = new Date(startDate);
    let endDateParsed = new Date(startDate);
    endDateParsed.setDate(startDateParsed.getDate() - 7);
    let userSleepData = this.sleepData.filter(userEntry => userEntry.userID === userID);
    let userSleepDaysData = userSleepData.filter(function(sleedDayData) {
      let day = new Date(sleedDayData.date);
      if (day <= startDateParsed && day > endDateParsed) {
        return true;
      }
    });
    return userSleepDaysData;
  }

  calcAverageSleepQuality() {
    let totalSleepQuality = this.sleepData.reduce(function(total, curVal) {
      return total + curVal.sleepQuality;
    }, 0);
    return totalSleepQuality / this.sleepData.length;
  }

  findAllGreatSleepers(startDate) {
    let uniqueUsers = [...new Set(this.sleepData.map(item => item.userID))];
    let usersSleepPastWeek = uniqueUsers.reduce((acc, userID) => {
      let sleepData = this.getPrevDaysSleepHrs(userID, startDate);
      if (sleepData.reduce((sum, element) => {
        return sum += element;
      }, 0) / sleepData.length > 3) {
        acc.push(userID);
      }
      return acc;
    }, [])
    return usersSleepPastWeek;
  }

  findLongestSleepers(startDate) {
    let dailyUsers = this.sleepData.filter((element) => element.date = startDate);
    let longestSleeper = dailyUsers.sort((a, b) => b.hoursSlept - a.hoursSlept);
    return longestSleeper.filter((element) => longestSleeper[0].hoursSlept === element.hoursSlept)
  }

  findDepressedStreaks(userID){
      let userSleepData = this.sleepData.filter(data => data.userID === userID);
      let streaks = [];
      let streak = userSleepData.reduce((acc, day) => {
        if (acc.prevSleep > day.hoursSlept) {
          acc.curStreak.push(day)
        } else if (acc.curStreak.length >= 3) {
          streaks.push({
            endDate: day.date,
            streakRun: acc.curStreak.length
          });
          acc.curStreak = [day];
        } else {
          acc.curStreak = [day];
        }
        acc.prevSleep = day.hoursSlept;
        return acc;
      }, {
        prevSleep: 0,
        curStreak: []
      })
      return streaks;


  }
}

if (typeof module !== 'undefined') {
  module.exports = Sleep;
}
