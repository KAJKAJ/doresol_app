'use strict';

angular.module('doresolApp')
  .controller('LoginCtrl', function ($scope,Auth,$rootScope,User, $window,$state,Memorial,Composite) {
    $scope.user = {};
    $scope.errors = {};

    $scope.inProgress = false;
    
    console.log($state.params);

    $scope.goToMemorialsAfterLogin = function(value){
      Memorial.clearMyMemorial();
      Composite.setMyMemorials(value.uid).then(function(){

        if ($state.params.memorialId !== undefined) {
          $state.params.inviteeId = value.uid;
          Composite.addMember($state.params).then(function(){
             if($rootScope.toState) {
              $state.go($rootScope.toState, $rootScope.toParams);
             } else {
              $state.go("memorials");
             }
          });
        } else {
           if($rootScope.toState) {
            $state.go($rootScope.toState, $rootScope.toParams);
           } else {
            $state.go("memorials");
           }
        }
      },function(error){
        console.log(error);
      });
    }

    $scope.login = function(form) {
      $scope.errors.other = '';
      $scope.inProgress = true;
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function (value){
          Memorial.clearMyMemorial();
          Composite.setMyMemorials(value.uid).then(function(){
              // $location.path('/memorials');
            if ($state.params.memorialId !== undefined) {
              $state.params.inviteeId = value.uid;
              Composite.addMember($state.params).then(function(){
                $scope.inProgress = false;
                $scope.goToMemorialsAfterLogin(value);
              });
            } else {
              $scope.inProgress = false;
              $scope.goToMemorialsAfterLogin(value);
            }
          });
        } ,function(error){
          console.log(error);
          $scope.inProgress = false;
          var errorCode = error.code;
          switch(errorCode){
            case "INVALID_USER":
              $scope.errors.other = "등록되어있지 않은 이메일 주소입니다.";
              break;
            case "INVALID_EMAIL":
              $scope.errors.other = "잘못된 형식의 이메일입니다.";              
              break;
            case "INVALID_PASSWORD":
              $scope.errors.other = "잘못된 패스워드입니다.";
              break;
            default:
              $scope.errors.other = error.message;
              break;
          }
        });        
      }
    };

    $scope.signup = function(signupForm) {
      $scope.signupSubmitted = true;

      if(signupForm.$valid) {
        Auth.register($scope.user).then(function (value){
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
             if($rootScope.toState) {
              var tempState = $rootScope.toState;
              $rootScope.toState = null;
              $state.go(tempState, $rootScope.toParams);
             } else {
              $state.go("memorials");
             }
            });

          } else {
            if($rootScope.toState) {
             $rootScope.toParams.noPopUp = noPopUp;
              var tempState = $rootScope.toState;
              $rootScope.toState = null;             
             $state.go(tempState, $rootScope.toParams);
            } else {
             $state.go("memorials");
            }
          }
        });
      });
    };

    $scope.toRegister = function() {
      if($state.params.memorialId !== undefined) {
        $state.go('signup.invites', {memorialId: $state.params.memorialId, inviterId: $state.params.inviterId});
      } else {
        $state.go('signup');
      }
    };

    $scope.toLogin = function() {
      if($state.params.memorialId !== undefined) {
        $state.go('login.invites', {memorialId: $state.params.memorialId, inviterId: $state.params.inviterId});
      } else {
        $state.go('login');
      }
    }
    
  });
