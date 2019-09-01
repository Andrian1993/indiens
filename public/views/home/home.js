'use strict';

var app = angular.module('Indiens.home', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('home', {
            parent: 'root',
            url: '/home',
            ncyBreadcrumb: {
                label: '인디언즈'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/home/home.html',
                    controllerAs: 'vm',
                    controller: homeController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('home.certificate', {
            url: '/certificate',
            ncyBreadcrumb: {
                label: 'FAQ'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/signIn/certification.html',
                    controllerAs: 'vm',
                    controller: certificateController
                }
            }
        })
        .state('home.ques', {
            url: '/ques',
            ncyBreadcrumb: {
                label: 'FAQ'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/home/ques.html',
                    // controllerAs: 'vm',
                    // controller: homeController
                }
            }
         })
        .state('home.company', {
            url: '/Company',
            ncyBreadcrumb: {
                label: 'Company'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/home/company.html',
                    // controllerAs: 'vm',
                    // controller: homeController
                }
            }
        })
        .state('resetPasswd', {
            parent: 'root',
            url: '/resetPasswd/:id',
            ncyBreadcrumb: {
                label: '비밀번호 재설정'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/home/resetPasswd.html',
                    controllerAs: 'vm',
                    controller: resetPasswdController
                }
            }
        })
        .state('Terms2', {
            url: '/Terms2',
            templateUrl: 'views/mobile/Terms.html'
        })
        .state('Privacy2', {
            url: '/Privacy2',
            templateUrl: 'views/mobile/Privacy.html'
        });
});
function homeController($scope, $log, $state, $mdDialog, $mdMedia, $cookies, authService, helperService, homeService, $rootScope, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    angular.extend(vm, {
        loginPop: fnlogin,
        joinPop: fnjoin,
        logout: authService.logout,
        signup: fnSignup,
        question: fnQuest,
        member_type: member_type,
        findPartner: fnFindPartner,
        findProject: fnFindProject,
        new: fnNew,
        getProject: fnGetProject
    });

    function activate() {
        // helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'memberService', 'resolveValue', joinPopController], 'partials/dialog/signup.html', false, null); // TODO: 테스트용
        fnSearch();
        fnPoup();
    }

    function fnSearch() { // 첫화면 통계
        return homeService.getProjectsHome().then(function (data) {
            vm.data = data;
        });
    }


    function fnPoup() {
        // Lightbox.openModal('http://192.168.1.10:8084/attach/q47ca7oj44zx6jm.jpg', index);
        var main_popup_yn = $cookies.get('main_popup_yn');
        // $log.log('main_popup_yn', main_popup_yn);
        if (main_popup_yn && main_popup_yn == 'N') return;

            // $log.log('메인팝업', data);


        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            // controller: DialogController,
            controller: ['$scope', '$mdDialog', '$log', 'helperService', '$q', '$rootScope', '$state', '$cookies', '$sce', mainPopupController],
            templateUrl: 'views/dialog/startDialog.html',
            // template: 'dfsfdfsd',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            /*resolve: {
                popup: function () {
                    return data;
                }
            }*/
        });


    }

    function fnFindPartner(MEM_TYPE) {
        $state.go('Partner', {
            MEM_TYPE: MEM_TYPE
        });
    }

    function fnFindProject(PJT_NAME) {
        $state.go('Project', {
            PJT_NAME: PJT_NAME
        });
    }

    function fnGetProject(PJT_ID) {
        $state.go('Project.detail', {
            id: PJT_ID
        });
    }

    function fnNew() {

    }

    function fnQuest() {
        $state.go('Questions');
    }

    // 로그인 팝업화면과 컨트롤러를 연결해준다.
    function fnlogin() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', loginPopController], 'views/dialog/home_login.html');
    }

    // 회원가입 팝업
    function fnjoin() {
        $rootScope.NewUser = null;
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'helperService', '$window', certPopController], 'partials/dialog/certification.html', false, null);
    }

        function fnSignup(data) {
            /*data = {
                NAME: '송효섭',
                DOB: '19740425',
                SEX: 1
            };*/

            var user = {
                MEM_NAME: data['NAME'],
                MEM_SEX: data['SEX']
            // MEM_SEX: (data['SEX'] == '1' ? 'M' : 'F')
        };

        if ($rootScope.NewUser) { // 카카오톡 회원가입일 경우 추가정보
            user['MEM_SNS'] = $rootScope.NewUser['MEM_SNS'];
            user['MEM_NICK'] = $rootScope.NewUser['MEM_NICK'];
            user['MEM_IMG'] = $rootScope.NewUser['MEM_IMG'];
        }

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'memberService', 'resolveValue', joinPopController], 'partials/dialog/signup.html', false, user);
    }
}

