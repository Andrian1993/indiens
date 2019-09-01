'use strict';

var app = angular.module('Indiens.login', []);

//로그인 컨트롤러----------------------
function loginPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        vm.login = {};
    }

    var user = {gubun: 1};
    // var user = {gubun: 1, email: 'songlife@hellobiz.kr', password: '1234'};

    //이곳에 함수들을 정의해둬야, 외부에서 접근할 수 있음.
    angular.extend(vm, {
        loginReal: fnRealLogin,
        cancel: fnCancel,
        findEmail: fnFindEmail,
        resetPwd: fnResetPwd,
        credentials: user,
        goSign: fnGoSign
    });

    // 로그인 함수
    function fnRealLogin() {
        console.log("******** 로그인 함수 호출 **************");
        console.log("******** email : " + vm.credentials.email + ", password : " + vm.credentials.password);

        if (vm.credentials.email.length == 0) {
            console.log("******** 이메일을 입력해야 합니다")
        } else if (vm.credentials.password.length == 0) {
            console.log("******** 비밀번호를 입력해야 합니다")
        } else {

            authService.login(vm.credentials, vm.remember)
                .catch(function (data) {
                    vm.credentials.password = '';
                    if (data.message) {

                        // console.log("********  data.message : " + data.message);
                        vm.error = data.message;
                        // vm.error = '아이디 또는 비밀번호가 일치하지 않습니다.!';
                    } else {
                        vm.error = '로그인 처리에 실패 하였습니다.';
                    }
                });
        }

    }

    // 아이디찾기 팝업
    function fnFindEmail() {
        /*$mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', findIdPopController],
            templateUrl: 'partials/dialog/findId.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen,
            controllerAs: 'vm',
            resolve: {}
        }).then(function (result) {
        });*/
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'memberService', findEmailPopController], 'views/dialog/findEmail.html');
    }

    // 비밀번호 재설정 팝업
    function fnResetPwd() {
        /*$mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', resetPwdPopController],
            templateUrl: 'partials/dialog/resetPasswd.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen,
            controllerAs: 'vm',
            resolve: {}
        }).then(function (result) {
        });*/
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'memberService', resetPwdPopController], 'views/dialog/resetPasswd.html');
    }

    function fnGoSign() {
        $mdDialog.hide();
        $state.go('SignIn');
    }

    //취소 이벤트
    function fnCancel() {
        $mdDialog.cancel();
    }
}

//회원가입 컨트롤러
function joinPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, memberService, user) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        /*vm.user = {
            MEM_UID: 'hyoseop',
            MEM_NAME: '송효섭',
            MEM_NICK: '효섭',
            MEM_AGE: '45',
            MEM_TEL: '01012345678',
            MEM_PASS: '1',
            confirm_password: '1',
            MEM_SEX: 'M',
            chk1: 'Y',
            chk2: 'Y'
        }*/
        if (user) vm.user = user;
    }

    angular.extend(vm, {
        selected: [],
        toggle: toggle,
        isChecked: isChecked,
        toggleAll: toggleAll,
        exists: exists,
        cancel: cancel,
        signUp: signUp,
        inputErrors: {}
    });

    function toggle(item) {
        var idx = vm.selected.indexOf(item);
        if (idx > -1) {
            vm.selected.splice(idx, 1);
        } else {
            vm.selected.push(item);
        }
    }

    function signUp() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            // var dialog = helperService.getDialog('입력 항목을 확인해 주시기 바랍니다.');
            // $mdDialog.show(dialog).then(function (result) {});
            return;
        }

        if (vm.user.MEM_PASS != vm.user.confirm_password) {
            vm.inputErrors.confirmPassword = true;
            helperService.mdToast('비밀번호와 비밀번호 확인이 일치하지 않습니다');
            /*var dialog = helperService.getDialog('비밀번호와 비밀번호 확인이 일치하지 않습니다');

            $mdDialog.show(dialog).then(function (result) {
                scope.userForm['confirm_password'].$$element.focus();
            });*/

            return;
        } else {
            vm.inputErrors.confirmPassword = false;
        }

        // $log.log('회원가입', vm.user);

        memberService.signup(vm.user).then(function (result) {
            if (result.code == 200) {
                helperService.mdDialog('용하다 서비스에 가입되었습니다. 로그인해 주시기 바랍니다.');
                $mdDialog.hide();
                $state.go('Home');
            } else {
                // helperService.mdToast(result.message);
                helperService.mdDialog(result.message);
            }
        });
    }

    function isChecked() {
        return vm.selected.length === itemsObject.length;
    }

    function toggleAll() {
        var l1 = vm.selected.length, l2 = itemsObject.length;
        if (l1 === l2) {
            vm.selected.splice(0, l1);
        } else if (l1 === 0 || l1 > 0) {
            //First we need to empty array, because we are using push to fill in array
            vm.selected.splice(0, l2);
            // itemsObject.forEach(y => vm.selected.push(y));

            itemsObject.forEach(function(element) {
                vm.selected.push(element);
            });
        }
    }

    function exists(item) {
        return vm.selected.indexOf(item) > -1;
    }

    function cancel() {
        $mdDialog.cancel();
    }
}

function findEmailPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, memberService) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {

    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.cancel();
        }
    });

    function fnConfirm() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        memberService.findEmail(vm.user).then(function (result) {
            if (result && result["MEM_EMAIL"]) {
                var user = {
                    MEM_NAME: vm.user.MEM_NAME,
                    MEM_EMAIL: result["MEM_EMAIL"]
                };

                helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'memberService', 'resolveValue', findIdResultController], 'views/dialog/findIdResult.html', false, user);
            } else {
                var dialog = helperService.getDialog('해당하는 아이디를 찾을수 없습니다.');
                dialog.multiple(true);
                $mdDialog.show(dialog).then(function (result) {
                });
            }
        });
    }
}

function findIdResultController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, memberService, user) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        vm.user = user;
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        cancel: function () {
            $mdDialog.cancel();
        }
    });

    function fnConfirm() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', loginPopController], 'views/dialog/home_login.html');
        // helperService.login();
    }
}

function resetPwdPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, memberService) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        /*vm.user = {
            MEM_UID: 'hyoseop',
            MEM_TEL: '123',
            MEM_PASS: '1',
            confirm_password: '1'
        }*/
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        inputErrors: {},
        cancel: function () {
            $mdDialog.cancel();
        },
        close: fnClose
    });

    function fnClose() {
        $mdDialog.hide();
    }

    function fnConfirm() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        if (vm.user.MEM_PASS != vm.user.confirm_password) {
            vm.inputErrors.confirmPassword = true;
            helperService.mdToast('비밀번호와 비밀번호 확인이 일치하지 않습니다');
            return;
        } else {
            vm.inputErrors.confirmPassword = false;
        }

        memberService.findPasswd(vm.user).then(function (response) {
            if (response.code == 200) {
                helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'memberService', resetPwdPopController], 'views/dialog/resetPasswdRes.html');
            } else {
                var dialog = helperService.getDialog('해당하는 회원정보를 찾을수 없습니다.');
                dialog.multiple(true);
                $mdDialog.show(dialog).then(function (result) {
                });
            }
        });
    }
}
