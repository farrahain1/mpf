angular.module('mpf.controllers', ['firebase', 'ionic-ratings'])
  .controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window',
    function ($scope, $rootScope, $firebaseAuth, $window) {
      $scope.user = {
        email: "",
        password: ""
      };


        $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        var obj = {email: email, password: password};
        console.log(obj); // works correctly

        if (!email || !password) {
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
        console.log("Logged in as:", authData.uid);
        $window.location.href = ('#/menu/browse');
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
              $window.location.href = ('#/menu/adminDash');
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
  console.log("masuk next");
  $rootScope.show("Please wait... Processing");
  $rootScope.checkUser();
  console.log("masuk next");
  $scope.list = [];
  console.log("masuk next");
  var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  console.log("masuk next");
  console.log($ionicHistory.currentStateName());

  /*if($ionicHistory.currentHistoryId() === "ion1"){
    console.log("clear history");
      $ionicHistory.clearHistory();
      console.log($ionicHistory.currentHistoryId());
    }*/
  bucketListRef.on('value', function(snapshot) {
    var data = snapshot.val();
    console.log("masuk next");
    $scope.list = [];
    console.log("masuk next");
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == false) {
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
  $rootScope.hide();

  $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
    $scope.newTemplate = modal;

    
  });

   

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

    $scope.data = function(catId) {
            $state.go('menu.list', { id: catId });
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

.controller('placeCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, Place) {
   /*var placeRef = new Firebase("https://mpf.firebaseio.com/" + $stateParams.id);
    $scope.placeLink = $firebaseArray(placeRef);*/

    $scope.addPlace = true;  
    $scope.addBusiness = true;
  
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

   $scope.model = {
    time1 : new Date()
  };

  $scope.places = Place;

  $scope.addP = function(){
    console.log("add place");
    $scope.places.$add({
      name : this.name,
      phone :  this.phone,
      category: "BC",
      website : this.website
    });
  }

  if ($stateParams.id) {
            $scope.cat = $stateParams.id;
            console.log($scope.cat); //FD
        }

  var ref = new Firebase("https://mpf.firebaseio.com/category");
     ref.orderByKey().equalTo($scope.cat).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    $scope.asHeader = snapshot.val(); 
  })

    

   //untuk digunakan oleh ng-repeat = tentukan berapa kali loop
     //$scope.data = snapshot.key();
     
     //untuk ambik data berdasarkan key $scope.data
     /*$scope.data = snapshot.key();*/
     //console.log($scope.data);

     // })*/

     //console.log($scope.data);
     
/*  $scope.placeWcat = function() {
    console.log("okay");
        //display place berdasarkan selected category 
    if ($stateParams.id) {
            $scope.cat = $stateParams.id;
            console.log($scope.cat);
        }
     var ref = new Firebase("https://mpf.firebaseio.com/Place");
     ref.orderByChild("category").equalTo($scope.cat).on("child_added", function(snapshot) {
    console.log(snapshot.key());    
     })

    /*var data = [{id:(snaphost.key())}];
     $scope.selPlace = data;
     console.log(data);

}*/

        // Do anything you want with the ID inside $scope.yourParam
/*  var catName = $state.params.catName;
  console.log(catName);*/
  /*var bookId = $state.params.bookId;
$scope.book = LSFactory.get(bookId);*/

 $scope.data = function(plcId) {
            console.log(plcId);
            $state.go('menu.details', { id: plcId });
             //$state.go('menu.list'); 
        };

 


})



