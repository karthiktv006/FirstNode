
 app.controller('logincontroller',function($scope,$location,$http,$window)
 {
 $scope.loginStatus=false;
 $scope.showDropdown=false;
 $scope.authcode='';
 $scope.login = function()
 {
 $scope.authentication();
 };
 
 $scope.message ='ECE9065b';
 $scope.logout= function()
 {
   $scope.loginStatus=false;
   $location.path('/');
 };
 

  $scope.authentication = function ()
  {
    auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(function(resp) 
    {
    $scope.authcode = resp.code;
    console.log($scope.authcode);
    $http.get('/authcode',{params:{"code": $scope.authcode}}).success(function(response){$scope.loginStatus=true;console.log("success"+response) });
    {
     
    }
    }); 
  };
  
  
});   
 
app.controller('DropdownController',

function($scope,$location)
{
$scope.selectOption = function(selectedvalue)
{  
 $location.path('/' + $scope.selectedvalue);
};

});









    
