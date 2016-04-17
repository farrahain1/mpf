angular.module('mpf.controllers', ['firebase', 'ionic-ratings', 'angularUtils.directives.dirPagination'])
  .controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window', 'profile',
    function ($scope, $rootScope, $firebaseAuth, $window, profile) {
      $scope.user = {
        email: "",
        password: ""
      };


        $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        var username = this.username;
        var obj = {email: email, password: password};
        console.log(obj); // works correctly

        if (!email || !password || !username) {
          $rootScope.notify("Please enter valid credentials");
          return false;
        }

        $rootScope.show('Please wait.. Registering');

        $rootScope.auth.$createUser({
        email: email,
        password: password
      }).then(function(userData) {    
        console.log("User " + userData.uid + " created successfully!"); 
        $rootScope.hide();

        return $scope.auth.$authWithPassword({
          email: email,
          password: password
        });

      }).then(function(authData) {
        $scope.prof = profile;
        console.log("Logged in as:", authData.uid);
        $window.location.href = ('#/menu/browse');
        $scope.prof.$add({
          name : username,
          userId :  authData.uid,
          email: email
        });
        //tambah if admin kat sini
        /*
          if(authData.email == admin@mpf.com){
              $window.location.href = ('#/menu/adminDash');
          }
          else{
            $window.location.href = ('#/menu/browse');
          }
        */
      }).catch(function(error) {
        //console.error("Error: ", error);
        if (error.code == 'INVALID_EMAIL') {
              console.log("INVALID_EMAIL");
              $rootScope.notify('Invalid Email Address');
            }
            else if (error.code == 'EMAIL_TAKEN') {
              console.log("EMAIL_TAKEN");
              $rootScope.notify('Email Address already taken');
            }
            else {
              console.log("OOPS");
              $rootScope.notify('Oops something went wrong. Please try again later');
            }
      });
        /*$rootScope.auth.$createUser(obj, function (error, user) {
          console.log("woi");
          if (!error) {
            $rootScope.hide();
            $rootScope.userEmail = obj.email; 
            $window.location.href = ('#/menu/browse');
          }
          else {
            $rootScope.hide();
            if (error.code == 'INVALID_EMAIL') {
              console.log("INVALID_EMAIL");
              $rootScope.notify('Invalid Email Address');
            }
            else if (error.code == 'EMAIL_TAKEN') {
              console.log("EMAIL_TAKEN");
              $rootScope.notify('Email Address already taken');
            }
            else {
              console.log("OOPS");
              $rootScope.notify('Oops something went wrong. Please try again later');
            }
          }
        });*/
          
      }
    }
  ])

  .controller('SignInCtrl', [
  '$state', '$scope', '$rootScope', '$firebaseAuth', '$window', '$ionicHistory',
  function ($state, $scope, $rootScope, $firebaseAuth, $window, $ionicHistory) {
   
   // check session
    // $rootScope.checkSession();
     $scope.user = {
        email: "",
        password: ""
     };

     $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    console.log('Previous state:'+$rootScope.previousState)
    console.log('Current state:'+$rootScope.currentState)
    });

    console.log("masuk");
     
     $scope.validateUser = function () {
      console.log("masuk 2");
        $rootScope.show('Please wait.. Authenticating');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }

          console.log("masuk 4");
        $rootScope.auth.$authWithPassword({
           email: email,
           password: password
        })
        .then(function (user) {
          $rootScope.hide();
          $rootScope.userEmail = user.email;
          console.log(email);


          if(email == "admin@mpf.com"){
              $window.location.href = ('#/adminMenu/verify');
              console.log("login as admin");
          }
          else{
            $window.location.href = ('#/menu/browse');
            console.log("login as user");
          }

          //$state.go('menu.browse'); 
          //$window.location.href = ('#/menu/browse');
        }, function (error) {
          $rootScope.hide();
          if (error.code == 'INVALID_EMAIL') {
            console.log("INVALID_EMAIL");
            $rootScope.notify('Invalid Email Address');
          }
          else if (error.code == 'INVALID_PASSWORD') {
             console.log("INVALID_PASSWORD");
            $rootScope.notify('Invalid Password');
          }
          else if (error.code == 'INVALID_USER') {
             console.log("INVALID_USER");
            $rootScope.notify('Invalid User');
          }
          else {
             console.log("OOPS");
            $rootScope.notify('Oops something went wrong. Please try again later');
          }
        });
     }
  }
])


.controller('BrowseCtrl', function($rootScope, $scope, $state, $window, $ionicModal, $firebase,$ionicHistory, category) {
  
  $scope.category = category;

  
  // console.log("masuk next");
  // /*$rootScope.show("Please wait... Processing");
  // $rootScope.checkUser();*/
  // console.log("masuk next");
  // $scope.list = [];
  // console.log("masuk next");
  // var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  // console.log("masuk next");
  // console.log($ionicHistory.currentStateName());

  // if($ionicHistory.currentHistoryId() === "ion1"){
  //   console.log("clear history");
  //     $ionicHistory.clearHistory();
  //     console.log($ionicHistory.currentHistoryId());
  //   }
  // bucketListRef.on('value', function(snapshot) {
  //   var data = snapshot.val();
  //   console.log("masuk next");
  //   $scope.list = [];
  //   console.log("masuk next");
  //   for (var key in data) {
  //     if (data.hasOwnProperty(key)) {
  //       if (data[key].isCompleted == false) {
  //         data[key].key = key;
  //         $scope.list.push(data[key]);
  //       }
  //     }
  //   }

  //   if ($scope.list.length == 0) {
  //     $scope.noData = true;
  //   } else {
  //     $scope.noData = false;
  //   }
  //   $rootScope.hide();
  // });
  // $rootScope.hide();

  // $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
  //   $scope.newTemplate = modal;

    
  // });

 /* navigator.geolocation.getCurrentPosition(function(position) {
          

         
            $scope.ori = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          },function error(msg){
          alert('Please enable your GPS setting browse');  
        
        
  }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});
   */

   /*$scope.back = function(){
    console.log("masuk back");    
      
      console.log($rootScope.previousState);
      if($rootScope.previousState == "auth.signin"){
        console.log("masuk semula");
        $rootScope.notify('No no');              
      }
      else{
        window.history.back();    
      }
   }*/

 /* $scope.notLoginPage = function(){
    console.log("test");
    if($ionicHistory.currentHistoryId() === "ion1"){
      $ionicHistory.clearHistory();
    }
  }*/
   


/*  $scope.catLink = function(id){
    console.log(id);
    //var link = 
    //$window.location.href=('#/menu/editPlace');
    var ref = new Firebase("https://mpf.firebaseio.com/Place");
    ref.orderByChild("category").equalTo(id).on("child_added", function(snapshot) {
    console.log(snapshot.key());
    //$window.location.href=('#/menu/list/{{cat.id}}');
    });*/
    $scope.currState = $ionicHistory.currentStateName();
    $scope.data = function(catId) {
            if($scope.currState == "adminMenu.browse"){
              $state.go('adminMenu.list', { id: catId });
            }
            else if($scope.currState == "menu.browse"){
              $state.go('menu.list', { id: catId });
            }
             //$state.go('menu.list'); 
        };

  /*};*/

})

