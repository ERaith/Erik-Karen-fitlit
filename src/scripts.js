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
  displayOuncesDrankToday();
  displayLastWeekSleep();
  let activityData = activity.getPrevDaysActive(user.id, date);
  let activityLabels = activity.getPreviousDates(user.id, date);
  displayLastWeekActivity(activityData,activityLabels,'Min Active','activityMetrics');
  let hydrationData = hydration.getPrevDaysHydration(user.id, date);
  let hydrationLabels = hydration.getPreviousDates(user.id, date);
  displayLastWeekActivity(hydrationData,hydrationLabels,'OZ Drank','hydationConsumed');
}

function displayActivity(){
  numOfSteps.innerText=activity.getSteps(user.id,date);
  minutesActive.innerText=activity.getMinutesActive(user.id,date);
  milesWalked.innerText=activity.calculateMilesToday(user.id,date,user.strideLength);
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
  user.friends.forEach(function(friendId) {
    let friendCardHTML = `
    <article class="card friends">
     <p>${userRepo.findUserByID(friendId).name} </p>
     <p>DailyStepGoal: ${userRepo.findUserByID(friendId).dailyStepGoal} </p>
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

function displayOuncesDrankToday() {
  let ouncesDrankTodayHTML = `
  <article class="ouncesDrankToday">
  <p>Ounces Drank today: ${hydration.getFluidConsumedDay(user.id, date)}</p>
  <p>Ounces Drank in the past week: ${hydration.getPrevDaysHydration(user.id)}</p>
  </article>
  `
  numOunces.insertAdjacentHTML('beforeend', ouncesDrankTodayHTML);
}


function activeLink(event) {
  if (event.target.classList.contains('navLink')) {
    document.querySelector('.active').classList.remove('active');
    event.target.classList.add('active');
    swapContent(event);
  }
}

// Charts
function displayLastWeekActivity(data,labels,label,chartType) {
  var ctx = document.getElementById(chartType).getContext('2d');
  var myLineChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: label,
					backgroundColor: '#355C7D',
					borderColor: '#AEBDCB',
					data: data,
					fill: true,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: false,
				},
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
							labelString: 'Minutes Active'
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

//Temp Colors
// backgroundColor: [
//   'rgba(255, 99, 132, 0.2)',
//   'rgba(54, 162, 235, 0.2)',
//   'rgba(255, 206, 86, 0.2)',
//   'rgba(75, 192, 192, 0.2)',
//   'rgba(153, 102, 255, 0.2)',
//   'rgba(255, 159, 64, 0.2)'
// ]
// borderColor: [
//   'rgba(255, 99, 132, 1)',
//   'rgba(54, 162, 235, 1)',
//   'rgba(255, 206, 86, 1)',
//   'rgba(75, 192, 192, 1)',
//   'rgba(153, 102, 255, 1)',
//   'rgba(255, 159, 64, 1)'
// ]

// End Chart Info


linksParent.addEventListener('click', activeLink);
window.onload = windowLoadHandler();
