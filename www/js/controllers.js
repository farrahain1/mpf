angular.module('mpf.controllers', ['firebase', 'ionic-ratings', 'angularUtils.directives.dirPagination'])
  .controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window', 'profile', '$ionicPlatform',
    function ($scope, $rootScope, $firebaseAuth, $window, profile, $ionicPlatform) {
      $ionicPlatform.ready(function() {
        $rootScope.checkUser();
        $scope.user = {
          email: "",
          password: ""
        };

          $scope.createUser = function () {
          var email = this.user.email;
          var password = this.user.password;
          var username = this.username;
          var obj = {email: email, password: password};

          if (!email || !password || !username) {
            $rootScope.notify("Please enter valid credentials");
            return false;
          }

          $rootScope.show('Please wait.. Registering');

          $rootScope.auth.$createUser({
          email: email,
          password: password
        }).then(function(userData) {    
          $rootScope.hide();

          return $scope.auth.$authWithPassword({
            email: email,
            password: password
          });

        }).then(function(authData) {
          $scope.prof = profile;
          $window.location.href = ('#/menu/browse');
          window.location.reload();
          $scope.prof.$add({
            name : username,
            userId :  authData.uid,
            email: email
          });
        }).catch(function(error) {
          if (error.code == 'INVALID_EMAIL') {
                $rootScope.notify('Invalid Email Address');
              }
              else if (error.code == 'EMAIL_TAKEN') {
                $rootScope.notify('Email Address already taken');
              }
              else {
                $rootScope.notify('Oops something went wrong. Please try again later');
              }
        });
        }
      })
    }
  ])

  .controller('SignInCtrl', [
  '$state', '$scope', '$rootScope', '$firebaseAuth', '$window', '$ionicHistory', '$ionicPlatform',
  function ($state, $scope, $rootScope, $firebaseAuth, $window, $ionicHistory, $ionicPlatform) {
     $ionicPlatform.ready(function() {

        $rootScope.checkUser();
        // $rootScope.checkConnection();
       $scope.user = {
          email: "",
          password: ""
       };

      $rootScope.previousState;
      $rootScope.currentState;
      $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
      });
       
      $scope.validateUser = function () {
          $rootScope.show('Please wait.. Authenticating');
          var email = this.user.email;
          var password = this.user.password;
          if (!email || !password) {
             $rootScope.notify("Please enter valid credentials");
             return false;
          }

          $rootScope.auth.$authWithPassword({
             email: email,
             password: password
          })
          .then(function (user) {
            $rootScope.hide();
            $rootScope.userEmail = user.email;

            if(email == "admin@mpf.com"){
                 $ionicHistory.nextViewOptions({
                  disableBack: true,
                  disableAnimate: true,
                  historyRoot: true
              });
                 $ionicHistory.clearCache();
              $ionicHistory.clearHistory();
                $window.location.href = ('#/adminMenu/verify');
                 window.location.reload();
            }
            else{
               $ionicHistory.nextViewOptions({
                  disableBack: true,
                  disableAnimate: true,
                  historyRoot: true
              });
               $ionicHistory.clearCache();
              $ionicHistory.clearHistory();
              $window.location.href = ('#/menu/browse');
              window.location.reload();
            }
          }, function (error) {
            $rootScope.hide();
            if (error.code == 'INVALID_EMAIL') {
              $rootScope.notify('Invalid Email Address');
            }
            else if (error.code == 'INVALID_PASSWORD') {
              $rootScope.notify('Invalid Password');
            }
            else if (error.code == 'INVALID_USER') {
              $rootScope.notify('Invalid User');
            }
            else {
              $rootScope.notify('Oops something went wrong. Please try again later');
            }
          });
       }
    })
  }
])


