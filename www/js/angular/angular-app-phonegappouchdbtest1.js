var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
      }).
      when('/login/', {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      }).
      when('/signup/', {
        templateUrl: 'templates/signup.html',
        controller: 'SignupController'
      }).
      when('/userlanding/', {
        templateUrl: 'templates/userlanding.html',
        controller: 'UserLandingController'
      }).
      otherwise({
        redirectTo: '/home/'
      });
}]);
 
phonecatApp.controller('PhonegapPouchdbTest1', function PhonegapPouchdbTest1($scope) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});

phonecatApp.controller('HomeController', function($scope, $routeParams) {
    $scope.name = 'Test1. This is Add new order screen';
    $scope.orderid = $routeParams.testid;
});
 
 
phonecatApp.controller('LoginController', function($scope, $routeParams) { 
    $scope.name = 'Test2. This is Show orders screen';
    $scope.orderid = $routeParams.testid;
    
    
    $scope.submit = function() {
    	var email = this.useremail;
    	var password = this.userpassword;
    	console.log("ngscope. email=" + email);
		console.log("form submitted.");
        app.nodeSigninUser(email,password);
    };
});

phonecatApp.controller('SignupController', function($scope, $routeParams) { 
    $scope.name = 'Test3. This is Show orders screen';
    $scope.orderid = $routeParams.testid;
});

phonecatApp.controller('UserLandingController', function($scope, $routeParams) { 
    var userExistsObj = window.localStorage.getItem("userexists");
    var userExistsJSON = JSON.parse(userExistsObj);
    $scope.username = userExistsJSON.name;
    $scope.orderid = $routeParams.testid;
});