'use strict';

angular.module('doresolApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $http, Auth,Memorial,Composite,$state, ENV, $firebase, User, Util, $sce, Qna, $modal, ngDialog) {
    $scope.muted = true;
    $scope.signupUser ={};
    $scope.loginUser = {};
    $scope.loginErrors = {};
    $scope.signupErrors = {};

    $scope.isLoggedIn = false;
    $scope.waitForLogging = true;

    $scope.$watch(function(){return User.getCurrentUser();}, 
      function (newValue) {
        if(newValue !== null) {
          $scope.isLoggedIn = true;
          $scope.user = User.getCurrentUser();
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
             if($rootScope.modalOpen) {
              $scope.closeThisDialog('true');
              $rootScope.modalOpen = false;
             }

             if($rootScope.toState) {
              $state.go($rootScope.toState, $rootScope.toParams);
             } else {
              $state.go("memorials");
             }
          });
        } else {
           if($rootScope.modalOpen) {
            $scope.closeThisDialog('true');
            $rootScope.modalOpen = false;
           }

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
            
             if($rootScope.modalOpen) {
              $scope.closeThisDialog('true');
              $rootScope.modalOpen = false;
             }

             if($rootScope.toState) {
              $state.go($rootScope.toState, $rootScope.toParams);
             } else {
              $state.go("memorials");
             }
            });

          } else {
            
            if($rootScope.modalOpen) {
              $scope.closeThisDialog('true');
              $rootScope.modalOpen = false;
            }
            if($rootScope.toState) {
             $state.go($rootScope.toState, $rootScope.toParams);
            } else {
             $state.go("memorials");
            }
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
      memorial = Memorial.setMemorialSummary(memorial);
      $scope.recentMemorials.unshift(memorial);
    });

    $scope.alertLogin = function(){
      alert('로그인이 필요합니다.');
    }

    $scope.browser = Util.getBrowser();
    $scope.width = Util.getWidth();
    $scope.isMobile = Util.isMobile();

    $scope.qnaTab = 'origin';

    $scope.changeQnaTab = function(qnaTab){
      $scope.qnaTab = qnaTab;
    }

    $scope.newQna = {};

    $scope.createNewQna = function(form){
      if(!$scope.isLoggedIn){
        $scope.alertLogin();
      }else if(form.$valid){
        $scope.newQna.ref_user = $scope.user.$id;
        Qna.create($scope.newQna).then(function(){
          $scope.newQna = {};
          $scope.qnaMessage = '등록되었습니다.';
          $timeout(function(){
            $scope.qnaMessage = '';
          },2000);
        });
      }
    }

    $scope.users = User.getUsersObject();
    $scope.qnaPageNum = 0;
    $scope.replyObject = {};
    $scope.replyCnt = {};

    $scope.fetchQna = function(type,key){
      $scope.qnaArray = [];
      var qnaRef =  new Firebase(ENV.FIREBASE_URI + '/qna');
      if(type == 'more'){
        if(key){
          var _qna = qnaRef.endAt(null,key).limit(10);
        }else{
          var _qna = qnaRef.endAt().limit(10);
        }
      }else{
        var _qna = qnaRef.startAt(null,key).limit(10);
      }
      // var _qna = qnaRef.endAt().limit(100);
      // var _qna = qnaRef.endAt(null,'-JWwLBXSbBCAmNjBbH4T').limit(3);
      _qna.on('child_added', function(value) { 
        var qna = value.val();
        qna.$id = value.name();
        qna.fromNow = moment(qna.created_at).fromNow();

        User.setUsersObject(qna.ref_user);
        $scope.qnaArray.push(qna);
        $scope.qnaArray.sort(function(aValue,bValue){
          return aValue.created_at < bValue.created_at ? 1 : -1;
        });

        if(!$scope.replyCnt[qna.$id]){
          $scope.replyCnt[qna.$id] = 0;
        }
        var replyRef = new Firebase(ENV.FIREBASE_URI + '/qna/'+qna.$id+'/reply/');
        var _reply = $firebase(replyRef).$asArray();
        
        _reply.$watch(function(event){
          switch(event.event){
            case "child_removed":
              $scope.replyCnt[qna.$id]--;
              break;
            case "child_added":
              $scope.replyCnt[qna.$id]++;
              var childRef = replyRef.child(event.key);
              var reply = $firebase(childRef).$asObject();
              reply.$loaded().then(function(value){
                if(!$scope.replyObject[qna.$id]){
                  $scope.replyObject[qna.$id] = {};
                }
                value.fromNow = moment(value.created_at).fromNow();
                $scope.replyObject[qna.$id][event.key] = value;
                User.setUsersObject(value.ref_user);
              });  
              break;
          }
        });
      });
    }

    $scope.fetchQnaMore = function(){
      var qnaCnt = $scope.qnaArray.length;
      if(qnaCnt > 0){
        $scope.fetchQna('more',$scope.qnaArray[qnaCnt-1].$id);
      }
    }

    $scope.fetchQnaPrev = function(){
      var qnaCnt = $scope.qnaArray.length;
      if(qnaCnt > 0){
        $scope.fetchQna('prev',$scope.qnaArray[0].$id);
      }
    }
    
    $scope.fetchQna('more',null); 
    
    $scope.openModal = function (qna) {
      var modalInstance = $modal.open({
        templateUrl: 'app/main/qna_modal.html',
        controller: 'QnaModalCtrl',
        size: 'lg',
        resolve: { 
          paramFromDialogName: function(){
            return 'parent';
          },         
          paramFromDialogObject: function () {
            return {
              qna:qna,
              users:$scope.users,
              replyObject:$scope.replyObject
            }
          }
        }
      });

      modalInstance.result.then(function (paramFromDialogObject) {
        //click ok
        // console.log('click ok');
        // $scope.paramFromDialogObject = paramFromDialogObject;
      }, function () {
        //canceled
      });
    };
    
  });