.controller('newCtrl', function($rootScope, $scope, $window, $firebase) {
  $scope.data = {
    item: ""
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.createNew = function() {
    var item = this.data.item;

    if (!item) return;

    $scope.modal.hide();
    $rootScope.show();
    $rootScope.show("Please wait... Creating new");

    var form = {
      item: item,
      isCompleted: false,
      created: Date.now(),
      updated: Date.now()
    };

    var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    $firebase(bucketListRef).$add(form);
    $rootScope.hide();
  };
})

.controller('placeCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicHistory, $ionicPlatform, $ionicLoading, $cordovaGeolocation, $window) {
  
  /*$window.location.reload();*/
  $scope.places = Place;

   $scope.star=function(n){
    if(n)
     return new Array(n);
};



 /* $scope.doRefresh = function() {
    console.log("refresh");
    window.location.reload();
  };*/


  if ($stateParams.id) {
            $scope.cat = $stateParams.id;
            console.log($scope.cat); //FD
        }

  var ref = new Firebase("https://mpf.firebaseio.com/category");
     ref.orderByKey().equalTo($scope.cat).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    $scope.asHeader = snapshot.val(); 

  })

 $scope.currState = $ionicHistory.currentStateName();
 $scope.data = function(plcId) {
            console.log(plcId);
            if($scope.currState == "adminMenu.list"){
              $state.go('adminMenu.details', { id: plcId });  
            }
            else if($scope.currState == "menu.list"){
              $state.go('menu.details', {id: plcId });
            }
            
             //$state.go('menu.list'); 
        };
/******************************************************************/
//      $scope.loc =  function(address){


//       var hoi;

//       navigator.geolocation.getCurrentPosition(function(position) {
//           $scope.ori = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };


          
//           var geocoder = new google.maps.Geocoder();
//         geocoder.geocode({'address': address}, function(results, status) {
//        /* if (status === google.maps.GeocoderStatus.OK) {*/
//           /*resultsMap.setCenter(results[0].geometry.location);*/
//           var destLoc = results[0].geometry.location;
//           console.log(results[0].geometry.location);
//           console.log("Dest lat : " + destLoc.lat());
//           console.log("Dest lng : " + destLoc.lng());
//           console.log("Ori lat : " + $scope.ori.lat);
//           console.log("Ori lng : " + $scope.ori.lng);
//           hoi = $scope.distance($scope.ori,destLoc);
//           console.log(hoi);
//           // return jarak;
//       /*var marker = new google.maps.Marker({
//         map: resultsMap,
//         position: results[0].geometry.location
//       });*/
//     /*} else {
//       alert('Geocode was not successful for the following reason: ' + status);
     
//     }*/

//       })
//         console.log(hoi);
//        })
//       console.log(hoi);
//       return "hoi";
// }
/*var timer = function() {
  window.location.reload(true);
};
var timeout = setTimeout(timer, 5000);*/
//    $scope.$on('$ionicView.beforeEnter', function(){
//   /*alert("refresh");*/
// });

/*$scope.refresh = function() {

  setTimeout("location.reload(true);", 5000);

}*/
/*setTimeout(timer, 5000);
 clearTimeout(timeout);*/
 
          
$scope.loc = function(address,index) {   
        $ionicPlatform.ready(function() { 
      /* if(index===1){
         
            console.log("masuk sini lah ya");
          }*/
          if(index == 1){
        cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }
    
      $scope.displayDist = false;
       $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Calculating Distances..'
        });

       

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

          $scope.jarak = [];
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            console.log("masuk cordova geolocation");
            var lat  = position.coords.latitude;
            var lng = position.coords.longitude;
            console.log(lat);
            console.log(lng);
             
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  $scope.destLoc = results[0].geometry.location;
                } else {
                  alert('Geocode was not successful for the following reason: ' + status);
                }
                console.log($scope.destLoc);
                console.log(address);
                console.log("Dest " + $scope.destLoc.lat());
                console.log("Dest " + $scope.destLoc.lng());

                var p1 = new google.maps.LatLng(lat, lng);
                var p2 = new google.maps.LatLng($scope.destLoc.lat(), $scope.destLoc.lng());

                var d = calcDistance(p1, p2);
                $scope.jarak[index] =  d;
           
                console.log($scope.jarak);
         
            }) 

            $scope.displayDist = true;
            /*setTimeout("location.reload(true);", 5000);*/
            $ionicLoading.hide();  
            $state.go($state.current, {}, {reload: true});    

             
          }, function(err) {

              $ionicLoading.hide();
              
              if(index == 1){
                $rootScope.notify('Failed to calculate distance');
                /*alert(err.message);*/
                  /*cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);*/
                  /*$scope.loc(address,index);*/
                }
                
                /*var i=0;
                if(onRequestSuccess){
                  if(i != 2){
                    $scope.loc(address,index);
                    i++;
                  }
                }*/
                
               
                
              
              console.log(err.message);
          });

          

         /********************************/
      /* $scope.jarak = [];
        navigator.geolocation.getCurrentPosition(function(position) {
          

          console.log("INdex : " + index);
            $scope.ori = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          

          
          
          console.log("ORI " + $scope.ori.lat);
          console.log("ORI " + $scope.ori.lng);
          var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          $scope.destLoc = results[0].geometry.location;
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
         }
          console.log($scope.destLoc);
          console.log(address);
          console.log("Dest " + $scope.destLoc.lat());
          console.log("Dest " + $scope.destLoc.lng());

          var p1 = new google.maps.LatLng($scope.ori.lat, $scope.ori.lng);
          var p2 = new google.maps.LatLng($scope.destLoc.lat(), $scope.destLoc.lng());

          var d = calcDistance(p1, p2);
          $scope.jarak[index] =  d;
     
          console.log($scope.jarak);
         
        })

      },function error(msg){
        if(index == 1){
          alert('Please enable your GPS setting place list');  

                 }
        
  }, {maximumAge:600000, timeout:5000, enableHighAccuracy: false});*/
     

  })
}

