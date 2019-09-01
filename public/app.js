'use strict';

var app = angular.module('app', [
    'ngCookies',
    'ngMaterial',
    'ngMessages',
    'ui.router',

    'ui.grid',
    'ui.grid.selection',
    'ncy-angular-breadcrumb',
    'bw.paging',
    'restangular',
    'ngFileUpload',
    'ngSanitize',
    'slick',

    'authService',
    'Indiens.home',
    'Indiens.login',
    'Indiens.partner',
    'Indiens.project',
    'Indiens.notice',
    'Indiens.member',
    'Indiens.profile',
    'Indiens.signIn',
    'Indiens.questions',
]);

app.config(function ($stateProvider, $urlRouterProvider, $mdDateLocaleProvider, $qProvider, RestangularProvider) {
    $urlRouterProvider.otherwise('/home');
    $qProvider.errorOnUnhandledRejections(false);
    RestangularProvider.setBaseUrl('/api');

    $stateProvider.state('root', {
        abstract: true,

        views: {
            '@': {templateUrl: 'views/sub/sub.html'},

            'uiLeftMenu@root': {
                templateUrl: 'views/sub/top_menu.html',
                controllerAs: 'vm',
                controller: leftMenuController
            },

            'uiSubArea@root': {},

        }
    })
        .state('Terms', {
            url: '/Terms',
            templateUrl: 'views/home/Terms.html'
        })
        .state('Privacy', {
            url: '/Privacy',
            templateUrl: 'views/home/Privacy.html'
        })
        .state('LocationTerms', {
            url: '/LocationTerms',
            templateUrl: 'views/mobile/LocationTerms.html'
        });

    // http://stackoverflow.com/questions/32566416/change-format-of-md-datepicker-in-angular-material
    // https://github.com/urish/angular-moment
    $mdDateLocaleProvider.formatDate = function (date) {
        var m = moment(date);
        return m.isValid() ? m.format('YYYY-MM-DD') : '';
    };

    $mdDateLocaleProvider.shortMonths = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    $mdDateLocaleProvider.shortDays = ['일', '월', '화', '수', '목', '금', '토'];

    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
        return moment(date).format('YYYY년 MM월');
    };

    // IE에서 캐시가 적용되어 신규로 입력한 데이터가 브라우저를 껏다가 켜야 보인다
    // http://stackoverflow.com/questions/32280035/prevent-ie-caching-angularjs-restangular
    RestangularProvider.setDefaultHeaders({
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    });
});

app.run(function ($rootScope, authService) {
    $rootScope.pageNumber = 1;
    // authService.loggedIn({redirect: true}); // // 최초 실행시 로그인 여부 확인?
});

function leftMenuController($scope, $log, $state, $mdDialog, $mdMedia, menuList, authService, helperService) {
    var vm = this, scope = $scope;

    angular.extend(vm, {
        loginPop: fnlogin,
        menuList: menuList,
        logout: authService.logout,
        startDialog: startDialog
    });

    // 이게 없으면 브라우저 새로 고침하면 로그인 안한것으로 인식함
    // 관리자는 모든페이지가 로그인이 필요하지만, 사용자 페이지는 그렇지 않기 때문에 resolve 대신 일단 여기서 처리
    // if (!authService.isLoggedIn()) authService.loggedIn({redirect: false});

    // 크롬에서는 첫번째에 null 이고 두번째에 사용자 정보를 가져오지만 IE에서는 첫번째에 null로 사용자 정보를 인식하여 로그인한후 새로고침하면 로그인 하지 않은 것으로 인식됨
    $scope.$watch(function () {
        return authService.getCurUser();
    }, function (currentUser) {
        // console.log('$scope.$watch currentUser', currentUser);
        if (currentUser) {
            vm.currentUser = currentUser;
            // $log.log('2MainCtrl -> vm.currentUser', vm.currentUser);
        }

        vm.isAuthenticated = authService.isLoggedIn;
        // $log.log('1MainCtrl -> currentUser', currentUser, authService.isLoggedIn());
    });

    function startDialog() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', leftMenuController], 'views/dialog/startDialog.html');
    }

    function fnlogin() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', loginPopController], 'views/dialog/home_login.html');
    }



}

