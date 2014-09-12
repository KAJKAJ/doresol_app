'use strict';

angular.module('doresolApp')
  .controller('MainCtrl', function ($scope, $timeout, $http, Auth,Memorial,Composite,$state, ENV, $firebase, User, Util, $sce) {

    $scope.muted = true;
    $scope.signupUser ={};
    $scope.loginUser = {};
    $scope.loginErrors = {};
    $scope.signupErrors = {};

    $scope.isLoggedIn = false;
    $scope.waitForLogging = true;

    // $scope.mute = function(){
    //   $("video")[0].muted=true;
    //   $scope.muted = true;
    // };
    // $scope.unmute = function(){
    //   $("video")[0].muted=false;
    //   $scope.muted = false;
    // // };
    // $scope.showLoginForm = false;
    // $scope.$watch('currentUser', function() {
    //   console.log($scope.currentUser);
    // };
    // $scope.checkLoggedIn = function() {
    //   $scope.waitForLogging = true;
    // }
    // $timeout($scope.checkLoggedIn(), 3000);

    $scope.$watch(function(){return User.getCurrentUser();}, 
      function (newValue) {
        if(newValue !== null) {
          $scope.isLoggedIn = true;
        } else {
          $scope.isLoggedIn = false;
        }
    }, true);

    $scope.goToMemorialsAfterLogin = function(value){
      Memorial.clearMyMemorial();
      Composite.setMyMemorials(value.uid).then(function(){
          // $location.path('/memorials');
        if ($state.params.memorialId !== undefined) {
          $state.params.inviteeId = value.uid;
          Composite.addMember($state.params).then(function(){
            $state.go("memorials");
          });
        } else {
          $state.go("memorials");
        }
      },function(error){
        console.log(error);
      });
    }
    
    $scope.signup = function(signupForm) {
      $scope.signupSubmitted = true;

      if(signupForm.$valid) {
        Auth.register($scope.signupUser).then(function (value){
          if($state.params.memorialId !== undefined) {
            $state.params.inviteeId = value.name();
            Composite.addMember($state.params).then(function(){
              Auth.login({
                email: $scope.signupUser.email,
                password: $scope.signupUser.password
              }).then(function(){
                $scope.goToMemorialsAfterLogin(value);
              })
            });
          } else {
            Auth.login({
                email: $scope.signupUser.email,
                password: $scope.signupUser.password
             }).then(function(){
              $scope.goToMemorialsAfterLogin(value);
            })
          }

        }, function(error){
          var errorCode = error.code;
          $scope.signupErrors = {};
          switch(errorCode){
            case "EMAIL_TAKEN":
              signupForm['email'].$setValidity('firebase',false);
              $scope.signupErrors['email'] = '이미 등록된 이메일 주소입니다.';
            break;
            default:
              signupForm['email'].$setValidity('firebase',false);
              $scope.signupErrors['email'] = errorCode;
            break;
          }
          
        });
      }
    };

    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider).then(function(value){
        Memorial.clearMyMemorial();
        Composite.setMyMemorials(value.uid).then(function(){
          if ($state.params.memorialId !== undefined) {
            $state.params.inviteeId = value.uid;
            Composite.addMember($state.params).then(function(){
              $state.go("memorials");
            });
          } else {
            $state.go("memorials");
          }

        });
      });
    };

    $scope.login = function(loginForm) {
      $scope.loginSubmitted = true;

      if(loginForm.$valid) {
        Auth.login({
          email: $scope.loginUser.email,
          password: $scope.loginUser.password
        })
        .then( function (value){
          $scope.goToMemorialsAfterLogin(value);
        } ,function(error){
          // console.log(error);
          var errorCode = error.code;
          // console.log(error);
          switch(errorCode){
            case "INVALID_EMAIL":
              $scope.loginErrors.other = "잘못된 형식의 이메일 주소입니다.";
              break;
            case "INVALID_USER":
              $scope.loginErrors.other = "등록되어있지 않은 이메일 주소입니다.";
            break;
            case "INVALID_PASSWORD":
              $scope.loginErrors.other = "잘못된 패스워드입니다.";
            break;
            default:
              $scope.loginErrors.other = errorCode;
            break;
          }
        });        
      }
    };
    
    $scope.recentMemorials = [];
    var recentMemorialsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/');
    var recentMemorials = recentMemorialsRef.limit(500);

    recentMemorials.on('child_added', function(value) { 
      var memorial = value.val();
      memorial.$id = value.name();
      $scope.recentMemorials.unshift(memorial);
    });

    $scope.alertLogin = function(){
      alert('로그인이 필요합니다.');
    }
    // $scope.recentMemorials = [];
    // var memorialsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/');
    // var recentMemorials = $firebase(memorialsRef).$asArray();

    // recentMemorials.$watch(function(event){
    //   switch(event.event){
    //     case "child_removed":
    //       break;
    //     case "child_added":
    //       var childRef = memorialsRef.child(event.key);
    //       var child = $firebase(childRef).$asObject();
    //       child.$loaded().then(function(value){
    //         // console.log(value);
    //         $scope.recentMemorials.push(value);
    //         $scope.recentMemorials.sort(function(aValue,bValue){
    //           return aValue.$id < bValue.$id ? 1 : -1;
    //         });
    //       });
    //       break;
    //   }
    // });

    $scope.browser = Util.getBrowser();
    $scope.width = Util.getWidth();
    $scope.isMobile = Util.isMobile();
  });