function onRequestSuccess(success){
          console.log("Successfully requested accuracy: "+success.message);
         /*console.log(address);*/
         /*$scope.loc(address,index);*/
          /*window.location.reload();*/
       /*   $scope.displayDist = true;*/
        /*$state.go('menu.browse', {}, {reload: true});*/
         /*$state.go($state.current, {}, {reload: true});*/
       // $state.go($state.current, {}, {reload: true});
         
          }

          function onRequestFailure(error){

          console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
          if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
              if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                  cordova.plugins.diagnostic.switchToLocationSettings();
              }
           }
           
          }



 function calcDistance(p1, p2) {
            console.log("calculates");
            return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
          }

 $scope.toRad = function(x){
      return x * Math.PI / 180;
  }


/*****************************************************************/

   //     $scope.loc = function(address) {
         
   //      var balance;
   //      navigator.geolocation.getCurrentPosition(function(position) {
   //        $scope.ori = {
   //          lat: position.coords.latitude,
   //          lng: position.coords.longitude
   //        };

   //        console.log($scope.ori);   
   //      balance = $scope.dest($scope.ori,address);
   //      console.log(balance);
   //      return balance;
   //     })
   //       console.log("ada tak");
   //        /*console.log(desti);
   //        return desti;*/
   //    }

   //    $scope.dest = function(ori,address){
   //      console.log(ori);
        
   //      var geocoder = new google.maps.Geocoder();
   //      geocoder.geocode({'address': address}, function(results, status) {
   //      if (status === google.maps.GeocoderStatus.OK) {
   //        // resultsMap.setCenter(results[0].geometry.location);
   //        var destLoc = results[0].geometry.location;
   //        console.log(results[0].geometry.location);
   //        console.log("Dest lat : " + destLoc.lat());
   //        console.log("Dest lng : " + destLoc.lng());
   //        console.log("Ori lat : " + ori.lat);
   //        console.log("Ori lng : " + ori.lng);
   //        var distanceAll = $scope.distance(ori,destLoc);
   //        console.log(distanceAll);
   //        $scope.jarak =  distanceAll;
   //        console.log($scope.jarak);
   //        // return jarak;
   //    /*var marker = new google.maps.Marker({
   //      map: resultsMap,
   //      position: results[0].geometry.location
   //    });*/
   //  } else {
   //    alert('Geocode was not successful for the following reason: ' + status);
   //   $scope.jarak = 0;
   //   /*return jarak;*/
   //  }
   //  console.log($scope.jarak);
   // /* return $scope.jarak;*/
   //    })
   //      /*console.log($scope.jarak);
   //      return jarak;*/
   //    }
        
 

//  $scope.distance = function(ori,dest){
// console.log(ori.lat);
//   var R = 6371;
//   console.log(dest.lat());
// var dLat = toRad(dest.lat()-ori.lat);
// var dLon = toRad(dest.lng()-ori.lng);
// var dLat1 = toRad(ori.lat);
// var dLat2 = toRad(dest.lat());
// var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//         Math.cos(dLat1) * Math.cos(dLat1) *
//         Math.sin(dLon/2) * Math.sin(dLon/2);
// var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
// var d = R * c;

// console.log(d);

// var R = 6371; // Radius of the earth in km
//   var dLat = (dest.lat() - ori.lat) * Math.PI / 180;  // deg2rad below
//   var dLon = (dest.lng() - ori.lng) * Math.PI / 180;
//   var a = 
//      0.5 - Math.cos(dLat)/2 + 
//      Math.cos(ori.lat * Math.PI / 180) * Math.cos(dest.lat() * Math.PI / 180) * 
//      (1 - Math.cos(dLon))/2;

//      $scope.jarak =  R * 2 * Math.asin(Math.sqrt(a));
//      return $scope.jarak;
//   console.log($scope.jarak);
  
//  }


})