.controller('BrowseCtrl', function($rootScope, $scope, $state, $window, $ionicModal, $firebase, $ionicHistory, category, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    // $rootScope.setTitle("Browse");

    $scope.category = category;
    
    $scope.currState = $ionicHistory.currentStateName();
    $scope.data = function(catId) {
      if($scope.currState == "adminMenu.browse"){
        $state.go('adminMenu.list', { id: catId });
      }
      else if($scope.currState == "menu.browse"){
        $state.go('menu.list', { id: catId });
      }
    };
  })
})


.controller('placeCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicHistory, $ionicPlatform, $ionicLoading, $cordovaGeolocation, $window) {
  $ionicPlatform.ready(function() {

     $scope.pageSize = 7;
     
    $scope.places = Place;
    

    $scope.star=function(n){
      if(n)
       return new Array(n);
    };

    if ($stateParams.id) {
      $scope.cat = $stateParams.id;
    }
    $scope.i=0;
    var place = new Firebase("https://mpf.firebaseio.com/Place");
    place.orderByChild("category").equalTo($scope.cat).on("child_added", function(snapshot) {
      $scope.filteredPlc = snapshot.val(); 
       if ($scope.filteredPlc.status == 'approved') {
          $scope.i++;
          console.log($scope.i);
      }
    })

    var ref = new Firebase("https://mpf.firebaseio.com/category");
    ref.orderByKey().equalTo($scope.cat).on("child_added", function(snapshot) {
      $scope.asHeader = snapshot.val(); 
      /*$rootScope.setTitle($scope.asHeader.name);*/
    })

   $scope.currState = $ionicHistory.currentStateName();
   $scope.data = function(plcId) {
      if($scope.currState == "adminMenu.list"){
        $state.go('adminMenu.details', { id: plcId });  
      }
      else if($scope.currState == "menu.list"){
        $state.go('menu.details', {id: plcId });
      }
  };

    $scope.$on('$ionicView.loaded', function(){
      cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    });
    $scope.loc = function(address,index) {   
      $ionicPlatform.ready(function() { 
        
        // if(index == 0){
        //   cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        // }
      
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
          var lat  = position.coords.latitude;
          var lng = position.coords.longitude;
               
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              $scope.destLoc = results[0].geometry.location;
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
            var p1 = new google.maps.LatLng(lat, lng);
            var p2 = new google.maps.LatLng($scope.destLoc.lat(), $scope.destLoc.lng());

            var d = calcDistance(p1, p2);
            $scope.jarak[index] =  d;         
          }) 

            $scope.displayDist = true;
            $ionicLoading.hide();  
            $state.go($state.current, {}, {reload: true});    

               
        }, function(err) {
            $ionicLoading.hide();
                
            if(index == 1){
              $rootScope.notify('Failed to calculate distance');
            }
        });
      })
    }
      $scope.toRad = function(x){
      return x * Math.PI / 180;
    }
   
  })
})

