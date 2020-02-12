let linksParent = document.querySelector('.link-container');
let userScore = document.getElementById('userScore');
let numOfSteps = document.getElementById('numOfSteps');
let minutesActive = document.getElementById('minutesActive');
let milesWalked = document.getElementById('milesWalked');
let numOunces = document.getElementById('numOunces');
let hoursSlept = document.getElementById('hoursSlept');
let sleepQuality = document.getElementById('sleepQuality');
let userInfo = document.querySelectorAll('.userInfo');
let friendsContainerEl = document.querySelector('.friends-container');
let averageStepContainer = document.querySelector('.averageStepContainer');
let sleepContainer = document.querySelector('.sleep-container')
let userRepo;
let curUser;
let user;
let hydration;
let activity;
let date = "2019/06/22";


function windowLoadHandler() {
  instatiateUser();
  displayUserInfo();
  displayFriends();
  displayAverageSteps();
  displayActivity();
  displaySleep();
  displayHydration();
}

function displaySleep(){
  displayLastWeekSleep();
  displayTodaysSleep();
}

function displayHydration(){
  let hydrationData = hydration.getPrevDaysHydration(user.id, date);
  let hydrationLabels = hydration.getPreviousDates(user.id, date);
  displayLineChart(hydrationData,hydrationLabels,'OZ Drank','hydrationConsumedWeek','#355C7D');
  makeDonutChart();
}

function displayActivity() {
  numOfSteps.innerText = activity.getSteps(user.id, date);
  minutesActive.innerText = activity.getMinutesActive(user.id, date);
  milesWalked.innerText = activity.calculateMilesToday(user.id, date, user.strideLength);
  let displayData = [{
      dataLabel: 'Minutes Active',
      chartID: 'minActiveChart',
      chartColor: '#36C878',
      dataType: 'minutesActive'
    },
    {
      dataLabel: 'Steps Taken',
      chartID: 'stepsChart',
      chartColor: '#C8363E',
      dataType: 'numSteps'
    },
    {
      dataLabel: 'Stairs Climbed',
      chartID: 'stairsChart',
      chartColor: '#C036C8',
      dataType: 'flightsOfStairs'
    }
  ]
  let dates = activity.getPrevDaysData(user.id, date, 'date');
  displayData.forEach((element) => {
    let data = activity.getPrevDaysData(user.id, date, `${element.dataType}`);
    displayLineChart(data, dates, element.dataLabel, element.chartID, element.chartColor);
  })
}

function instatiateUser() {
  userRepo = new UserRepository(userData);
  let id = Math.floor(Math.random() * userData.length);
  user = new User(userRepo.findUserByID(id));
  hydration = new Hydration(hydrationData);
  sleep = new Sleep(sleepData);
  activity = new Activity(activityData);
}

function displayUserInfo() {
  userInfo.forEach(function(domElement) {
    if (domElement.id === 'name') {
      domElement.innerText = user.getFirstName();
    } else {
      domElement.innerText = user[domElement.id];
    }
  });
}

function displayFriends() {
  let userSteps = activity.getSteps(user.id, date) 
  let friendsSteps = user.friends.map(friendID => {
    newFriend = new User(userRepo.findUserByID(friendID))
   let steps = activity.getSteps(friendID, date) 
    return friend = {
      name: newFriend.getFirstName(),
      steps: steps
    }
  })
 
  friendsSteps.push({name: 'You!', steps: userSteps});
  friendsSteps.sort((a, b) => b.steps - a.steps);

  friendsSteps.forEach(function(person) {
    let friendCardHTML = `
    <article class="card friends">
     <p>Name: ${person.name} </p>
     <p>Steps: ${person.steps} </p>
    </article>
    `
    friendsContainerEl.insertAdjacentHTML('beforeend', friendCardHTML);
  });
}

function displayAverageSteps() {
  let averageStepsHTML = `
  <article class="averageScore">
    <p>Your average steps compared with others:</p>
    <p>${userRepo.calculateAverageStepGoal(user.dailyStepGoal)}%</p>
  </article>
  `
  averageStepContainer.insertAdjacentHTML('beforeend', averageStepsHTML);
}

function displayTodaysSleep() {
  let todaysSleepHTML = `
  <article class="card sleep">
  <h3>Today's Sleep:</h3>
  <p>Hours of Sleep: <span id='hoursSlept'>${sleep.getDailySleep(user.id, date)}</span></p>
  <p>Quality of Sleep: <span id='sleepQuality'>${sleep.getDailySleepQuality(user.id, date)}</span></p>
  <h3>Average Sleep:</h3>
  <p>Hours of Sleep: <span id='averageHoursSlept'>${sleep.calcAvgSleepHrTotalDays(user.id)}</span></p>
  <p>Quality of Sleep: <span id='averageSleepQuality'>${sleep.calcAvgSleepQualityTotalDays(user.id)}</span></p>
</article>
  `
  sleepContainer.insertAdjacentHTML('beforeend', todaysSleepHTML);
}

// Charts

Chart.defaults.global.defaultFontColor = 'white';

function displayLineChart(data,labels,label,chartType,color) {
  var ctx = document.getElementById(chartType).getContext('2d');
  var myLineChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: label,
					backgroundColor: color,
					borderColor: '#AEBDCB',
					data: data,
					fill: true,
				}]
			},
			options: {
        legend:{
          display:false
        },
				responsive: true,
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: label
						}
					}]
				}
			}
		});
}

function displayLastWeekSleep() {
  var ctx = document.getElementById('sleepPastWeek').getContext('2d');
  var sleepDays = sleep.getPrevDaysSleepHrs(user.id, date);
  var sleepQualtyDays = sleep.getPrevDaysSleepQuality(user.id, date);
  let sleepDayLables = sleep.getDailySleepDays(user.id, date);
  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: sleepDayLables,
      datasets: [{
        label: 'Hours Of Sleep',
        data: sleepDays,
        xAxisID: 'sleep-y-axis',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',

        borderWidth: 1
      }, {
        label: 'Quality of Sleep',
        data: sleepQualtyDays,
        xAxisID: 'quality-y-axis',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
            ticks: {
              fontColor: 'rgba(54, 162, 235, 1)'
            },
            id: 'sleep-y-axis',
            type: 'linear',
            position: 'right'
          },
          {
            ticks: {
              fontColor: 'rgba(255, 206, 86, 1)'
            },
            id: 'quality-y-axis',
            type: 'linear',
            position: 'right'
          }
        ]
      }
    }
  });
}

function makeDonutChart() {
  var ctx = document.getElementById('hydrationConsumed').getContext('2d');
  var ounces = hydration.getFluidConsumedDay(user.id, date);
  var myChart = new Chart(ctx, {type: 'doughnut',
    data: {
      datasets: [{
        data: [
          ounces, 101- ounces
        ],
        backgroundColor: [
          '#355C7D',
          'grey'
        ],
        label: 'Dataset 1'
      }],
      labels: [
        'Oz',
        'Oz Left to drink?'
      ]
    },
    options: {
      legend:{
        display:false
      },
      responsive: true,
      title: {
        display: true,
        text: `${ounces} Oz. Drunk Today`,
        position: 'bottom'
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      }
    }
  });
}


window.onload = windowLoadHandler();
