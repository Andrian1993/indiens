/* global angular */
(function () {
    'use strict';

    var app = angular.module('authService', []);

    app.factory('authService', authService);

    function authService($log, $rootScope, $state, $q, Restangular, $http, $location, $mdDialog, helperService, $window) {
        var baseUrl = Restangular.all('TB_MEMBER');
        var service = {
            prevState: null,
            prevParams: null,
            currentUser: null,
            parent: this, // TODO : 테스트(로그아웃후 탭을 닫지않고 인증이 필요한 주소를 입력하면 다시 로그인이 된것으로 인식된다

            getCurUser: function () { // TODO: parent를 사용할 경우 외부에서 접근이 되지 않아 추가
                return parent.currentUser;
            },
            setCurUser: function (data) {
                console.log('이름세팅');
                //// 이름 변경시 변경된 이름 세팅
                parent.currentUser.MKR_NAME = data.MKR_NAME;
                console.log(parent.currentUser);
                return parent.currentUser;
            },

            fb: function () {
                console.log('11');
                Restangular.all('survey').one('facebook').get().then(function (response) {
                    console.log('22');
                    console.log(response);
                });
            },

            isLoggedIn: function () {// TODO : 추가
                service.state($state.current, $state.params);
                return !!parent.currentUser;
            },

            // TODO : 파트너/관리자 여부 확인 필요
            /*loggedIn: function (options) {
                var def = $q.defer();

                if (service.isLoggedIn()) {
                    console.log('로그인상태');
                    def.resolve(service.isLoggedIn);
                } else {
                    // Restangular.setFullResponse(true); IE에서 로그인후 새로고침 하면 current-user 주소에서 정보를 가져오지 못해 로그인 안된 상태가 됨
                    Restangular.one('/').customGET('current-user').then(function (response) {
                        parent.currentUser = response.user;

                        if (service.isLoggedIn()) {
                            def.resolve();
                        } else {
                            def.reject();
                            if (options && options.redirect) {
                                $log.log('로그인이 필요한 화면 !!!');
                                $state.go('home', {login: true});
                                helperService.login();
                            }
                        }
                    }, function () {
                        def.reject();
                    });
                }

                return def.promise;
            },*/

            loggedIn: function (options) {
                var def = $q.defer();

                if (service.isLoggedIn()) {
                    $log.log('loggedIn() : 이미 로그인 됨');
                    def.resolve(service.isLoggedIn);
                } else {
                    /*$http.get('current-user', { // TODO : 주소 수정함
                     ignoreAuthModule: true
                     ,cache: false
                     })*/

                    // Restangular.setFullResponse(true); IE에서 로그인후 새로고침 하면 current-user 주소에서 정보를 가져오지 못해 로그인 안된 상태가 됨
                    Restangular.one('/').customGET('current-user').then(function (response) {
                        // $log.log('authService -> loggedIn', response.data.user);
                        // parent.currentUser = response.data.user; // TODO : 추가

                        parent.currentUser = response.user;

                        // if(response.data.user) debugger;
                        if (service.isLoggedIn()) {
                            def.resolve();
                        } else {
                            def.reject();

                            // options.redirect 파라메터 값이 설정된 경우 /login 페이지로 리다이랙트
                            if (options && options.redirect) {
                                // $state.go('login');
                                /*                                    var dialog = helperService.getDialog('로그인 후 이용 가능합니다.');

                                 $mdDialog.show(dialog).then(function (result) {
                                 $state.go('login');
                                 });*/
                                helperService.goLogin();
                            }
                        }
                    }, function () {
                        def.reject();
                    });
                }

                return def.promise;
            },


            login: function (credentials, remember) {
                // console.log(credentials);
                /*               credentials.email = credentials.username;
                               credentials.username = null;*/
                // return $http.post('http://logmap.co.kr/api/login', credentials, // TODO : url 수정
                return $http.post('/login', credentials, // TODO : url 수정
                    {
                        params: {remember: remember},
                        ignoreAuthModule: true
                    })
                    .then(loginComplete)
                    .catch(loginCallFailed);

                function loginComplete(response) {
                    $rootScope.currentuser = response.data.user;
                    parent.currentUser = response.data.user; // TODO : 추가
                    $rootScope.firstLogin = true;
                    // if (response.data.TYPE = 'maker') {
                    $mdDialog.cancel();
                    // parent.currentUser = response.data.user;
                    console.log(response.data);
                    // $scope.$apply();
                    $state.go('home');
                    // }
                    // else if (response.data.TYPE = 'maker_join') $state.go('store');
                    // else $state.go('/member');
                    return;
                }

                function loginCallFailed(error) {
                    console.log('로그인 실패!');
                    console.log(error);
                    alert(error.data.message);
                    // alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                    return $q.reject(error.data);
                }
            },

            login2: function (credentials, loginComplete, loginCallFailed) { // 카카오 로그인
                return $http.post('/login', credentials, // TODO : url 수정
                    {
                        // params: {remember: remember},
                        ignoreAuthModule: true
                    })
                    .then(function (response) {
                        parent.currentUser = response.data.user; // TODO : 추가
                        $rootScope.firstLogin = true;
                        $mdDialog.hide();
                        $state.go('home');
                        // loginComplete();
                    })
                    .catch(loginCallFailed);

                function loginCallFailed(error) {
                    console.log('카카오 로그인 로그인 실패!');
                    console.log(error);
                    // alert(error.data.message);
                    alert('가입된 회원이 아닙니다.');
                    // alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                    return $q.reject(error.data);
                }
            },

            logout: function (vm) {
                $rootScope.currentuser = null;
                vm.currentUser = null;
                return $http.post('/logout').then(logoutComplete).catch(service.callFailed);

                function logoutComplete() {
                    parent.currentUser = null; // TODO : 추가
                    // $state.reload();
                    // $state.go('home');

                    /*var promiseGoHome = function () {
                        return new Promise(function (resolve, reject) {
                            $state.go('home');
                            resolve();
                        });
                    };

                    promiseGoHome().then(function (results) {
                        $window.location.reload();
                    });*/

                    // setTimeout($window.location.reload(), 5000);

                    $state.go('home');

                    setInterval(function () {
                        $window.location.reload();
                    }, 100);


                    // $window.location.reload();

                    return;
                }
            },

            state: function (state, params) {
                if (state.name !== 'login') {
                    service.prevState = state.name;
                    service.prevParams = params;
                }
            },


            saveData: function (member) {
                return baseUrl.post(member).then(saveDataComplete).catch(callFailed);

                function saveDataComplete(response) {
                    return response;
                }
            }
        };

        return service;
    }

    function callFailed(error) {
        // $log.log(error);
        alert(error.status + '\n' + error.data.message + '\n' + error.data);
        // return exception.catcher(error);
    }
}());
