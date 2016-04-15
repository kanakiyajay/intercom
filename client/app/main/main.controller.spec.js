'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('tpApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/messages')
      .respond([{
        message: 'Hello World 1'
      }, {
        message: 'Hello World 2'
      }]);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.messages.length).toBe(4);
  });
});