.controller('addPlaceCtrl', function($rootScope, $scope, $state, $window, $stateParams, $ionicHistory, $firebaseArray, $ionicPlatform, Place, $cordovaImagePicker ) {
  $ionicPlatform.ready(function() {
    $ionicHistory.clearCache();
    $scope.currState = $ionicHistory.currentStateName();

    var user = new Firebase("https://mpf.firebaseio.com");
    $scope.id = user.getAuth().uid;
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
      }
      if(!this.website){
        this.website = "";
      }
    }

    $scope.addP = function(){
      var nama = this.name;
      var pic;
      $scope.validate();
      if(this.imgData){
        pic = this.imgData;
      }
      else{
        if(this.category == 'BC'){
          pic = "img/bc.png"
        }
        else if(this.category == 'BT'){
          pic = "img/bt.png"
        }
        else if(this.category == 'FD'){
          pic = "img/fd.png"
        }
        else if(this.category == 'HC'){
          pic = "img/hc.png"
        }
        else if(this.category == 'MK'){
          pic = "img/mk.png"
        }
        else if(this.category == 'Mosque'){
          pic = "img/m.png"
        }
      }
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
            rankVal: 0,
            status: status,
            pic: pic,
            created_date : Firebase.ServerValue.TIMESTAMP
        
          }).then(function() {
              $rootScope.notify('Successfully Add!');
              var stateNow = $ionicHistory.currentStateName();     
              var ref = new Firebase("https://mpf.firebaseio.com/Place");
              ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
              var placeId = snapshot.key();
                if(stateNow == 'menu.addPlace'){
                  $state.go('menu.details', { id: placeId });
                }
                else if(stateNow == 'adminMenu.addPlace'){
                  $state.go('adminMenu.details', {id: placeId});
                }
              });
           });
        }

        else if($scope.pilihan.tempat === "buss"){
       
          $scope.places.$add({
          name : this.name,
          category: this.category,
          phone :  this.phone, 
          website : this.website,
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
          rankVal: 0,
          status: status,
          pic: pic,
          created_date : Firebase.ServerValue.TIMESTAMP
          
        }).then(function() {
            $rootScope.notify('Successfully Add!');
            var stateNow = $ionicHistory.currentStateName();      
            var ref = new Firebase("https://mpf.firebaseio.com/Place");
            ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
              var placeId = snapshot.key();
              $state.go('menu.details', { id: placeId });
            });
        });
      }
      
      $rootScope.notify('Successfully Add');
    }


    $scope.data = {
      category: null
    }

     ////////////////////////////////////////////////////
     ////////////       edit place   ////////////////////
     ////////////////////////////////////////////////////
    var stateNow = $ionicHistory.currentStateName();
    if(stateNow == "menu.editPlace"){
      if ($stateParams.id) {
        $scope.plcId = $stateParams.id;
      }

    var editPlace = new Firebase("https://mpf.firebaseio.com/Place");
    
    editPlace.orderByKey().equalTo($scope.plcId).on("child_added", function(snapshot) {
      $scope.editPlc = snapshot.val();
      var cat = new Firebase("https://mpf.firebaseio.com/category");
      cat.orderByKey().equalTo($scope.editPlc.category).on("child_added", function(snapshot) {
        $scope.kategori = snapshot.val();
        $scope.cate = $scope.kategori.name;
      })
    })

    var placeDet = new Firebase("https://mpf.firebaseio.com/Place/" + $scope.plcId);
       
    $scope.editP = function(){
      placeDet.update ({
        name: this.data.name,
        phone: this.data.phone,
        website: this.data.website
      })
    }
   }

   $scope.collection = {
          selectedImage : ''
        };

       
          $scope.getImageSaveContact = function() {       
      
          // Image picker will load images according to these settings
            var options = {
              maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
              width: 100,
              height: 100,
              quality: 80            // Higher is better
            };
   
          $cordovaImagePicker.getPictures(options).then(function (results) {
          // Loop through acquired images
              $scope.imgData = results[0];
              window.plugins.Base64.encodeFile($scope.imgData, function(base64){  // Encode URI to Base64 needed for contacts plugin
                $scope.imgData = base64;
                // $scope.addContact(results[0]);    // Save contact
              });
              // $state.go($state.current, {}, {reload: true});    
          }, function(error) {
            // console.log('Error: ' + JSON.stringify(error));    // In case of error
        });
      };  
    
 
   ////////////////////////////////////////////////////////
   //////////// end edit place ////////////////////////////
   ////////////////////////////////////////////////////////
  })
})