.controller('addPlaceCtrl', function($rootScope, $scope, $state, $window, $stateParams, $ionicHistory, $firebaseArray, Place) {
   /*var placeRef = new Firebase("https://mpf.firebaseio.com/" + $stateParams.id);
    $scope.placeLink = $firebaseArray(placeRef);*/
    $ionicHistory.clearCache();
    $scope.currState = $ionicHistory.currentStateName();

    var user = new Firebase("https://mpf.firebaseio.com");
   $scope.id = user.getAuth().uid;
   console.log($scope.id);
   if($scope.currState == "menu.addPlace"){
    $scope.addPlace = true; 
    $scope.addBusiness = true; 
  }
  else if($scope.currState == "adminMenu.addPlace"){
    $scope.addPlace = false;  
    $scope.addBusiness = true;
  }
    
    $scope.days = true;
    $scope.sTime = true;
  
  $scope.place = function(index){
    if(index == 1){
      $scope.addPlace = false;  
      $scope.addBusiness = true;      
    }
    else if(index == 2){
      $scope.addBusiness = false;
      $scope.addPlace = true;
    }
   
  }
   
  $scope.day = function(){
    $scope.days = false;
  }

   $scope.spTime = function(){
    $scope.sTime = false;
  }

  $scope.closeSPTime = function(){
    $scope.sTime = true;
    $scope.openHr = 0;
  }

  $scope.closeDay = function(){
    $scope.days = true;
    $scope.formDatas.hari.sunday = false;
    $scope.formDatas.hari.monday = false;
    $scope.formDatas.hari.tuesday = false;
    $scope.formDatas.hari.wednesday = false;
    $scope.formDatas.hari.thursday = false;
    $scope.formDatas.hari.friday = false;
    $scope.formDatas.hari.saturday = false;
  }

  //  $scope.model = {
  //   time1 : new Date()
  // };

  $scope.places = Place;

  //for radioButton
  $scope.formData = {};

  //for checkboxes
  $scope.formDatas = {};

  //for time checkbox
  $scope.formTime = {};

  //for choice place/business
  $scope.pilihan = {};

  $scope.validate = function(){
    if(!this.phone){
      this.phone = "";
      console.log("takde phone");
    }
    if(!this.website){
      this.website = "";
      console.log("takde website");
    }
    /*if(!$scope.formTime.time){
      $scope.openHr = false;
      $scope.closeHr = false;
      $scope.evTime = false;
      console.log("takde time");
    }*/
   /* if(!$scope.formData.open_days){
      console.log("Takde hari");
      $scope.formData.open_days = false;
       $scope.formDatas.hari.sunday = false;
      $scope.formDatas.hari.monday = false;
      $scope.formDatas.hari.tuesday = false;
      $scope.formDatas.hari.wednesday = false;
      $scope.formDatas.hari.thursday = false;
      $scope.formDatas.hari.friday = false;
      $scope.formDatas.hari.saturday = false;
    }*/
    if($scope.pilihan.tempat === "buss"){
      if(!$scope.regNo){
        console.log("takde time");
        $scope.regNo = false;
      }
    }

  }


  

 
    
  $scope.addP = function(){
     var nama = this.name;
    $scope.validate();
    /*console.log($scope.formTime.time);
    if($scope.formTime.time === "specific"){
      $scope.openHr = this.openTime.getHours() + ":" + ((this.openTime.getMinutes()<10?'0':'') + this.openTime.getMinutes());
     $scope.closeHr = this.closeTime.getHours() + ":" + ((this.closeTime.getMinutes()<10?'0':'') + this.closeTime.getMinutes());
     $scope.evTime = false;
    }
    else if($scope.formTime.time === "allTime"){
      $scope.openHr = false;
      $scope.closeHr = false;
      $scope.evTime = true;
    }*/
    
    /*console.log($scope.openHr);
    console.log(this.openTime);*/
    //letak validation kat sini

    
   /* console.log($scope.formData.open_days);
    if($scope.formData.open_days === "everyday"){
      $scope.everyday = true;
      console.log("everyday");
    }
    else if($scope.formData.open_days === "notFriday"){
      $scope.notFriday = true;
      console.log("notFriday");
    }
    else if($scope.formData.open_days === "notSaturday"){
      $scope.notSaturday = true;
      console.log("notSaturday");
    }
    else if($scope.formData.open_days === "other"){
      $scope.everyday = false;
      $scope.notFriday = false;
      $scope.notSaturday = false;
    }*/
    console.log("add place");
    var stateNow = $ionicHistory.currentStateName();
      if(stateNow == 'adminMenu.addPlace'){
        $scope.pilihan.tempat = "place";
        var status = "approved";
      }
      else{
        var status = "pending";
      }

    if($scope.pilihan.tempat === "place"){
    $scope.places.$add({
      name : this.name,
      category: this.category,
      phone :  this.phone, 
      website : this.website,
      /*open_hr : {
        specific : {
          open_hr : $scope.openHr,
          close_hr : $scope.closeHr
        },
        allTime : $scope.evTime
      },*/
      /*open_hr: $scope.openHr,
      close_hr: $scope.closeHr,
      opHr: $scope.allTime,*/
      close_days: {
          sunday: $scope.formDatas.hari.sunday,
          monday: $scope.formDatas.hari.monday,
          tuesday:$scope.formDatas.hari.tuesday,
          wednesday: $scope.formDatas.hari.wednesday,
          thursday: $scope.formDatas.hari.thursday,
          friday: $scope.formDatas.hari.friday,
          saturday: $scope.formDatas.hari.saturday
      },
      address: this.address,
      userId : $scope.id,
      status: status,
      created_date : Firebase.ServerValue.TIMESTAMP
      
    }).then(function() {
      $rootScope.notify('Successfully Add!');
      var stateNow = $ionicHistory.currentStateName();     
       var ref = new Firebase("https://mpf.firebaseio.com/Place");
       console.log(nama);
       ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        var placeId = snapshot.key();
        if(stateNow == 'menu.addPlace'){
          console.log("menu");
          $state.go('menu.details', { id: placeId });
        }
        else if(stateNow == 'adminMenu.addPlace'){
          console.log("adminmenu");
          $state.go('adminMenu.details', {id: placeId});
        }
    });
     
  });
   
   /* $window.location.reload();
     $rootScope.notify('Successfully Add');
     window.history.back(); */
    }
    else if($scope.pilihan.tempat === "buss"){
      console.log("masuk bussiness yeah");
     
      $scope.places.$add({
      name : this.name,
      category: this.category,
      phone :  this.phone, 
      website : this.website,
      /*open_hr : {
        specific : {
          open_hr : $scope.openHr,
          close_hr : $scope.closeHr
        },
        allTime : $scope.evTime
      },*/
      /*open_hr: $scope.openHr,
      close_hr: $scope.closeHr,
      opHr: $scope.allTime,*/
      close_days: {
          sunday: $scope.formDatas.hari.sunday,
          monday: $scope.formDatas.hari.monday,
          tuesday:$scope.formDatas.hari.tuesday,
          wednesday: $scope.formDatas.hari.wednesday,
          thursday: $scope.formDatas.hari.thursday,
          friday: $scope.formDatas.hari.friday,
          saturday: $scope.formDatas.hari.saturday
        
      },
      owner : this.own.owner,
      address: this.address,
      userId : $scope.id,
      status: status,
      created_date : Firebase.ServerValue.TIMESTAMP
      
    }).then(function() {
      console.log("add business");
      $rootScope.notify('Successfully Add!');
       var stateNow = $ionicHistory.currentStateName();      
       var ref = new Firebase("https://mpf.firebaseio.com/Place");
       console.log(nama);
       ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        var placeId = snapshot.key();
        $state.go('menu.details', { id: placeId });
    });
     
  });
      /* $rootScope.notify('Successfully Add');
      window.history.back(); */
    }
    
    $rootScope.notify('Successfully Add');
   /* $window.location.reload();*/
    /*$window.history.back();*/
  }


   $scope.data = {
    category: null
   };

   ////////////////////////////////////////////////////
   ////////////       edit place   ////////////////////
   ////////////////////////////////////////////////////
   var stateNow = $ionicHistory.currentStateName();
   console.log(stateNow);
   if(stateNow == "menu.editPlace"){
   if ($stateParams.id) {
            $scope.plcId = $stateParams.id;
            console.log($scope.plcId); 
        }

   var editPlace = new Firebase("https://mpf.firebaseio.com/Place");
  
     editPlace.orderByKey().equalTo($scope.plcId).on("child_added", function(snapshot) {
   console.log(snapshot.val());
   $scope.editPlc = snapshot.val();
    /*console.log("key : " + snapshot.key());  */
    var cat = new Firebase("https://mpf.firebaseio.com/category");
     cat.orderByKey().equalTo($scope.editPlc.category).on("child_added", function(snapshot) {
    $scope.kategori = snapshot.val();
    console.log(snapshot.key());
    $scope.cate = $scope.kategori.name; //BeautyCare
    
  })

  })

     var placeDet = new Firebase("https://mpf.firebaseio.com/Place/" + $scope.plcId);
     
     $scope.editP = function(){
    console.log("edit place");
    placeDet.update ({
      name: this.data.name,
      phone: this.data.phone,
      website: this.data.website

    });
   }
 }
   ////////////////////////////////////////////////////////
   //////////// end edit place ////////////////////////////
   ////////////////////////////////////////////////////////
 


})