.controller('editPlaceCtrl', function($rootScope, $scope, $state, $stateParams, $firebaseArray, $firebaseObject, Place) {

  $scope.places = Place;


  if ($stateParams.id) {
            $scope.plcId = $stateParams.id;
            console.log($scope.plcId); 
        }


 
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
     
     $scope.editP = function(){
    console.log("edit place");
    placeDet.update ({
      name: this.data.name,
      phone: this.data.phone,
      website: this.data.website

    });
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

.controller('profileCtrl', function($rootScope, $scope, $window) {
  $scope.edit = function(){
    $window.location.href=('#/menu/editPlace');
  }
})

.controller('menuCtrl', function($rootScope, $scope, $state, $window, $ionicModal, $timeout, $firebaseArray) {
  console.log("inside menuCtrl");

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  /*// Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };*/

  // Open the login modal
  $scope.show = function() {
    $scope.modal.show();
  };

  $scope.goSearch = function(){
    console.log("masuk goSearch");
    $window.location.href = ('#/menu/list');
    //$state.go('menu.list'); 
    $scope.closeSearch();
    //$state.go('menu.placeList'); 
    
  };

   $scope.closeSearch = function() {
    console.log("masuk closeSearch");
    $scope.modal.hide();
  };

   $scope.searchData = function(searchID) {
            searchID = searchID.toLowerCase();
            $state.go('menu.searchResult', { id: searchID });
            // $state.go('menu.profile'); 
             $scope.closeSearch();
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

.controller('detailsCtrl', function($rootScope, $scope, $firebaseAuth, $state, $stateParams, $window, $ionicModal, $timeout, $ionicHistory, Place, review) {
  console.log("inside detailsCtrl");
         

  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();

  if ($stateParams.id) {
            $scope.det = $stateParams.id;
            console.log($scope.det); 
            //console.log($scope.details);
        }

  var ref = new Firebase("https://mpf.firebaseio.com/Place");
  var rev = new Firebase("https://mpf.firebaseio.com/review");
  var user = new Firebase("https://mpf.firebaseio.com");
   $scope.email = user.getAuth().password.email;
  console.log($scope.email);  
  
console.log($scope.det);
  //display details berdasarkan id
     ref.orderByKey().equalTo($scope.det).on("child_added", function(snapshot) {
   console.log(snapshot.val());
   $scope.data = snapshot.val();
   var j = 0;
   $scope.everyday = [];
    if($scope.data.open_days.everyday){
        $scope.everyday[j] = "Everyday";
    }
    else if($scope.data.open_days.notFriday){
      $scope.everyday[j] = "Close on Friday only";
    }
    else if($scope.data.open_days.notSaturday){
      $scope.everyday[j] = "Close on Saturday only";
    }
    else{
      
      
      if($scope.data.open_days.other.monday){
        $scope.everyday[j] = "Monday";
        j++;
      }
      if($scope.data.open_days.other.tuesday){
        $scope.everyday[j] = "Tuesday";
        j++;
      }
      if($scope.data.open_days.other.wednesday){
        $scope.everyday[j] = "Wednesday";
        j++;
      }
      if($scope.data.open_days.other.thursday){
        $scope.everyday[j] = "Thursday";
        j++;
      }
      if($scope.data.open_days.other.friday){
        $scope.everyday[j] = "Friday";
        j++;
      }
      if($scope.data.open_days.other.saturday){
        $scope.everyday[j] = "Saturday";
        j++;
      }
      if($scope.data.open_days.other.sunday){
        $scope.everyday[j] = "Sunday";
        j++;
      }
    }
    /*console.log("key : " + snapshot.key());  */
  })
     

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
            overallStar : $scope.ave
          });
        }
     
      }); //penutup angular ForEach
      console.log(i);
      $scope.rankV = rateTotal/i;
      console.log(rateTotal);
      if($scope.rankV){
        console.log("masuk sini");
       placeStar.update ({
            rankVal: $scope.rankV
          });
      }

      ///// end rating /////


     

    })
 // }

  
      

  $scope.addRate = function(index, rating){
    if($scope.rate != null){
      //$rootScope.checkUser();
      /*console.log("add review : " + email);*/
      if(this.message!=null){
         $scope.reviews.$add({
        placeId: $scope.det,
        message : this.message,
        user : $scope.email,
        rating: $scope.rate
      });
      }
      else {
         $scope.reviews.$add({
        placeId: $scope.det,
        user : $scope.email,
        rating: $scope.rate
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
        rating:  2,
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

  



     
    
/*  $scope.rating = {};
  $scope.rating.rate = 0;
  $scope.rating.max = 5;*/

   

})






function escapeEmailAddress(email) {
  if (!email) return false
  // Replace '.' (not allowed in a Firebase key) with ','
  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email.trim();
}
/*CRUD*/
