'use strict';
//https://accounts.google.com/signin/oauth/oauthchooseaccount?client_id=554975368930-qleikak2bcvugre9n9aism2ikcacrtk0.apps.googleusercontent.com&as=kRfFredmQ1o8WAZR7jI5hg&destination=https%3A%2F%2Fdefinitelylastmavenproject.appspot.com&approval_state=!ChRGTUNrUzVReEJGMXktbFFxbkdVbBIfVXd2RzV4ZXZVT0FVb1Bud0gtVkU1UUZHMnk5R0d4WQ%E2%88%99ACThZt4AAAAAWo20kd80DcdaKybhPDrsrwQ5vDXOpKMt&xsrfsig=AHgIfE_diMldZy-fgm2FoNiiFWqzPm7_dQ&flowName=GeneralOAuthFlow
//https://accounts.google.com/o/oauth2/auth?response_type=permission%20id_token%20code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20profile&openid.realm=&include_granted_scopes=true&redirect_uri=storagerelay%3A%2F%2Fhttps%2Fmarchenkosconference.appspot.com%3Fid%3Dauth411072&client_id=554975368930-qleikak2bcvugre9n9aism2ikcacrtk0.apps.googleusercontent.com&ss_domain=https%3A%2F%2Fmarchenkosconference.appspot.com&gsiwebsdk=shim&access_type=offline
	/**
 * @ngdoc object
 * @name conferenceApp
 * @requires $routeProvider
 * @requires conferenceControllers
 * @requires ui.bootstrap
 *
 * @description
 * Root app, which routes and specifies the partial html and controller depending on the url requested.
 *
 */
var app = angular.module('conferenceApp',
    ['conferenceControllers', 'ngRoute', 'ui.bootstrap']).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/conference', {
                    templateUrl: '/partials/show_conferences.html',
                    controller: 'ShowConferenceCtrl'
                }).
                when('/conference/create', {
                    templateUrl: '/partials/create_conferences.html',
                    controller: 'CreateConferenceCtrl'
                }).
                when('/conference/detail/:websafeConferenceKey', {
                    templateUrl: '/partials/conference_detail.html',
                    controller: 'ConferenceDetailCtrl'
                }).
                when('/profile', {
                    templateUrl: '/partials/profile.html',
                    controller: 'MyProfileCtrl'
                }).
                when('/', {
                    templateUrl: '/partials/home.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

/**
 * @ngdoc filter
 * @name startFrom
 *
 * @description
 * A filter that extracts an array from the specific index.
 *
 */
app.filter('startFrom', function () {
    /**
     * Extracts an array from the specific index.
     *
     * @param {Array} data
     * @param {Integer} start
     * @returns {Array|*}
     */
    var filter = function (data, start) {
        return data.slice(start);
    }
    return filter;
});


/**
 * @ngdoc constant
 * @name HTTP_ERRORS
 *
 * @description
 * Holds the constants that represent HTTP error codes.
 *
 */
app.constant('HTTP_ERRORS', {
    'UNAUTHORIZED': 401
});


/**
 * @ngdoc service
 * @name oauth2Provider
 *
 * @description
 * Service that holds the OAuth2 information shared across all the pages.
 *
 */
app.factory('oauth2Provider', function ($modal) {
    var oauth2Provider = {
        CLIENT_ID: '1018741829525-4pi0kg9a6ssdr1l28nebvqmqfl6vmb65.apps.googleusercontent.com',
        SCOPES: 'https://www.googleapis.com/auth/userinfo.email profile',
        signedIn: false
    };

    /**
     * Calls the OAuth2 authentication method.
     */
    oauth2Provider.signIn = function (callback) {
        gapi.auth.signIn({
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'online',
            'approveprompt': 'auto',
            'scope': oauth2Provider.SCOPES,
            'callback': callback
        });
    };

    /**
     * Logs out the user.
     */
    oauth2Provider.signOut = function () {
        gapi.auth.signOut();
        // Explicitly set the invalid access token in order to make the API calls fail.
        gapi.auth.setToken({access_token: ''})
        oauth2Provider.signedIn = false;
    };

    /**
     * Shows the modal with Google+ sign in button.
     *
     * @returns {*|Window}
     */
    oauth2Provider.showLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/login.modal.html',
            controller: 'OAuth2LoginModalCtrl'
        });
        return modalInstance;
    };

    return oauth2Provider;
});