.controller('editPlaceCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, $firebaseObject, $ionicHistory, Place) {

  $scope.places = Place;
  $scope.formData = {};
  $scope.formTime = {};
  $scope.days = true;
  $scope.sTime = true;


  if ($stateParams.id) {
            $scope.plcId = $stateParams.id;
            console.log($scope.plcId); 
        }

   $scope.day = function(){
    $scope.days = false;
  }

  /*  $scope.spTime = function(){
    $scope.sTime = false;
  }

  $scope.closeSPTime = function(){
    $scope.sTime = true;
  }

  if($scope.timing === "specific"){
      $scope.openHr = "KLSAL";
     $scope.closeHr = "DNDSJ";
     $scope.evTime = false;
    }
    else if($scope.timing === "allTime"){
      $scope.openHr = false;
      $scope.closeHr = false;
      $scope.evTime = true;
    }*/


 
  var ref = new Firebase("https://mpf.firebaseio.com/Place");
  
     ref.orderByKey().equalTo($scope.plcId).on("child_added", function(snapshot) {
   console.log(snapshot.val());
   $scope.data = snapshot.val();

    /*console.log("key : " + snapshot.key());  */
    var cat = new Firebase("https://mpf.firebaseio.com/category");
     cat.orderByKey().equalTo($scope.data.category).on("child_added", function(snapshot) {
    $scope.category = snapshot.val();
    console.log(snapshot.key());
    $scope.cate = $scope.category.name; //BeautyCare
    
  })

  })

     var placeDet = new Firebase("https://mpf.firebaseio.com/Place/" + $scope.plcId);
    $scope.currState = $ionicHistory.currentStateName();
     

     $scope.editP = function(){
    console.log("edit place");
    /*if(this.data.website){
      $scope.website = this.data.website;
      console.log("Ada data");
    }
    else{
      $scope.website = "";
      console.log("takde data");
    } */
    var nama = this.data.name;
    placeDet.update ({
      name: this.data.name,
      phone: this.data.phone,
      website: this.data.website,
  
     /* open_hr : {
        specific : {
          open_hr : $scope.openHr,
          close_hr : $scope.closeHr
        },
        allTime : $scope.evTime
      },*/
      /*open_hr: $scope.openHr,
      close_hr: $scope.closeHr,
      opHr: $scope.allTime,*/
      close_days: {
          sunday: $scope.data.close_days.sunday,
          monday: $scope.data.close_days.monday,
          tuesday:$scope.data.close_days.tuesday,
          wednesday: $scope.data.close_days.wednesday,
          thursday: $scope.data.close_days.thursday,
          friday: $scope.data.close_days.friday,
          saturday: $scope.data.close_days.saturday
      },
      address: this.data.address

    });

    if(placeDet.update){
      console.log("success");
      $rootScope.notify("Sending for Verification");
      var ref = new Firebase("https://mpf.firebaseio.com/Place");
       console.log(nama);
       ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        var placeId = snapshot.key();
        if($scope.currState === 'menu.editPlace'){
          $state.go('menu.details', { id: placeId });
        }
        else if($scope.currState === 'adminMenu.editPlace'){
          $state.go('adminMenu.details', { id: placeId });
        }
        
    });
    }
    /*.then(function() {
       var ref = new Firebase("https://mpf.firebaseio.com/Place");
       console.log(nama);
       ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        var placeId = snapshot.key();
        $state.go('menu.details', { id: placeId });
    });
  });*/
   }
    /*  $scope.placeDet = $firebaseObject(placeDet);
    console.log("https://mpf.firebaseio.com/Place/" + $scope.plcId);
$scope.editP = function(){
    console.log("edit place");
    $scope.placeDet.update({
      "name": this.name
    });
    /*placeDet.$save({
      name : this.name,
      phone :  this.phone,
      category: "BC",
      website : this.website
    });
  }*/
     
 


})



/*
  .directive('formattedTime', function ($filter) {

    return {
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
          if( !ngModel )
              return;
          if( attr.type !== 'time' )
              return;
                  
          ngModel.$formatters.unshift(function(value) {
              return value.replace(/:[0-9]+.[0-9]+$/, '');
          });
      }
    };
    
  })*/

.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

.controller('completedCtrl', function($rootScope, $scope, $window, $firebase) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];

  var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  bucketListRef.on('value', function(snapshot) {
    $scope.list = [];
    var data = snapshot.val();

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == true) {
          data[key].key = key;
          $scope.list.push(data[key]);
        }
      }
    }
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }

    $rootScope.hide();
  });

  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.child(key).remove(function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };
})



.controller('menuCtrl', function($rootScope, $scope, $state, $stateParams, $window, $ionicModal, $timeout, $firebaseArray) {
  console.log("inside menuCtrl");

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Open the login modal
  $scope.show = function() {
    $scope.modal.show();
  };

   $scope.closeSearch = function() {
    console.log("masuk closeSearch");
    $scope.modal.hide();
  };

  $scope.goSearch = function(){
    console.log("masuk goSearch");
    $window.location.href = ('#/menu/list');
    //$state.go('menu.list'); 
    $scope.closeSearch();
    //$state.go('menu.placeList'); 
    
  };

  

   $scope.searchData = function(searchID) {
            searchID = searchID.toLowerCase();
            console.log("Search data");            
            $state.go('menu.searchResult', { id: searchID });
            // $state.go('menu.profile'); 
             $scope.closeSearch();
        };

  var user = new Firebase("https://mpf.firebaseio.com");
   $scope.uid = user.getAuth().uid;
   $scope.uProf = function(userId) {
            $state.go('menu.profile', { id: userId });
             //$state.go('menu.list'); 
        };
  
  
 /* // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);

  };*/
})

