const chai = require('chai');
const expect = chai.expect;

const UserRepository = require('../src/UserRepository');

describe('UserRepository', function() {

  let userData;
  let userRepository;
  
  beforeEach( () => {
    userData = [
      {
        "id": 1,
        "name": "Luisa Hane",
        "address": "15195 Nakia Tunnel, Erdmanport VA 19901-1697",
        "email": "Diana.Hayes1@hotmail.com",
        "strideLength": 4.3,
        "dailyStepGoal": 10000,
        "friends": [
          16,
          4,
          8
        ]
      },
      {
        "id": 2,
        "name": "Jarvis Considine",
        "address": "30086 Kathryn Port, Ciceroland NE 07273",
        "email": "Dimitri.Bechtelar11@gmail.com",
        "strideLength": 4.5,
        "dailyStepGoal": 5000,
        "friends": [
          9,
          18,
          24,
          19
        ]
      },
    ];
    userRepository = new UserRepository(userData);
  });

  it('should instantiate as a UserRepository', function() {
    expect(userRepository).to.be.an.instanceof(UserRepository);
  });
  
  it('should find a user by ID', function() {
    expect(userRepository.findUserByID(1)).to.deep.equal(      
      {
      "id": 1,
      "name": "Luisa Hane",
      "address": "15195 Nakia Tunnel, Erdmanport VA 19901-1697",
      "email": "Diana.Hayes1@hotmail.com",
      "strideLength": 4.3,
      "dailyStepGoal": 10000,
      "friends": [
        16,
        4,
        8
      ]
    });
  });

  it('should return the average step goal of all users', function() {
    expect(userRepository.calculateAverageStepGoal(7500)).to.equal(100);
  });
});