.controller('editPlaceCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, $firebaseObject, $ionicHistory, Place, $ionicPlatform, $cordovaImagePicker ) {
  $ionicPlatform.ready(function() {
    $scope.places = Place;
    $scope.formData = {};
    $scope.formTime = {};
    $scope.days = true;
    $scope.sTime = true;


    if ($stateParams.id) {
      $scope.plcId = $stateParams.id;
    }

    $scope.day = function(){
      $scope.days = false;
    }

    var ref = new Firebase("https://mpf.firebaseio.com/Place");
    
    ref.orderByKey().equalTo($scope.plcId).on("child_added", function(snapshot) {
      $scope.data = snapshot.val();
      var cat = new Firebase("https://mpf.firebaseio.com/category");
      cat.orderByKey().equalTo($scope.data.category).on("child_added", function(snapshot) {
        $scope.category = snapshot.val();
        $scope.cate = $scope.category.name;
      })
    })

    var placeDet = new Firebase("https://mpf.firebaseio.com/Place/" + $scope.plcId);
      $scope.currState = $ionicHistory.currentStateName();
       
      $scope.editP = function(){

      var nama = this.data.name;
      placeDet.update ({
        name: this.data.name,
        phone: this.data.phone,
        website: this.data.website,
        close_days: {
            sunday: $scope.data.close_days.sunday,
            monday: $scope.data.close_days.monday,
            tuesday:$scope.data.close_days.tuesday,
            wednesday: $scope.data.close_days.wednesday,
            thursday: $scope.data.close_days.thursday,
            friday: $scope.data.close_days.friday,
            saturday: $scope.data.close_days.saturday
        },
        address: this.data.address,
        pic: this.imgData
      });

      if(placeDet.update){
        $rootScope.notify("Edited successfully");
        var ref = new Firebase("https://mpf.firebaseio.com/Place");
        ref.orderByChild("name").equalTo(nama).on("child_added", function(snapshot) {
          var placeId = snapshot.key();
          if($scope.currState === 'menu.editPlace'){
            $state.go('menu.details', { id: placeId });
          }
          else if($scope.currState === 'adminMenu.editPlace'){
            $state.go('adminMenu.details', { id: placeId });
          }
        });
      }
     }

     $scope.collection = {
          selectedImage : ''
        };

       
          $scope.getImageSaveContact = function() {       
      
          // Image picker will load images according to these settings
            var options = {
              maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
              width: 100,
              height: 100,
              quality: 80            // Higher is better
            };
   
          $cordovaImagePicker.getPictures(options).then(function (results) {
          // Loop through acquired images
              $scope.imgData = results[0];
              window.plugins.Base64.encodeFile($scope.imgData, function(base64){  // Encode URI to Base64 needed for contacts plugin
                $scope.imgData = base64;
                // $scope.addContact(results[0]);    // Save contact
              });
              // $state.go($state.current, {}, {reload: true});    
          }, function(error) {
            // console.log('Error: ' + JSON.stringify(error));    // In case of error
        });
      };  
  })
})

.controller('menuCtrl', function($rootScope, $scope, $state, $stateParams, $window, $ionicModal, $timeout, $firebaseArray, $ionicPlatform) {
  $ionicPlatform.ready(function() {
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
      $scope.modal.hide();
    };

    $scope.goSearch = function(){
      $window.location.href = ('#/menu/list');
      $scope.closeSearch();
    };

    $scope.searchData = function(searchID) {
      searchID = searchID.toLowerCase();
      $state.go('menu.searchResult', { id: searchID });
      $scope.closeSearch();
    };

    var user = new Firebase("https://mpf.firebaseio.com");
    $scope.uid = user.getAuth().uid;
    $scope.uProf = function(userId) {
      $state.go('menu.profile', { id: userId });
    };
  })
})