.controller('resultCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place) {
   console.log("masuk resultctrl");
   if ($stateParams.id) {
            $scope.result = $stateParams.id;
            console.log($scope.result); //search string
        }

  $scope.plc = Place;

  $scope.placeData = function(placeId) {
            $state.go('menu.details', { id: placeId });
             //$state.go('menu.list'); 
        };



})

.controller('detailsCtrl', function($rootScope, $scope, $firebaseAuth, $state, $stateParams, $window, $ionicModal, $timeout, $ionicHistory, $ionicPopup, $cordovaGeolocation,  Place, review, profile) {
  console.log("inside detailsCtrl");
         

  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $scope.currState = $ionicHistory.currentStateName();

  $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    console.log('Previous state:'+$rootScope.previousState)
    console.log('Current state:'+$rootScope.currentState)
      if($rootScope.previousState === "adminMenu.editPlace"){
        console.log("hoiyeahhh");
        $window.location.reload(true);
      }
    });

  

  if ($stateParams.id) {
            $scope.det = $stateParams.id;
            console.log($scope.det); 
            //console.log($scope.details);
        }

  var ref = new Firebase("https://mpf.firebaseio.com/Place");
  var rev = new Firebase("https://mpf.firebaseio.com/review");
  var prof = new Firebase("https://mpf.firebaseio.com/profile");
  var user = new Firebase("https://mpf.firebaseio.com");
   $scope.email = user.getAuth().password.email;

  console.log($scope.email);  
  
