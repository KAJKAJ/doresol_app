'use strict';

describe('Controller: MydoresolCtrl', function () {

  // load the controller's module
  beforeEach(module('doresolApp'));

  var MydoresolCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MydoresolCtrl = $controller('MydoresolCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