.controller('resultCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicPlatform, $cordovaGeolocation) {
   $ionicPlatform.ready(function() {
    if ($stateParams.id) {
      $scope.result = $stateParams.id;
    }

    $scope.star=function(n){
      if(n)
       return new Array(n);
    };

    $scope.plc = Place;
    $scope.placeData = function(placeId) {
      $state.go('menu.details', { id: placeId });
    };

    $scope.loc = function(address,index) {   
      $ionicPlatform.ready(function() { 
        if(index === 0){
          cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }
      
        $scope.displayDist = false;
        // $ionicLoading.show({
        //   template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Calculating Distances..'
        // });

        var posOptions = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };

        $scope.jarak = [];
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) { 
          var lat  = position.coords.latitude;
          var lng = position.coords.longitude;
               
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              $scope.destLoc = results[0].geometry.location;
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
            var p1 = new google.maps.LatLng(lat, lng);
            var p2 = new google.maps.LatLng($scope.destLoc.lat(), $scope.destLoc.lng());

            var d = calcDistance(p1, p2);
            $scope.jarak[index] =  d;         
          }) 

            $scope.displayDist = true;
            // $ionicLoading.hide();  
            $state.go($state.current, {}, {reload: true});    

               
        }, function(err) {
            $ionicLoading.hide();
                
            if(index == 1){
              $rootScope.notify('Failed to calculate distance');
            }
        });
      })
    }


   $scope.toRad = function(x){
      return x * Math.PI / 180;
    }
  })
})

.controller('detailsCtrl', function($rootScope, $scope, $firebaseAuth, $state, $stateParams, $window, $ionicModal, $timeout, $ionicHistory, $ionicPopup, $cordovaGeolocation,  Place, review, profile, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $scope.currState = $ionicHistory.currentStateName();

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
        if($rootScope.previousState === "adminMenu.editPlace"){
          $window.location.reload(true);
        }
    });

    if ($stateParams.id) {
      $scope.det = $stateParams.id;
    }

    var ref = new Firebase("https://mpf.firebaseio.com/Place");
    var rev = new Firebase("https://mpf.firebaseio.com/review");
    var prof = new Firebase("https://mpf.firebaseio.com/profile");
    var user = new Firebase("https://mpf.firebaseio.com");
    $scope.email = user.getAuth().password.email;

    //display details berdasarkan id
    ref.orderByKey().equalTo($scope.det).on("child_added", function(snapshot) {
      $scope.data = snapshot.val();
      prof.orderByChild("userId").equalTo($scope.data.userId).on("child_added", function(snapshot) {
      $scope.userEmail = snapshot.val();  
    })
    var j = 0;
    $scope.everyday = [];
    
    if($scope.data.close_days.monday){
      $scope.everyday[j] = "Monday";
      j++;
    }
    if($scope.data.close_days.tuesday){
      $scope.everyday[j] = "Tuesday";
      j++;
    }
    if($scope.data.close_days.wednesday){
      $scope.everyday[j] = "Wednesday";
      j++;
    }
    if($scope.data.close_days.thursday){
      $scope.everyday[j] = "Thursday";
      j++;
    }
    if($scope.data.close_days.friday){
      $scope.everyday[j] = "Friday";
      j++;
    }
    if($scope.data.close_days.saturday){
      $scope.everyday[j] = "Saturday";
      j++;
    }
    if($scope.data.close_days.sunday){
      $scope.everyday[j] = "Sunday";
      j++;
    }

    var i = 0;
    $scope.open = {};
    if(!$scope.data.close_days.monday){
      $scope.open[i] = "Monday";
      i++;
    }
    if(!$scope.data.close_days.tuesday){
      $scope.open[i] = "Tuesday";
      i++;
    }
    if(!$scope.data.close_days.wednesday){
      $scope.open[i] = "Wednesday";
      i++;
    }
    if(!$scope.data.close_days.thursday){
      $scope.open[i] = "Thursday";
      i++;
    }
    if(!$scope.data.close_days.friday){
      $scope.open[i] = "Friday";
      i++;
    }
    if(!$scope.data.close_days.saturday){
      $scope.open[i] = "Saturday";
      i++;
    }
    if(!$scope.data.close_days.sunday){
      $scope.open[i] = "Sunday";
      i++;
    }
      $scope.totalDay = j;
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

    $scope.star=function(n){
      if(n)
       return new Array(n);
    };
    
    rev.orderByChild("placeId").equalTo($scope.det).on("value", function(snapshot) {
      var placeStar = new Firebase("https://mpf.firebaseio.com/Place/" + $scope.det);
      $scope.revData = snapshot.val();
      $scope.profile = profile;

        /////////////////////////////
        //    average rating       //
        /////////////////////////////

        var rate = snapshot.val();
        var rateTotal = 0;
        var i = 0;

        angular.forEach(rate, function(totalRate){

          var rateTotalNan = isNaN(totalRate.rating);
          if(!rateTotalNan){
            rateTotal =  rateTotal + parseInt(totalRate.rating);
            i++;
          }
          $scope.average = rateTotal/i;
          $scope.ave = Number(($scope.average).toFixed(0));
          if($scope.ave){
            placeStar.update ({
              overallStar : $scope.ave,
              ratePerson: i
            });
          }
        }); //penutup angular ForEach
        $scope.rankV = rateTotal/i;
        if($scope.rankV){
         placeStar.update ({
            rankVal: $scope.rankV,
            ratePerson: i
          });
        }
        ///// end rating /////
      })

    $scope.addRate = function(index, rating){

      if($scope.rate != null){
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
      
    };


    //utk admin menu
    $scope.editPlc = function(){
      $state.go('adminMenu.editPlace', { id: $scope.det}); 
    }

    $scope.delPlc = function(plcName){
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
          }
        });
      };

      $scope.del = function(id){
        var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
        plcR.remove();
        $rootScope.notify('Successfully Delete');
        $window.history.back();
      }

      $scope.rejPlc = function(plcName){
        var sentence = "Reject";
        $rootScope.showConfirm(plcName,$scope.det, sentence);
      }

      $scope.appPlc = function(plcName){
        var sentence = "Approve";
        $rootScope.showConfirm(plcName,$scope.det, sentence);
      }

      $scope.rej = function(id){
        $scope.rejId = id;
        $scope.messageBox();
        var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
        plcR.update ({
          status: 'reject'
        })
      }

      $scope.addRejMsg = function(id){
        var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
          plcR.update ({
            rejectMsg: this.msg
           })
        $scope.closeBox();
        $window.history.back(); 
      }

      $scope.app = function(id){
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
        $scope.modal.hide();
      };
    })
})