console.log($scope.det);
  //display details berdasarkan id
     ref.orderByKey().equalTo($scope.det).on("child_added", function(snapshot) {
   console.log(snapshot.val());
   $scope.data = snapshot.val();
   console.log($scope.data.userId);
      prof.orderByChild("userId").equalTo($scope.data.userId).on("child_added", function(snapshot) {
        $scope.userEmail = snapshot.val();  
        console.log(snapshot.val());
      })
   var j = 0;
   $scope.everyday = [];
   /* if($scope.data.open_days.everyday){
        $scope.everyday[j] = "Everyday";
    }
    else if($scope.data.open_days.notFriday){
      $scope.everyday[j] = "Close on Friday only";
    }
    else if($scope.data.open_days.notSaturday){
      $scope.everyday[j] = "Close on Saturday only";
    }    
    else{*/
      
      console.log($scope.data.close_days.monday);
      if($scope.data.close_days.monday){
        $scope.everyday[j] = "Monday";
        console.log("mon");
        j++;
      }
      if($scope.data.close_days.tuesday){
        $scope.everyday[j] = "Tuesday";
        console.log("tues");
        j++;
      }
      if($scope.data.close_days.wednesday){
        $scope.everyday[j] = "Wednesday";
        console.log("wed");
        j++;
      }
      if($scope.data.close_days.thursday){
        $scope.everyday[j] = "Thursday";
        console.log("thurs");
        j++;
      }
      if($scope.data.close_days.friday){
        $scope.everyday[j] = "Friday";
        console.log("fri");
        j++;
      }
      if($scope.data.close_days.saturday){
        $scope.everyday[j] = "Saturday";
        console.log("sat");
        j++;
      }
      if($scope.data.close_days.sunday){
        $scope.everyday[j] = "Sunday";
        console.log("mon");
        j++;
      }

      //not day
      var i = 0;
      $scope.open = {};
      if(!$scope.data.close_days.monday){
        $scope.open[i] = "Monday";
        console.log("mon");
        i++;
      }
      if(!$scope.data.close_days.tuesday){
        $scope.open[i] = "Tuesday";
        console.log("tues");
        i++;
      }
      if(!$scope.data.close_days.wednesday){
        $scope.open[i] = "Wednesday";
        console.log("wed");
        i++;
      }
      if(!$scope.data.close_days.thursday){
        $scope.open[i] = "Thursday";
        console.log("thurs");
        i++;
      }
      if(!$scope.data.close_days.friday){
        $scope.open[i] = "Friday";
        console.log("fri");
        i++;
      }
      if(!$scope.data.close_days.saturday){
        $scope.open[i] = "Saturday";
        console.log("sat");
        i++;
      }
      if(!$scope.data.close_days.sunday){
        $scope.open[i] = "Sunday";
        console.log("mon");
        i++;
      }
    //}
    $scope.totalDay = j;
    console.log($scope.totalDay);
    
   /* console.log($scope.data.open_hr.specific.open_hr);
    var masa = parseFloat($scope.data.open_hr.specific.open_hr);
    console.log(masa);*/


    /*console.log("key : " + snapshot.key());  */
  })

     
     
  $scope.coba = function(){
    $rootScope.show("pppsh");
  }


  //nav modal
  $ionicModal.fromTemplateUrl('templates/navigate.html', {
    id: '1',
    scope: $scope
  }).then(function(modal) {
    $scope.modalNav = modal;
  });

    //rate modal
  $ionicModal.fromTemplateUrl('templates/addRate.html', {
    id: '2',
    scope: $scope
  }).then(function(modal) {
    $scope.modalRate = modal;
  });

   $ionicModal.fromTemplateUrl('templates/listReview.html', {
    id: '3',
    scope: $scope
  }).then(function(modal) {
    $scope.modalRev = modal;   
  });

  // Open the login modal
  $scope.show = function(index) {
    if(index == 1)
      $scope.modalNav.show();
    else if(index == 2){
      $scope.modalRate.show();      
    }
    else if(index == 3)
      $scope.modalRev.show();
    /*$scope.listRev();*/
  };

  $scope.showFadd = function(){
    $scope.closeSearch(3);
    $scope.show(2);
  }

 /* $scope.rating = function(rat) { 
    if(rat)
      return parseInt(rat);
}*/

  $scope.star=function(n){
    if(n)
     return new Array(n);
};
  

  
 // $scope.listRev = function(){
     rev.orderByChild("placeId").equalTo($scope.det).on("value", function(snapshot) {
       //update overallStar & rankVal in firebase
    var placeStar = new Firebase("https://mpf.firebaseio.com/Place/" + $scope.det);
    console.log(snapshot.val());
    console.log("okay");
      $scope.revData = snapshot.val();
    $scope.profile = profile;

      /*console.log($scope.revData.user);*/
     /* var ref = new Firebase("https://mpf.firebaseio.com/profile");
     ref.orderByChild("email").equalTo($scope.revData.user).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    $scope.asHeader = snapshot.val();

})*/
      

      /////////////////////////////
      //    average rating       //
      /////////////////////////////

      var rate = snapshot.val();
      console.log(rate);
      var rateTotal = 0;
      var i = 0;

      angular.forEach(rate, function(totalRate){

        //console.log(rateTotal);       
      var rateTotalNan = isNaN(totalRate.rating);
      if(!rateTotalNan){
        rateTotal =  rateTotal + parseInt(totalRate.rating);
        i++;
         console.log("RATE TOTAL : " + rateTotal);
         console.log(i);
      }
      console.log(i);
      $scope.average = rateTotal/i;
    $scope.ave = Number(($scope.average).toFixed(0));
          
          
      
         if($scope.ave){
         
          console.log("masuk");
          placeStar.update ({
            overallStar : $scope.ave,
            ratePerson: i
          });
        }
     
      }); //penutup angular ForEach
      console.log(i);
      $scope.rankV = rateTotal/i;
      console.log(rateTotal);
      if($scope.rankV){
        console.log("masuk sini");
       placeStar.update ({
            rankVal: $scope.rankV,
            ratePerson: i
          });
      }

      ///// end rating /////


     

    })
 // }

  
        

  $scope.addRate = function(index, rating){
    console.log($scope.email);
    /*var ref = new Firebase("https://mpf.firebaseio.com/profile");
     ref.orderByChild("email").equalTo($scope.email).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    $scope.asHeader = snapshot.val(); 
  })*/


    if($scope.rate != null){
      //$rootScope.checkUser();
      /*console.log("add review : " + email);*/

      if(this.message!=null){
         $scope.reviews.$add({
        placeId: $scope.det,
        message : this.message,
        user : $scope.email,
        rating: $scope.rate,
        creation_date: Firebase.ServerValue.TIMESTAMP
      });
      }
      else {
         $scope.reviews.$add({
        placeId: $scope.det,
        user : $scope.email,
        rating: $scope.rate,
        creation_date : Firebase.ServerValue.TIMESTAMP
      });
     
      }      
       $rootScope.notify('Successfully Add!');  
      $scope.closeSearch(index); 
    }
    else{
      $rootScope.notify("Please rate");
    }
    
    console.log($scope.email);
    
  }

   $scope.closeSearch = function(index) {
    if(index == 1)
      $scope.modalNav.hide();
    else if(index == 2){
      $scope.modalRate.hide();     
     
    }
     else if(index == 3)
      $scope.modalRev.hide();
  };

 $scope.reviews = review;
 /*  $scope.addRev = function(){
    console.log("add review");
    $scope.reviews.$add({
      //id: $scope.det,
      message : this.message
    });
  }*/

  //retrieve details of place
  //$scope.places = Place;

  //$scope.details = Place;


  /*******************
          rating
  ********************/
   $scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star-outline',
        iconOnColor: 'rgb(255, 255, 0)',
        iconOffColor:  'rgb(0, 0, 0)',
        rating:  0,
        minRating:1,
        max:5,
        callback: function(rating) {
          $scope.rate = rating;
          $scope.ratingsCallback(rating);
          
        }
      };


      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
      };


     //utk admin menu
      $scope.editPlc = function(){
    console.log($scope.det);
    $state.go('adminMenu.editPlace', { id: $scope.det}); 
   }

   $scope.delPlc = function(plcName){
    console.log($scope.det);
    var sentence = "Delete";
    $rootScope.showConfirm(plcName,$scope.det, sentence);
   }

   $rootScope.showConfirm = function(plcName,plcId, sentence) {
            $ionicPopup.confirm({
              title: sentence + ' ' + plcName,
              template: 'Are you sure to ' + sentence + ' ' + plcName + ' ?'
            })
            .then(function(res) {
              if(res) {
                 console.log('You are sure');
                 if(sentence == 'Delete'){
                  $scope.del(plcId); 
                 }
                 else if(sentence == 'Reject'){
                  $scope.rej(plcId);
                 }
                 else if(sentence == 'Approve'){
                  $scope.app(plcId);
                 }
                 

                 
               } else {
                 console.log('You are not sure');
               }
                    });
          };

    $scope.del = function(id){
      console.log("let's delete " + id);
       var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
      plcR.remove();
      $rootScope.notify('Successfully Delete');
      $window.history.back();
    }

     $scope.rejPlc = function(plcName){
    console.log($scope.det);
    var sentence = "Reject";
    $rootScope.showConfirm(plcName,$scope.det, sentence);
   }

    $scope.appPlc = function(plcName){
    console.log($scope.det);
    var sentence = "Approve";
    $rootScope.showConfirm(plcName,$scope.det, sentence);
   }

   $scope.rej = function(id){
    console.log("reject");
    $scope.rejId = id;
    $scope.messageBox();
     var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
     plcR.update ({
      status: 'reject'
     })
     
     /*$rootScope.notify("The place rejected");*/
    /* $state.go('adminMenu.verify'); */
   }

   $scope.addRejMsg = function(id){
      var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
      console.log("https://mpf.firebaseio.com/Place/" + id);
       plcR.update ({
      rejectMsg: this.msg
     })
       $scope.closeBox();
       $window.history.back(); 
   }

   $scope.app = function(id){
    console.log("Approve");
     var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
     plcR.update ({
      status: 'approved'
     })
     $rootScope.notify("The place approved");
     $state.go('adminMenu.verify');
   }

    $ionicModal.fromTemplateUrl('templates/rejectMessage.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Open the login modal
      $scope.messageBox = function() {
        $scope.modal.show();
      };

       $scope.closeBox = function() {
        console.log("masuk closeloginInfo");
        $scope.modal.hide();
      };
  



     
    
/*  $scope.rating = {};
  $scope.rating.rate = 0;
  $scope.rating.max = 5;*/

   

})

