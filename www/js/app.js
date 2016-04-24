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



.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading, $ionicPopup, $state, $ionicHistory) {
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

    document.addEventListener("backbutton", function(e){
       if($.mobile.activePage.is('#auth-signin')){
           e.preventDefault();
           navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory()
       }
    }, false);

    $rootScope.checkConnection = function(){
      var networkState = navigator.connection.type;

      if(networkState == Connection.NONE){
        alert('This apps need a network connection');
        navigator.app.exitApp();
      }
    }

    // $rootScope.setTitle = function(title){
    //   $rootScope.title = title;
    // }

    document.addEventListener("offline", onOffline, false);

    function onOffline() {
        $rootScope.$apply(function(){
             alert('You are offline. Please have a connection to continue using this apps.');
        });
    }

    $rootScope.userEmail = null;
    $rootScope.baseUrl = 'https://mpf.firebaseio.com/';
    var authRef = new Firebase($rootScope.baseUrl);
    $rootScope.auth = $firebaseAuth(authRef);

    $rootScope.show = function(text) {
      $ionicLoading.show({
          template: text
        });
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
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
       $rootScope.auth.$unauth();
      $rootScope.checkUser();
      $state.go($state.current, {}, {reload: true});     
    };

    $rootScope.back = function(){
      window.history.back();      
   }

    $rootScope.checkUser = function(){
      var ref = new Firebase("https://mpf.firebaseio.com");
      var authData = ref.getAuth();
      if (!authData) {
        $rootScope.userEmail = null;
        $window.location.href = '#/auth/signin';
      }
      else{
          if(authData.uid == '1f198755-1dcf-4ae7-9051-82dd65b4eb3c'){
            $window.location.href = '#/adminMenu/verify';   
          }
          else{
            $window.location.href = '#/menu/browse';   
          }
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
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(geo):/);
  $ionicConfigProvider.tabs.position('bottom');

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
      cache : false,
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

    .state('menu.searchResult', {
      url: '/searchResult/:id',
      views: {
        'menu-browse': {
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
      cache : false,
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
      cache : false,
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
      cache : false,
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
      cache: false,
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
      cache : false,
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
      cache : false,
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
   
    $urlRouterProvider.otherwise('/auth/signin');
});

