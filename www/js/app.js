// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mpf', ['ionic', 'firebase', 'mpf.controllers', 'ngCordova'])
/*.value('fbURL', 'https://mpf.firebaseio.com/')
.factory('Place', function (fbURL, $firebaseArray) {
    return $firebaseArray(new Firebase(fbURL));
  })*/
  .factory("Place", function($firebaseArray) {
  var placeRef = new Firebase("https://mpf.firebaseio.com/Place");
  return $firebaseArray(placeRef);
})

  .factory("category", function($firebaseArray) {
  var catRef = new Firebase("https://mpf.firebaseio.com/category");
  return $firebaseArray(catRef);
})

  .factory("review", function($firebaseArray) {
  var revRef = new Firebase("https://mpf.firebaseio.com/review");
  return $firebaseArray(revRef);
})

   .factory("userD", function($firebaseArray) {
  var uRef = new Firebase("https://mpf.firebaseio.com/userD");
  return $firebaseArray(uRef);
})

   .factory("profile", function($firebaseArray) {
  var prof = new Firebase("https://mpf.firebaseio.com/profile");
  return $firebaseArray(prof);
})

.factory("auth", function($firebaseAuth) {
  var auth = new Firebase("https://mpf.firebaseio.com/");
  return $firebaseAuth(auth);
})



.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading, $ionicPopup, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.userEmail = null;
    $rootScope.baseUrl = 'https://mpf.firebaseio.com/';
    var authRef = new Firebase($rootScope.baseUrl);
    $rootScope.auth = $firebaseAuth(authRef);

    $rootScope.show = function(text) {
      //$ionicLoading.show('fsdkjfjdk');
      $ionicLoading.show({
          template: text
        });
      /*$rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });*/
    };

    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };



          
         

    $rootScope.logout = function() {
      
       $rootScope.auth.$unauth();
      $rootScope.checkUser();
     
    };

    $rootScope.back = function(){
    console.log("masuk back");    
    window.history.back();      
   }

    $rootScope.checkUser = function(){
      console.log("check user id");
      var ref = new Firebase("https://mpf.firebaseio.com");
      var authData = ref.getAuth();
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
        $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
      }
    };

     $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
     // We can catch the error thrown when the $requireAuth promise is rejected
     // and redirect the user back to the login page
     console.log(error);
     if(error === "AUTH_REQUIRED") {
        $rootScope.notify('You need to login first');
         $state.go("auth.signin");
     }
  });

    

    /*$rootScope.checkSession = function() {
      console.log("checkSession");
      
      var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        if (error) {
          // no action yet.. redirect to default route
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        } else if (user) {
          // user authenticated with Firebase  
          console.log(user.email);
          $rootScope.userEmail = user.email; 
          console.log("moshi mo");       
          $window.location.href = ('#/menu/browse');
        } else {
          // user is logged out
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        }
      });
    }*/

  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(geo):/);
  $stateProvider
     // Routes will be here
      // Set defualt view of our app to home
     .state('auth', {
      url: "/auth",
      abstract: true,
      templateUrl: "templates/auth.html"
    })
    .state('auth.signin', {
      url: '/signin',
      views: {
        'auth-signin': {
          templateUrl: 'templates/auth-signin.html',
          controller: 'SignInCtrl'
        }
      }
    })
    .state('auth.signup', {
      url: '/signup',
      views: {
        'auth-signup': {
          templateUrl: 'templates/auth-signup.html',
          controller: 'SignUpCtrl'
        }
      }
    })
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'menuCtrl'
    })

    .state('menu.browse', {
      url: '/browse',
      views: {
        'menu-browse': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

    .state('menu.list', {
      url: '/list/:id',
      views: {
        'menu-browse': {
          templateUrl: 'templates/placeList.html',
          controller: 'placeCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

    .state('menu.details', {
      url: '/details/:id',
      views: {
        'menu-browse': {
          templateUrl: 'templates/placeDetails.html',
          controller: 'detailsCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

    

    /*.state('menu.search', {
      url: '/search',
      views: {
        'menu-search': {
          templateUrl: 'templates/search.html',
          controller: 'menuCtrl'
        }
      }
    })*/

    .state('menu.searchResult', {
      url: '/searchResult/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/searchResult.html',
          controller: 'resultCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

    .state('menu.navigate', {
      url: '/navigate',
      views: {
        'menu-navigate': {
          templateUrl: 'templates/navigate.html'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

     .state('menu.rate', {
      url: '/rate',
      views: {
        'menu-rate': {
          templateUrl: 'templates/addRate.html',
          controller: 'detailsCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

      .state('menu.listReview', {
      url: '/review',
      views: {
        'menu-review': {
          templateUrl: 'templates/listReview.html'
        }
      }
    })

     .state('menu.addPlace', {
      url: '/addPlace',
      views: {
        'menuPlace': {
          templateUrl: 'templates/addPlace.html',
          controller: 'addPlaceCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

     .state('menu.editPlace', {
      url: '/editPlace/:id',
      views: {
        'menuProfile': {
          templateUrl: 'templates/editPlace.html',
          controller: 'editPlaceCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

     .state('menu.profile', {
      url: '/profile/:id',
      views: {
        'menuProfile': {
          templateUrl: 'templates/profile.html',
          controller: 'profileCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

     .state('adminMenu', {
      url: "/adminMenu",
      abstract: true,
      templateUrl: "templates/adminMenu.html"
    })

     .state('adminMenu.verify', {
      url: '/verify',
      views: {
        'adminMenu-verify': {
          templateUrl: 'templates/verify.html',
          controller: 'verifyCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

     .state('adminMenu.addPlace', {
      url: '/addPlace',
      views: {
        'adminMenu-addPlace': {
          templateUrl: 'templates/addPlace.html',
          controller: 'addPlaceCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

         .state('adminMenu.browse', {
      url: '/browse',
      views: {
        'adminMenu-mngPlc': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

      .state('adminMenu.details', {
      url: '/details/:id',
      views: {
        'adminMenu-mngPlc': {
          templateUrl: 'templates/placeDetails.html',
          controller: 'detailsCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

        .state('adminMenu.list', {
      url: '/list/:id',
      views: {
        'adminMenu-mngPlc': {
          templateUrl: 'templates/placeList.html',
          controller: 'adminPlcListCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

         .state('adminMenu.editPlace', {
      url: '/editPlace/:id',
      views: {
        'adminMenu-mngPlc': {
          templateUrl: 'templates/editPlace.html',
          controller: 'editPlaceCtrl'
        }
      },
      resolve : {
         // controller will not be loaded until $waitForAuth resolves
         // Auth refers to our $firebaseAuth wrapper in the example above
         currentAuth: ["auth", function(Auth) {
           // $waitForAuth returns a promise so the resolve waits for it to complete
           return Auth.$requireAuth();
         }]
       }
    })

      /*   .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });*/

    

    /*.state('menu.placeList', {
      url: '/placeList',
      views: {
        'placeList':{
          templateUrl: 'templates/placeList.html'
        }
      }
          
    })*/

   
    $urlRouterProvider.otherwise('/auth/signin');
});