.controller('profileCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicPopup, $ionicModal, $window) {
   console.log("masuk profilectrl");
   if ($stateParams.id) {
            $scope.profId = $stateParams.id;
            console.log($scope.profId); //search string
        }

   

   $scope.pl = Place;
   console.log($scope.pl);

   //list of added places
   var plc = new Firebase("https://mpf.firebaseio.com/Place");
   plc.orderByChild("userId").equalTo($scope.profId).on("value", function(snapshot) {
   console.log(snapshot.val());
   $scope.plcList = snapshot.val();

    })

   $scope.editPlc = function(plcId){
    console.log(plcId);
    $state.go('menu.editPlace', { id: plcId}); 
   }

   $scope.delPlc = function(plcId, plcName){
    console.log(plcId);
    $rootScope.showConfirm(plcName,plcId);
   }

   $rootScope.showConfirm = function(plcName,plcId) {
            $ionicPopup.confirm({
              title: 'Delete ' + plcName,
              template: 'Are you sure to delete ' + plcName + ' ?'
            })
            .then(function(res) {
              if(res) {
                 console.log('You are sure');
                 $scope.del(plcId);
                 
               } else {
                 console.log('You are not sure');
               }
                    });
          };

    $scope.del = function(id){
      console.log("let's delete " + id);
       var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
      plcR.remove();

      var ref = new Firebase("https://mpf.firebaseio.com/review");
      ref.orderByChild("placeId").equalTo(id).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        var revKey = snapshot.key();
        var revD =  new Firebase("https://mpf.firebaseio.com/review/"+revKey);
        revD.remove();
      })

      $rootScope.notify('Successfully Delete');

    }

    $scope.plcDetails = function(plcId){
      $state.go('menu.details', {id: plcId});
      
    }

   var user = new Firebase("https://mpf.firebaseio.com");
   $scope.id = user.getAuth().uid;
   $scope.email = user.getAuth().password.email;
   $scope.password = user.getAuth().password;
   console.log($scope.password);

   //name of user
   var prof = new Firebase("https://mpf.firebaseio.com/profile");
   prof.orderByChild("userId").equalTo($scope.profId).on("child_added", function(snapshot) {
   console.log(snapshot.val());
   $scope.data = snapshot.val();

    })

   $scope.editInfo = function(){
      var ref = new Firebase("https://mpf.firebaseio.com");
      ref.changePassword({
        email       : $scope.email,
        oldPassword : this.password1,
        newPassword : this.password2
      }, function(error) {
        if (error === null) {
          console.log("Password changed successfully");
          $rootScope.notify('Password changed successfully');
          $scope.close();
        } else {
          console.log("Error changing password:", error);
          $rootScope.notify('Error changing password');
        }
      });
       /* if(this.email){
            var ref = new Firebase("https://mpf.firebaseio.com");
            ref.changeEmail({
              oldEmail : $scope.email,
              newEmail : this.email,
              password : this.user.password1
            }, function(error) {
              if (error === null) {
                console.log("Email changed successfully");
                $scope.close();
                $window.location.reload();
              } else {
                console.log("Error changing email:", error);
              }
        });
      }*/
   

      /*prof.update ({
        name: 
      })*/
   }

   $scope.editEmail = function(){

   }

   $scope.editPassword = function(){

   }

    $ionicModal.fromTemplateUrl('templates/editLoginInfo.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Open the login modal
      $scope.show = function() {
        $scope.modal.show();
      };

       $scope.close = function() {
        console.log("masuk closeloginInfo");
        $scope.modal.hide();
      };
 /* $scope.plc = Place;

  $scope.placeData = function(placeId) {
            $state.go('menu.details', { id: placeId });
             //$state.go('menu.list'); 
        };*/




})



.controller('adminPlcListCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicPopup, $ionicModal, $ionicHistory, $window) {
   console.log("masuk profilectrl");
   
    if ($stateParams.id) {
            $scope.cat = $stateParams.id;
            console.log($scope.cat); //FD
    }

    //list of place
  var ref = new Firebase("https://mpf.firebaseio.com/category");
     ref.orderByKey().equalTo($scope.cat).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    $scope.asHeader = snapshot.val(); 
  })

     //redirect to place details
 $scope.currState = $ionicHistory.currentStateName();
 $scope.data = function(plcId) {
            console.log(plcId);
            if($scope.currState == "adminMenu.list"){
              $state.go('adminMenu.details', { id: plcId });  
            }
            else if($scope.currState == "menu.list"){
              $state.go('menu.details', {id: plcId });
            }
            
             //$state.go('menu.list'); 
        };
   

   $scope.places = Place;
   console.log($scope.pl);
   

   $scope.editPlc = function(plcId){
    console.log(plcId);
    $state.go('adminMenu.editPlace', { id: plcId}); 
   }

   $scope.delPlc = function(plcId, plcName){
    console.log(plcId);
    $rootScope.showConfirm(plcName,plcId);
   }

   $rootScope.showConfirm = function(plcName,plcId) {
            $ionicPopup.confirm({
              title: 'Delete ' + plcName,
              template: 'Are you sure to delete ' + plcName + ' ?'
            })
            .then(function(res) {
              if(res) {
                 console.log('You are sure');
                 $scope.del(plcId);
                 
               } else {
                 console.log('You are not sure');
               }
                    });
          };

    $scope.del = function(id){
      console.log("let's delete " + id);
       var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
      plcR.remove();
      $rootScope.notify('Successfully Delete');
    }

    $scope.plcDetails = function(plcId){
      $state.go('menu.details', {id: plcId});
      
    }






})

.controller('verifyCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicHistory) {
  
   $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    console.log('Previous state:'+$rootScope.previousState)
    console.log('Current state:'+$rootScope.currentState)
    });

  /*$scope.places = Place;*/
  var user = new Firebase("https://mpf.firebaseio.com");
  $scope.id = user.getAuth().uid;

  $scope.places = Place;

  var ref = new Firebase("https://mpf.firebaseio.com/Place");
  $scope.statuse = {wildcard:false, value: /^pending.*$/};
  console.log($scope.statuse);
 /* ref.on("value", function(snapshot){
    $scope.places = snapshot.val();
  })*/

 /* ref.orderByChild("status").equalTo("pending").on("value", function(snapshot) {
    console.log(snapshot.val());
    $scope.places = snapshot.val(); 
    
    //console.log($scope.places.userId);

    
    
    $scope.id = user.getAuth().uid;
  })*/



  var prof = new Firebase("https://mpf.firebaseio.com/profile");
  prof.on("value", function(snapshot){
    $scope.profile = snapshot.val();

  })
 /* prof.orderByChild("userId").equalTo($scope.data.userId).on("child_added", function(snapshot) {
        $scope.userEmail = snapshot.val();  
        console.log(snapshot.val());
      })*/

 $scope.currState = $ionicHistory.currentStateName();


 $scope.data = function(plcId) {  
              $state.go('adminMenu.details', { id: plcId});            
        };
 


})





function escapeEmailAddress(email) {
  if (!email) return false
  // Replace '.' (not allowed in a Firebase key) with ','
  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email.trim();
}
/*CRUD*/

function toRad(){
  /** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
}