.controller('profileCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicPopup, $ionicModal, $window, $ionicPlatform, $cordovaImagePicker, $ionicHistory) {
  $ionicPlatform.ready(function() {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    if ($stateParams.id) {
      $scope.profId = $stateParams.id;
    }

    $scope.pl = Place;

     //list of added places
     var plc = new Firebase("https://mpf.firebaseio.com/Place");
     plc.orderByChild("userId").equalTo($scope.profId).on("value", function(snapshot) {
       $scope.plcList = snapshot.val();
     })

     $scope.editPlc = function(plcId){
      $state.go('menu.editPlace', { id: plcId}); 
     }

     $scope.delPlc = function(plcId, plcName){
      $rootScope.showConfirm(plcName,plcId);
     }

     $rootScope.showConfirm = function(plcName,plcId) {
        $ionicPopup.confirm({
          title: 'Delete ' + plcName,
          template: 'Are you sure to delete ' + plcName + ' ?'
        })
        .then(function(res) {
          if(res) {
            $scope.del(plcId);
          } else {
          }
        });
      };

      $scope.del = function(id){
        var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
        plcR.remove();
        var ref = new Firebase("https://mpf.firebaseio.com/review");
        ref.orderByChild("placeId").equalTo(id).on("child_added", function(snapshot) {
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

     //name of user
     var prof = new Firebase("https://mpf.firebaseio.com/profile");
     prof.orderByChild("userId").equalTo($scope.profId).on("child_added", function(snapshot) {
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
            $rootScope.notify('Password changed successfully');
            $scope.close();
          } else {
            $rootScope.notify('Error changing password');
          }
        });
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
          $scope.modal.hide();
        };

        $scope.collection = {
          selectedImage : ''
        };

       
          $scope.getImageSaveContact = function() {       
      
          // Image picker will load images according to these settings
            var options = {
              maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
              width: 100,
              height: 100,
              quality: 80            // Higher is better
            };
   
          $cordovaImagePicker.getPictures(options).then(function (results) {
          // Loop through acquired images
              $scope.imgData = results[0];
              window.plugins.Base64.encodeFile($scope.imgData, function(base64){  // Encode URI to Base64 needed for contacts plugin
                $scope.imgData = base64;
                $scope.addContact(results[0]);    // Save contact
              });
              $state.go($state.current, {}, {reload: true});    
          }, function(error) {
            // console.log('Error: ' + JSON.stringify(error));    // In case of error
        });
      };  
    

    $scope.addContact = function(results) {
       $scope.id = user.getAuth().uid;
       var prof = new Firebase("https://mpf.firebaseio.com/profile/");
       prof.orderByChild("userId").equalTo($scope.id).on("child_added", function(snapshot) {
          var key = snapshot.key();
          var profil = new Firebase("https://mpf.firebaseio.com/profile/" + key);
          profil.update({
            pic : results
          });
        })
          $state.go($state.current, {}, {reload: true});  
      }; 
  }) 
})

