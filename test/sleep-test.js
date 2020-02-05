const chai = require('chai');
const expect = chai.expect;

const Sleep = require('../src/Sleep');


describe('Sleep', function() {

  let sleepData,sleep;

  beforeEach(() => {
    sleepData = [
      {
        "userID": 1,
        "date": "2019/06/14",
        "hoursSlept": 3,
        "sleepQuality": 2.6
      },
      {
        "userID": 1,
        "date": "2019/06/15",
        "hoursSlept": 3,
        "sleepQuality": 4.7
      },
      {
        "userID": 1,
        "date": "2019/06/16",
        "hoursSlept": 3,
        "sleepQuality": 4.7
      },
      {
        "userID": 4,
        "date": "2019/06/15",
        "hoursSlept": 5.4,
        "sleepQuality": 3
      }
    ];
    sleep = new Sleep(sleepData);
  });

  it('should be a function', function() {
    expect(Sleep).to.be.a('function');
  });

  it('should be an instance of sleep', function() {
    expect(sleep).to.be.an.instanceof(Sleep);
  });

  it('should calculate average num of hours slepts per day',function(){
    expect(sleep.calcAvgSleepHrTotalDays(1)).to.equal(3);
  });

  it('should calculate the average sleep quality per day',function(){
    expect(sleep.calcAvgSleepQualityTotalDays(1)).to.equal(4);
  })


});
