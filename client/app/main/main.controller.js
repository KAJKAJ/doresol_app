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

    $scope.recentMemorials = [];
    var recentMemorialsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/');
    var recentMemorials = recentMemorialsRef.limit(100);

    recentMemorials.on('child_added', function(value) { 
      var memorial = value.val();
      memorial.$id = value.name();
      memorial = Memorial.setMemorialSummary(memorial);
      $scope.recentMemorials.unshift(memorial);
    });

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
        $rootScope.modalOpen = true;
        $rootScope.toState = 'qna';
        
        ngDialog.openConfirm({
          template: '/app/account/login/login_modal.html',
          controller: 'MainCtrl',
          className: 'ngdialog-theme-default',
          scope: $scope
        }).then(function (value) {
          // console.log('Modal promise resolved. Value: ', value);
        }, function(reason) {
          // console.log('Modal promise rejected. Reason: ', reason);
          window.location.reload(); 
        });

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