app.run(function ($rootScope, authService) {
    $rootScope.pageNumber = 1;
    if (!authService.isLoggedIn()) authService.loggedIn({redirect: false});

    $rootScope.$watch(function () {
        return authService.getCurUser();
    }, function (currentUser) {
        if (currentUser) {
            $rootScope.currentUser = currentUser;
        }

        $rootScope.isAuthenticated = authService.isLoggedIn;
    });
});

app.factory('helperService', function ($rootScope, $state, $mdToast, $mdDialog, $window, $mdMedia) {
    return {
        getRowTemplate: function () {
            // https://github.com/angular-ui/ui-grid/wiki/templating
            return '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ng-click="grid.appScope.cellClicked(row,col)" ng-dblclick="grid.appScope.rowDblClick(grid, row)"' +
                ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'red\': row.entity.rownum == \'숨김\' }" ui-grid-cell>{{col.cellStyle2}}</div>';
        },

        // 취소 버튼 클릭시
        goBack: function () {
            if ($rootScope.previousState) {
                //$state.go($rootScope.previousState);
                $window.history.back();
            } else {
                var state = $state.current.name;
                state = state.replace('.write', '');
                state = state.replace('.detail', '');
                state = state.replace('.new', '');
                $state.go(state);
            }
        },

        goLogin: function () {
            // event.preventDefault();
            // $state.go('login');

            var dialog = this.getDialog('로그인 후 이용 가능합니다.');

            $mdDialog.show(dialog).then(function (result) {
                $state.go('login');
            });
        },

        mdDialog: function (msg) {
            var dialog = this.getDialog(msg);
            $mdDialog.show(dialog);
        },

        // 토스트 메세지
        mdToast: function (msg) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    // .position('top right')
                    .position('bottom left')
                    .hideDelay(1500)
            );
        },

        // 삭제확인
        confirmDelete: function () {
            var confirm = $mdDialog.confirm()
                .title('인디언즈')
                .textContent('삭제 하시겠습니까?')
                .ariaLabel('삭제')
                .clickOutsideToClose(true)
                // .targetEvent(ev)
                .multiple(true)
                .ok('확인')
                .cancel('취소');

            return confirm;
        },

        //탈퇴확인
        confirmSignOut: function () {
            var confirm = $mdDialog.confirm()
                .title('인디언즈')
                .textContent('탈퇴 하시겠습니까?')
                .ariaLabel('삭제')
                .clickOutsideToClose(true)
                // .targetEvent(ev)
                .multiple(true)
                .ok('확인')
                .cancel('취소');

            return confirm;
        },

        //쥐소확인
        confirmCancel: function () {
            var confirm = $mdDialog.confirm()
                .title('인디언즈')
                .textContent('취소 하시겠습니까?')
                .ariaLabel('취소')
                .clickOutsideToClose(true)
                // .targetEvent(ev)
                .multiple(true)
                .ok('확인')
                .cancel('취소');

            return confirm;
        },

        confirmPay: function () {
            var confirm = $mdDialog.confirm()
                .title('인디언즈')
                .textContent('제안내용 열람에 6코인이 사용됩니다.\n' +
                    '열람하시겠습니까?')
                .ariaLabel('취소')
                .clickOutsideToClose(true)
                // .targetEvent(ev)
                .multiple(true)
                .ok('확인')
                .cancel('취소');

            return confirm;
        },

        confirmUpdate: function () {
            var confirm = $mdDialog.confirm()
                .title('나른')
                .textContent('변경 하시겠습니까?')
                .ariaLabel('변경')
                .clickOutsideToClose(true)
                // .targetEvent(ev)
                .multiple(true)
                .ok('확인')
                .cancel('취소');

            return confirm;
        },

        // 확인
        confirmDialog: function (msg) {
            var confirm = $mdDialog.confirm()
                .title('인디언즈')
                .textContent(msg)
                .ariaLabel(msg)
                .clickOutsideToClose(true)
                // .targetEvent(ev)
                .ok('확인')
                .cancel('취소')
                .multiple(true);

            return confirm;
        },


        getDialog: function (msg) {
            var dialog = $mdDialog.alert()
                .title('인디언즈')
                .ok('확인')
                .textContent(msg);
            // .mdHtmlContent(msg +'<br/><br/>@@@');
            return dialog;
        },

        getDialog2: function (msg) {
            var dialog = $mdDialog.alert()
                .title('나른')
                .ok('확인')
                // .textContent(msg);
                .htmlContent(msg);
            return dialog;
        },

        getDialog3: function (controller, templateUrl, clickOutsideToClose, resolveValue, doneCallBAck) {
            $mdDialog.show({
                controller: controller,
                templateUrl: templateUrl,
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: clickOutsideToClose,
                //fullscreen: ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen,
                fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
                controllerAs: 'vm',
                resolve: {
                    resolveValue: function () {
                        return resolveValue;
                    }
                }
            }).then(function (result) {
                if (doneCallBAck) doneCallBAck();
            });
        }
    }
});