.controller('adminPlcListCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicPopup, $ionicModal, $ionicHistory, $window, $ionicPlatform) {
  $ionicPlatform.ready(function() {
      if ($stateParams.id) {
        $scope.cat = $stateParams.id;
      }

      
     $scope.pageSize = 2;


      //list of place
    var ref = new Firebase("https://mpf.firebaseio.com/category");
       ref.orderByKey().equalTo($scope.cat).on("child_added", function(snapshot) {
      $scope.asHeader = snapshot.val(); 
    })

       //redirect to place details
   $scope.currState = $ionicHistory.currentStateName();
   $scope.data = function(plcId) {
      if($scope.currState == "adminMenu.list"){
        $state.go('adminMenu.details', { id: plcId });  
      }
      else if($scope.currState == "menu.list"){
        $state.go('menu.details', {id: plcId });
      }
    };

     $scope.places = Place;

     $scope.editPlc = function(plcId){
       $state.go('adminMenu.editPlace', { id: plcId}); 
     }

     $scope.delPlc = function(plcId, plcName){
      $rootScope.showConfirm(plcName,plcId);
     }

     $rootScope.showConfirm = function(plcName,plcId) {
        $ionicPopup.confirm({
          title: 'Delete ' + plcName,
          template: 'Are you sure to delete ' + plcName + ' ?'
        })
        .then(function(res) {
          if(res) {
            $scope.del(plcId);
          } else {
          }
        });
      };

      $scope.del = function(id){
        var plcR = new Firebase("https://mpf.firebaseio.com/Place/"+id);
        plcR.remove();
        $rootScope.notify('Successfully Delete');
      }

      $scope.plcDetails = function(plcId){
        $state.go('menu.details', {id: plcId});
      }
  })
})

.controller('verifyCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place, $ionicHistory, $ionicPlatform) {
  $ionicPlatform.ready(function() {
     $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });

    /*$scope.places = Place;*/
    var user = new Firebase("https://mpf.firebaseio.com");
    $scope.id = user.getAuth().uid;

    $scope.places = Place;

    var ref = new Firebase("https://mpf.firebaseio.com/Place");
    $scope.statuse = {wildcard:false, value: /^pending.*$/};
    var prof = new Firebase("https://mpf.firebaseio.com/profile");
    prof.on("value", function(snapshot){
      $scope.profile = snapshot.val();
    })

   $scope.currState = $ionicHistory.currentStateName();

   $scope.data = function(plcId) {  
      $state.go('adminMenu.details', { id: plcId});            
    };
  })
})

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

 function onRequestSuccess(success){
      // console.log("Successfully requested accuracy: "+success.message);  
    }

    function onRequestFailure(error){
      // console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
      if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
        if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
          cordova.plugins.diagnostic.switchToLocationSettings();
        }
      }  
    }

   function calcDistance(p1, p2) {
      return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
    }