function mainPopupController($scope, $mdDialog, $log, helperService, $q, $rootScope, $state, $cookies, $sce) {
    // $scope.comment = angular.copy(popup);
    // $scope.popup = popup;
    // if (popup.gubun == 'H' && popup.content) $scope.popup.content = $sce.trustAsHtml(popup.content); // html 표시

    $scope.confirm = function () {
            var todayDate = new Date();
            todayDate.setDate(todayDate.getDate() + 1);
            $cookies.put('main_popup_yn', 'N', {expires: todayDate.toGMTString()});

        $mdDialog.cancel();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.fnDetail = function () {
        window.open(popup.target_url, 'mainPopUp');
        $log.log('자세히 보기');
    };
}

function certificateController($scope, $log, $state, $mdDialog, $mdMedia, authService, helperService, homeService, $rootScope) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    angular.extend(vm, {
        certification: fnCertification
    });

    function activate() {
        // helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'memberService', 'resolveValue', joinPopController], 'partials/dialog/signup.html', false, null); // TODO: 테스트용
        // fnSearch();
    }

    function fnCertification() { // 첫화면 통계
        $state.go('SignIn');
    }

    function fnQuest() {
        $state.go('Questions');
    }

    // 로그인 팝업화면과 컨트롤러를 연결해준다.
    function fnlogin() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', loginPopController], 'views/dialog/home_login.html');
    }

    // 회원가입 팝업
    function fnjoin() {
        $rootScope.NewUser = null;
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'helperService', '$window', certPopController], 'partials/dialog/certification.html', false, null);
    }

    function fnSignup(data) {
        /*data = {
            NAME: '송효섭',
            DOB: '19740425',
            SEX: 1
        };*/

        var user = {
            MEM_NAME: data['NAME'],
            MEM_SEX: data['SEX']
            // MEM_SEX: (data['SEX'] == '1' ? 'M' : 'F')
        };

        if ($rootScope.NewUser) { // 카카오톡 회원가입일 경우 추가정보
            user['MEM_SNS'] = $rootScope.NewUser['MEM_SNS'];
            user['MEM_NICK'] = $rootScope.NewUser['MEM_NICK'];
            user['MEM_IMG'] = $rootScope.NewUser['MEM_IMG'];
        }

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'memberService', 'resolveValue', joinPopController], 'partials/dialog/signup.html', false, user);
    }
}


function certPopController($scope, $mdDialog, $log, $rootScope, $state, helperService, $window) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    angular.extend(vm, {
        cancel: fnCancel,
        certification: fnCertification
    });

    function activate() {

    }

    function fnCertification() {
        fnCancel();
        // $window.open('https://yonghada.co.kr/danal/Ready.jsp', 'danal', 'width=600px,height=800px,location=0,menubar=0,resizable=0,scrollbars=0,toolbar=0');
        $window.open('/danal/Ready.jsp', 'danal', 'width=600px,height=800px,location=0,menubar=0,resizable=0,scrollbars=0,toolbar=0');
        // $window.open('test1.html', 'danal', 'width=600px,height=800px,location=0,menubar=0,resizable=0,scrollbars=0,toolbar=0');
    }

    function fnCancel() {
        $mdDialog.cancel();
    }
}

function signUp(user) {
    angular.element(document.getElementById('divTop')).scope().vm.signup(user);
}

function resetPasswdController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, memberService) {
    var vm = this, scope = $scope;
    var id;

    angular.extend(vm, {
        confirm: fnConfirm,
        cancel: cancel,
        inputErrors: {confirmPassword: false}
    });

    vm.$onInit = activate;

    function activate() {
        id = $state.params.id;
        // alert(id);
        fnSearch();
    }

    function fnSearch() {
        return memberService.findResetPwd({id: id}).then(function (data) {
            vm.data = data;
        });
    }

    function fnConfirm() {
        if (!scope.inputForm.$valid) {
            $log.log('입력에러', scope.inputForm.$error);
            vm.showError = true;

            var dialog = helperService.getDialog('입력 항목을 확인해 주시기 바랍니다.');

            $mdDialog.show(dialog).then(function (result) {
            });

            return;
        }

        if (vm.data.MEM_PASS != vm.data.confirm_password) {
            vm.inputErrors.confirmPassword = true;
            // helperService.mdToast('비밀번호와 비밀번호 확인이 일치하지 않습니다');
            return;
        } else {
            vm.inputErrors.confirmPassword = false;
        }

        $mdDialog.show(helperService.confirmDialog('비밀번호를 변경 하시겠습니까?')).then(function () {
            memberService.resetPwd(vm.data).then(function (result) {
                if (result.code == 200) {
                    $mdDialog.show(helperService.getDialog('변경된 비밀번호로 로그인 해주시기 바랍니다.')).then(function (result) {
                        cancel();
                    });
                } else {
                    var dialog = helperService.getDialog(result.message);
                    $mdDialog.show(dialog).then(function (result) {
                    });
                }
            });
        });
    }

    function cancel() {
        $state.go('home');
    }
}