app.constant('msg', {
    deleteConfirm: '삭제할 데이터를 선택해 주시기 바랍니다!',
    deleted: '삭제 하였습니다',
    saved: '저장 하였습니다',
    confirm: '입력 항목을 확인해 주시기 바랍니다',
    nochange: '변경된 내용이 없습니다',
    develope: '개발중입니다!',
    updateConfirm: '업데이트할 데이터를 선택해 주시기 바랍니다!',
    selectState: '상태를 선택해 주시기 바랍니다'
});

app.constant('menuList', [
    {
        id: 'member',
        title: '회원 관리',
        sref: 'Member'
    },

    {
        id: 'subscribe',
        title: '구독 관리',
        sref: 'Subscribe'
    },

    {
        id: 'partner',
        title: '파트너 관리',
        sref: 'Partner'
    },

    /*    {
            id: 'kakao',
            title: '카카오 페이',
            sref: 'Kakao'
        }*/
]);

app.constant('user_type', [
    {
        id: 'U',
        title: '일반'
    },
    {
        id: 'T',
        title: '상담사'
    }
]);

app.constant('user_lang', [
    {
        LNG: '1',
        LNG_NAME: 'JAVA'
    },
    {
        LNG: '2',
        LNG_NAME: 'C'
    },
    {
        LNG: '3',
        LNG_NAME: 'C++'
    },
    {
        LNG: '4',
        LNG_NAME: 'Python'
    },
    {
        LNG: '5',
        LNG_NAME: '기타'
    }
]);

app.constant('member_type', [
    {
        id: '1',
        title: '기획자',
        img_file: "img/job_icon_1.png"
    },
    {
        id: '2',
        title: '개발자',
        img_file: "img/job_icon_2.png"
    },
    {
        id: '3',
        title: '원화가',
        img_file: "img/job_icon_3.png"
    },
    {
        id: '4',
        title: '작곡가',
        img_file: "img/job_icon_4.png"
    },
    {
        id: '5',
        title: '작가',
        img_file: "img/job_icon_5.png"
    },
    {
        id: '6',
        title: '크리에이터',
        img_file: "img/job_icon_6.png"
    },
    {
        id: '7',
        title: '기타',
        img_file: "img/job_icon_7.png"
    },
]);

app.constant('price_type', [
    {
        id: '0',
        type: '1',
        coins: '28',
        price: '2800'
    },
    {
        id: '1',
        type: '2',
        coins: '50',
        price: '4800'
    },
    {
        id: '2',
        type: '3',
        coins: '100',
        price: '9400'
    }
]);

app.constant('member_experience', [
    {
        id: '0',
        title: '1년미만'
    },
    {
        id: '1',
        title: '1년'
    },
    {
        id: '2',
        title: '2년'
    },
    {
        id: '3',
        title: '3년'
    },
    {
        id: '4',
        title: '4년'
    },
    {
        id: '5',
        title: '5년'
    },
    {
        id: '6',
        title: '6년'
    },
    {
        id: '7',
        title: '7년'
    },
    {
        id: '8',
        title: '8년'
    },
    {
        id: '9',
        title: '9년'
    },
    {
        id: '10',
        title: '10년'
    },
    {
        id: '11',
        title: '10년이상'
    }
]);

app.constant('subscribe_state', [
    {
        id: '0',
        title: '구독 중'
    },
    {
        id: '1',
        title: '구독해지'
    },
    {
        id: '2',
        title: '예약취소'
    }
]);

app.constant('member_state', [
    {
        id: '0',
        title: '구독 중'
    },
    {
        id: '1',
        title: '구독해지'
    },
    {
        id: '2',
        title: '미구독'
    }
]);


app.controller('subAreaController', ['$scope', '$log', '$breadcrumb', '$transitions', '$rootScope', function ($scope, $log, $breadcrumb, $transitions, $rootScope) {
    var vm = this, scope = $scope;
    var steps = $breadcrumb.getStatesChain();
    var page_title = fnGetPageTitle();

    angular.extend(vm, {
        page_title: page_title
    });

    $transitions.onSuccess({}, function ($transitions) {
        // 상단 제목 표시
        steps = $breadcrumb.getStatesChain();
        // vm.sub_title = fnGetSubTitle();
        vm.page_title = fnGetPageTitle();

        // 뒤로 가기
        var currentNavItem = $transitions.$to().name;
        var previousState = $transitions.$from().name;
        $rootScope.previousState = previousState;
        if (previousState && previousState.split('.')[0] != currentNavItem.split('.')[0]) $rootScope.pageNumber = 1;
    });

    function fnGetSubTitle() {
        return (steps ? steps[0].ncyBreadcrumb.label : null);
    }

    function fnGetPageTitle() {
        var title;

        if (!steps) return title;

        if (steps.length >= 3) { // 글작성, 글보기 등은 제외
            title = steps[1].ncyBreadcrumb.label;
        } else {
            title = steps[steps.length - 1].ncyBreadcrumb.label;
        }

        title = title.replace('- {{vm.category_nm}}', '');

        // https://stackoverflow.com/questions/26308020/how-to-change-page-title-in-angular-using-routeprovider
        // document.title = '한국성서한림원-'+ title;
        document.title = title;
        return title;
    }
}]);

var times = [];

for (var i = 1; i <= 24; i++) {
    // times.push({cd: i, title: (("0" + i).slice(-2)) + ':00'});
    times.push({cd: (("0" + i).slice(-2)) + ':00', title: (("0" + i).slice(-2)) + ':00'});
}

app.constant('times', times);

// https://www.phychode.com/sprt/blog/sprtBlogPost.pem?blogSeq=1160
app.config(function ($provide) {
    $provide.decorator('textareaDirective', function ($delegate, $log) {
        //$log.debug('Hijacking input directive');
        var directive = $delegate[0];
        angular.extend(directive.link, {
            post: function (scope, element, attr, ctrls) {
                element.on('compositionupdate', function (event) {
                    element.triggerHandler('compositionend');
                })
            }
        });
        return $delegate;
    });
});

app.config(function ($provide) {
    $provide.decorator('inputDirective', function ($delegate, $log) {
        //$log.debug('Hijacking input directive');
        var directive = $delegate[0];
        angular.extend(directive.link, {
            post: function (scope, element, attr, ctrls) {
                element.on('compositionupdate', function (event) {
                    element.triggerHandler('compositionend');
                })
            }
        });
        return $delegate;
    });
});

// http://stackoverflow.com/questions/23285280/angular-changed-image-in-server-not-reflecting-in-view
app.directive('noCacheSrc', function ($window) {
    return {
        priority: 99,
        link: function (scope, element, attrs) {
            attrs.$observe('noCacheSrc', function (noCacheSrc) {
                noCacheSrc += '?' + (new Date()).getTime();
                attrs.$set('src', noCacheSrc);
            });
        }
    }
});

app.directive('chooseFile', function () {
    return {
        link: function (scope, elem, attrs) {
            var button = elem.find('button');
            var fileName = elem.find('input#fileName');
            var input = angular.element(elem[0].querySelector('input#fileInput'));

            button.bind('click', function () {
                input[0].click();
            });

            fileName.bind('click', function () {
                input[0].click();
            });

            input.bind('change', function (e) {
                scope.$apply(function () {
                    var files = e.target.files;
                    if (files[0]) {
                        scope.fileName = files[0].name;
                    } else {
                        scope.fileName = null;
                    }
                });
            });
        }
    };
});

function callFailed(error) {
    // $log.log(error);
    alert(error.status + '\n' + error.data.message + '\n' + error.data);
    // return exception.catcher(error);
}

function getComplete(response) {
    return response;
}
