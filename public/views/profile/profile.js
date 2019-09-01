var app = angular.module('Indiens.profile', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('Profile', {
            parent: 'root',
            url: '/Profile',
            ncyBreadcrumb: {
                label: '마이페이지'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/profile/profile.html',
                    controllerAs: 'vm',
                    controller: profileController
                },

                'uiSubTopMenu@Profile': {
                    templateUrl: 'views/sub/subTopMenu.html',
                    controllerAs: 'vm',
                    controller: profileController
                },

                'uiSubArea@Profile': {}
            },
            redirectTo: 'Profile.suggestion'
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Profile.suggestion', {
            url: '/suggestion',
            ncyBreadcrumb: {
                label: '제안정보관리'
            },

            views: {
                /*'uiSubArea@root': {
                    templateUrl: 'views/profile/suggestion.html',
                    controllerAs: 'vm',
                    controller: profileSuggestController
                },*/

                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/suggestion.html',
                    controllerAs: 'vm',
                    controller: profileSuggestController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Profile.suggestionOut', {
            url: '/suggestionOut',
            ncyBreadcrumb: {
                label: '제안정보관리'
            },

            views: {
                /*'uiSubArea@root': {
                    templateUrl: 'views/profile/suggestion.html',
                    controllerAs: 'vm',
                    controller: profileSuggestController
                },*/

                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/suggestion2.html',
                    controllerAs: 'vm',
                    controller: profileSuggestOutController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })

        .state('Profile.interests', {
            url: '/interests',
            ncyBreadcrumb: {
                label: '관심 프로젝트'
            },

            views: {
                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/interests.html',
                    controllerAs: 'vm',
                    controller: profileEditController
                }
            },
           /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Profile.coins', {
            url: '/coins',
            ncyBreadcrumb: {
                label: '코인충전'
            },

            views: {
                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/coins.html',
                    controllerAs: 'vm',
                    controller: profileCoinsController
                }
            },
           /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Profile.coinsResult', {
            url: '/coinsResult',
            ncyBreadcrumb: {
                label: '코인충전'
            },

            views: {
                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/coinsResult.html',
                    controllerAs: 'vm',
                    controller: profileCoinsResultController
                }
            },
            params: {CON_GOODS_PRICE: null},
            /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                 auth: function (authService) {
                     return authService.loggedIn({redirect: true});
                 }
             }*/
        })
        .state('Profile.notes', {
            url: '/notes',
            ncyBreadcrumb: {
                label: '쪽지관리'
            },

            views: {
                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/notes.html',
                    controllerAs: 'vm',
                    controller: profileNotesController
                }
            },
           /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Profile.notesOut', {
            url: '/notesOut',
            ncyBreadcrumb: {
                label: '쪽지관리'
            },

            views: {
                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/notes2.html',
                    controllerAs: 'vm',
                    controller: profileNotesOutController
                }
            },
            /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                 auth: function (authService) {
                     return authService.loggedIn({redirect: true});
                 }
             }*/
        })
        .state('Profile.settings', {
            url: '/settings',
            ncyBreadcrumb: {
                label: '프로필관리'
            },

            views: {
                'uiSubArea@Profile': {
                    templateUrl: 'views/profile/profile-settings.html',
                    controllerAs: 'vm',
                    controller: profileSettingsController
                }
            },
            /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                 auth: function (authService) {
                     return authService.loggedIn({redirect: true});
                 }
             }*/
        })
});

function profileController($scope, helperService, uiGridConstants, $state, profileService, $mdMedia, $mdDialog) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi;

    function activate() {
        // fnSearch();
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };

    angular.extend(vm, {
        search: fnSearch,
        // new: fnNew,
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        // teacher_type: teacher_type,
        excelDialog: fnExcelDialog
    });

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        $state.go('Partner.detail', {
            id: row.entity.CAR_ID
        });

        // helperService.getDialog3(['$scope', '$log', 'helperService', '$mdDialog', '$mdMedia', noticeEditController], 'partials/notice/notice-edit.html');
    }

    function fnSearch() {
        var params = {firstRow: 0, lastRow: 0};

        if (vm.search.CAR_COM_NM || vm.search.CAR_NUM) {
            params['CAR_COM_NM'] = vm.search.CAR_COM_NM;
            params['CAR_NUM'] = vm.search.CAR_NUM;
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        return partnerService.getList(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
            console.log(vm.gridOptions.data);
        });
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    function fnExcelDialog() {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', '$q', '$rootScope', '$state', 'msg', 'Upload', '$timeout', excelDialogController],
            templateUrl: 'views/dialog/car-excel.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm'
        }).then(function () {
            fnSearch();
        });
    }

    function gridOption() {
        var gridOptions = {
            data: [],
            enableSorting: false,
            rowHeight: 39,
            //스크롤바 삭제
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            selectionRowHeaderWidth: 30,
            multiSelect: true,
            rowTemplate: helperService.getRowTemplate(),

            columnDefs: [
                {
                    field: 'rownum',
                    displayName: '번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    headerTooltip: true,
                    // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',
                    // cellTemplate: '<div ng-class="[\'ui-grid-cell-contents\', {\'notice\': row.entity.rownum == \'공지\'}]">{{COL_FIELD}}</div>',
                    width: 75,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'CAR_COM_NM',
                    displayName: '파트너사',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'CAR_NUM',
                    displayName: '차량번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'CAR_COM_TEL',
                    displayName: '대표번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'CAR_MANAGER',
                    displayName: '담당자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'CAR_INSUR',
                    displayName: '사고시 보험사',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'CAR_EMER_TEL',
                    displayName: '긴급연락처',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'CAR_MEMO',
                    displayName: '메모',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 125,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'CAR_REMARK',
                    displayName: '비고',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 125,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                }
            ],
            onRegisterApi: function (api) {
                gridApi = api;
                /*vm.gridApi = api;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $state.go('facility.detail', {
                        // id: id
                        id: 1
                    });
                });*/
            }
        };

        return gridOptions;
    }
}

function profileEditController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type, price_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 12,
        sort: null
    };

    angular.extend(vm, {
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        delete: fnDelete,
        detail: fnDetail,
        price_type: price_type
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }



    function fnSearch() {
        /*if (!id) {
            return;
        }*/

        var params = {firstRow: 0, lastRow: 0, MEM_ID : id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getFabs(params).then(function (data) {
            vm.fabs = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
        });
    }

    function fnUpdate() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.id = id;
        partnerService.updateData(vm.user).then(function (result) {
            if(result.code == 200){
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnDelete(FAB_ID) {
        // 삭제확인
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.FAB_ID = FAB_ID;
            return profileService.deleteData(vm.user).then(function (news) {
                helperService.mdToast(msg.deleted);
                fnSearch();
                // helperService.goBack();
            });
        });

    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnDetail(PJT_ID) {
        $state.go('Project.detail', {
            id: PJT_ID
        });
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }
}

function profileSuggestController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id, MEM_COINS;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };

    angular.extend(vm, {
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        suggestDetail: fnSuggestDetail
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }

    function fnSearch() {
        /*if (!id) {
            return;
        }*/
        var params = {firstRow: 0, lastRow: 0, PRO_RECEIVER: id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getSuggestions(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
            MEM_COINS = data[0].MEM_COINS;
        });
    }

    function fnUpdate() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.id = id;
        partnerService.updateData(vm.user).then(function (result) {
            if(result.code == 200){
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnSuggestDetail() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'profileService', suggestPopController], 'views/dialog/suggest-detail.html');
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }


    function messagePop() {
        var obj = {
            MSG_RECEIVER: vm.user.PRO_SENDER
        };

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'msg', 'partnerService', 'resolveValue', messagePopController], 'views/dialog/message.html', true, obj, function () {
            fnSearch();
        });
    }


    scope.fnGetContent = function (grid, row) {
        if(row.entity.PRO_RECEIVER_READ_YN == 'N') {
            var confirm = helperService.confirmPay();

            $mdDialog.show(confirm).then(function () {
                if(MEM_COINS > 6) {
                    MEM_COINS = MEM_COINS - 6;
                    var params = {
                        MEM_ID: $rootScope.currentUser.MEM_ID,
                        MEM_COINS: MEM_COINS,
                        PRO_ID: row.entity.PRO_ID
                    };
                    profileService.coinsUse(params).then(function (result) {
                        if (result.code == 200) {
                            var obj = {
                                PRO_ID: row.entity.PRO_ID,
                                SEARCH: fnSearch()
                            };
                            helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'profileService', 'partnerService', 'resolveValue', suggestPopController], 'views/dialog/suggest-detail.html', true, obj, function () {
                                fnSearch();
                            });
                        }
                    });
                } else {
                    var dialog = helperService.getDialog('보유 코인이 부족합니다.');
                    $mdDialog.show(dialog).then(function (result) {
                    });
                }
            });
        } else {
            var obj = {
                PRO_ID: row.entity.PRO_ID
            };

            helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'profileService', 'partnerService', 'resolveValue', suggestPopController], 'views/dialog/suggest-detail.html', true, obj);
        }
    };

    scope.fnConfirm = function (grid, row) {
        if(row.entity.PRO_RECEIVER_READ_YN == 'N') {
            var dialog = helperService.getDialog('제안정보를 확인하세요.');
            $mdDialog.show(dialog).then(function (result) {
            });
        } else {
            var params = {
                PRO_ID: row.entity.PRO_ID,
                PRO_ACCEPT_ST: '2'
            };

            profileService.changeState(params).then(function (result) {
                if (result.code == 200) {
                    helperService.mdToast('제안을 수락하였습니다');
                    fnSearch();

                }
            });
        }
    };



    function gridOption() {
        var gridOptions = {
            data: [],
            enableSorting: false,
            rowHeight: 47,
            //스크롤바 삭제
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            selectionRowHeaderWidth: 30,
            multiSelect: true,
            rowTemplate: helperService.getRowTemplate(),

            columnDefs: [
                {
                    field: 'rownum',
                    displayName: '번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    headerTooltip: true,
                    // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',
                    // cellTemplate: '<div ng-class="[\'ui-grid-cell-contents\', {\'notice\': row.entity.rownum == \'공지\'}]">{{COL_FIELD}}</div>',
                    width: 75,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'PRO_DT',
                    displayName: '제안일자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                },

                {
                    field: 'PJT_NAME',
                    displayName: '프로젝트 명',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
                    // width: 150,
                    cellTemplate: '<div class="cell_center" ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'"><img src="/img/board/lock.png">**********</div>' +
                        '<div class="cell_center" ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.PJT_NAME}}</div>',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'MEM_NAME',
                    displayName: '성명',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellTemplate: '<div class="cell_center" ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'">***</div>' +
                        '<div class="cell_center" ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.MEM_NAME}}</div>',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'col7',
                    displayName: '',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    cellTemplate: '<md-button class="md-raised gray" aria-label="완료" ng-click="grid.appScope.fnConfirm(grid, row)" ng-if="row.entity.PRO_ACCEPT_ST == \'1\'">수락</md-button>',
                        // '<md-button class="md-raised " aria-label="취소" ng-click="grid.appScope.fnComplete(grid, row)" ng-if="row.entity.REV_STATE == \'예약완료\'">상담완료</md-button>',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'col8',
                    displayName: '',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    cellTemplate: '<md-button class="md-raised " aria-label="완료" ng-click="grid.appScope.fnGetContent(grid, row)">내용보기</md-button>',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                }
            ],
            onRegisterApi: function (api) {
                gridApi = api;
                /*vm.gridApi = api;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $state.go('facility.detail', {
                        // id: id
                        id: 1
                    });
                });*/
            }
        };

        return gridOptions;
    }

}

function profileSuggestOutController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };

    angular.extend(vm, {
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        suggestDetail: fnSuggestDetail
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }

    function fnSearch() {
        /*if (!id) {
            return;
        }*/

        var params = {firstRow: 0, lastRow: 0, PRO_SENDER: id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getSuggestionsOut(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
        });
    }

    function fnUpdate() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.id = id;
        partnerService.updateData(vm.user).then(function (result) {
            if(result.code == 200){
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnSuggestDetail() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'projectService', suggestPopController], 'views/dialog/suggest-detail.html');
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    scope.fnSendMessage = function (grid, row) {
        var obj2 = {
            MSG_RECEIVER: row.entity.PRO_RECEIVER
        };

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'msg', 'partnerService', 'resolveValue', messagePopController], 'views/dialog/message.html', true, obj2, function () {
            fnSearch();
        });
    };

    scope.fnConfirm = function (grid, row) {
        var params = {
            PRO_ID: row.entity.PRO_ID,
            JOB_ID: row.entity.JOB_ID,
            PRO_ACCEPT_ST: '4'
        };

        profileService.changeStateOut(params).then(function (result) {
            if (result.code == 200) {
                helperService.mdToast('최종 수락 완료되었습니다');
                fnSearch();
            }
        });

    };


    function gridOption() {
        var gridOptions = {
            data: [],
            enableSorting: false,
            rowHeight: 47,
            //스크롤바 삭제
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            selectionRowHeaderWidth: 30,
            multiSelect: true,
            rowTemplate: helperService.getRowTemplate(),

            columnDefs: [
                {
                    field: 'rownum',
                    displayName: '번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    headerTooltip: true,
                    // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',
                    // cellTemplate: '<div ng-class="[\'ui-grid-cell-contents\', {\'notice\': row.entity.rownum == \'공지\'}]">{{COL_FIELD}}</div>',
                    width: 75,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'PRO_DT',
                    displayName: '제안일자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                },

                {
                    field: 'PJT_NAME',
                    displayName: '프로젝트 명',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
                    // width: 150,
                    /*cellTemplate: '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'"><img src="/img/board/lock.png">**********</div>' +
                        '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.PJT_NAME}}</div>',*/
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'MEM_NAME',
                    displayName: '성명',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    /*cellTemplate: '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'">***</div>' +
                        '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.MEM_NAME}}</div>',*/
                    width: 125,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'PRO_ACCEPT_ST',
                    displayName: '상태',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    /*cellTemplate: '<div ng-if="row.entity.PRO_ACCEPT_ST == \'1\'">제안중</div>' +
                        '<div ng-if="row.entity.PRO_ACCEPT_ST == \'2\'">제안수락</div>' +
                        '<div ng-if="row.entity.PRO_ACCEPT_ST == \'4\'">제안완료</div>',*/
                    width: 125,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'col7',
                    displayName: '',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    cellTemplate: '<md-button class="md-raised gray" aria-label="완료" ng-click="grid.appScope.fnConfirm(grid, row)" ng-if="row.entity.PRO_ACCEPT_ST == \'제안수락\'">수락</md-button>',
                    // '<md-button class="md-raised " aria-label="취소" ng-click="grid.appScope.fnComplete(grid, row)" ng-if="row.entity.REV_STATE == \'예약완료\'">상담완료</md-button>',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'col8',
                    displayName: '',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    cellTemplate: '<md-button class="md-raised " aria-label="완료" ng-click="grid.appScope.fnSendMessage(grid, row)">쪽지발송</md-button>',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                }
            ],
            onRegisterApi: function (api) {
                gridApi = api;
                /*vm.gridApi = api;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $state.go('facility.detail', {
                        // id: id
                        id: 1
                    });
                });*/
            }
        };

        return gridOptions;
    }
}

function profileNotesController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };

    angular.extend(vm, {
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        noteCheck: fnNoteCheck
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }

    function fnSearch() {
        /*if (!id) {
            return;
        }*/

        var params = {firstRow: 0, lastRow: 0, MSG_RECEIVER: id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getNotes(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
        });
    }

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        var obj = row.entity;

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'profileService', 'resolveValue', notesPopController], 'views/dialog/notes-detail.html', true, obj);
    };

    function fnUpdate() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.id = id;
        partnerService.updateData(vm.user).then(function (result) {
            if(result.code == 200){
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnNoteCheck() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'projectService', notesPopController], 'views/dialog/notes-detail.html');
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnCancel() {
        $mdDialog.hide();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    function gridOption() {
        var gridOptions = {
            data: [],
            enableSorting: false,
            rowHeight: 39,
            //스크롤바 삭제
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            selectionRowHeaderWidth: 30,
            multiSelect: true,
            rowTemplate: helperService.getRowTemplate(),

            columnDefs: [
                {
                    field: 'rownum',
                    displayName: '번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    headerTooltip: true,
                    // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',
                    // cellTemplate: '<div ng-class="[\'ui-grid-cell-contents\', {\'notice\': row.entity.rownum == \'공지\'}]">{{COL_FIELD}}</div>',
                    width: 75,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'MSG_MESSAGE',
                    displayName: '쪽지내용',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
                    // width: 150,
                    /*cellTemplate: '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'"><img src="/img/board/lock.png">**********</div>' +
                        '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.PJT_NAME}}</div>',*/
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'MSG_DT',
                    displayName: '수신일자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                },

                {
                    field: 'MEM_NAME',
                    displayName: '발송자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    /*cellTemplate: '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'">***</div>' +
                        '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.MEM_NAME}}</div>',*/
                    width: 125,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                }
            ],
            onRegisterApi: function (api) {
                gridApi = api;
                /*vm.gridApi = api;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $state.go('facility.detail', {
                        // id: id
                        id: 1
                    });
                });*/
            }
        };

        return gridOptions;
    }

}

function profileNotesOutController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };

    angular.extend(vm, {
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        noteCheck: fnNoteCheck
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }

    function fnSearch() {
        /*if (!id) {
            return;
        }*/

        var params = {firstRow: 0, lastRow: 0, MSG_SENDER: id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getNotesOut(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
        });
    }

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        var obj = row.entity;
        obj['NO_ANSWER'] = 'Y';

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'profileService', 'resolveValue', notesPopController], 'views/dialog/notes-detail.html', true, obj);
    };

    function fnUpdate() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.id = id;
        partnerService.updateData(vm.user).then(function (result) {
            if(result.code == 200){
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnNoteCheck() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'projectService', notesPopController], 'views/dialog/notes-detail.html');
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnCancel() {
        $mdDialog.hide();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    function gridOption() {
        var gridOptions = {
            data: [],
            enableSorting: false,
            rowHeight: 39,
            //스크롤바 삭제
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            selectionRowHeaderWidth: 30,
            multiSelect: true,
            rowTemplate: helperService.getRowTemplate(),

            columnDefs: [
                {
                    field: 'rownum',
                    displayName: '번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    headerTooltip: true,
                    // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',
                    // cellTemplate: '<div ng-class="[\'ui-grid-cell-contents\', {\'notice\': row.entity.rownum == \'공지\'}]">{{COL_FIELD}}</div>',
                    width: 75,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'MSG_MESSAGE',
                    displayName: '쪽지내용',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
                    // width: 150,
                    /*cellTemplate: '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'"><img src="/img/board/lock.png">**********</div>' +
                        '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.PJT_NAME}}</div>',*/
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'MSG_DT',
                    displayName: '수신일자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,

                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                },

                {
                    field: 'MEM_NAME',
                    displayName: '수신자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    /*cellTemplate: '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'N\'">***</div>' +
                        '<div ng-if="row.entity.PRO_RECEIVER_READ_YN == \'Y\'">{{row.entity.MEM_NAME}}</div>',*/
                    width: 125,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                }
            ],
            onRegisterApi: function (api) {
                gridApi = api;
                /*vm.gridApi = api;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $state.go('facility.detail', {
                        // id: id
                        id: 1
                    });
                });*/
            }
        };

        return gridOptions;
    }

}

function profileSettingsController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, memberService, profileService, member_type, member_experience, user_lang, Upload, $timeout) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id, PJT_ID, fileCount = 0, fileUploadCnt, image_ids = [];

    angular.extend(vm, {
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        fileSelect: fileSelect,
        member_type: member_type,
        member_experience: member_experience,
        user_lang: user_lang,
        addDetail: fnAddDetail,
        removeDetail: fnRemoveDetail,
        picRemove: fnPicRemove,
        addCoins: fnAddCoins,
        delete: fnDelete,
        logout: authService.logout
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();


    }

    function fnSearch() {
        if (!id) {
            return;
        }

        memberService.getData(id).then(function (data) {
            if(data.MEM_LANG) {
                data.MEM_LANG = JSON.parse(data.MEM_LANG);
            }
            vm.user = data;
            vm.user.details = [];
            vm.user.ptf = data.ptf;
            vm.games = [];
            for(var i = 0; i < data.list.length; i++)
                vm.games.push(data.list[i]);
        });
    }

    function fnAddDetail() {
        vm.user.details.push({});
    }

    function fnRemoveDetail(ev, index, gubun, GME_ID) {
        if(gubun == 1) {
            var confirm = helperService.confirmDelete();

            $mdDialog.show(confirm).then(function () {
                var params = {
                    GME_ID: GME_ID
                };
                memberService.deleteGame(params).then(function () {
                    vm.games.splice(index, 1);
                });
            });
        } else {
            vm.user.details.splice(index, 1);
        }
    }

    function fnPicRemove(idx, gubun, PRF_ID) {
        if (gubun == 1) {
            var confirm = helperService.confirmDelete();

            $mdDialog.show(confirm).then(function () {
                var params = {
                    PRF_ID: PRF_ID
                };
                memberService.deleteData(params).then(function () {
                    vm.user.ptf.splice(idx, 1);
                });
            });
        } else {
            vm.files.splice(idx, 1);
        }

    }

    function fileSelect(files, errFiles) {
        /*angular.forEach(files, function (file) {
            file['content'] = file.lastModified;
            file['content'] = file.lastModified;
        });*/

        $log.log('파일 선택 files : ', files);
        $log.log('파일 선택 errFiles : ', errFiles);

        vm.files = files;
        vm.errFiles = errFiles;
    }

    function fnAddCoins() {
        vm.user.MEM_COINS = parseInt(vm.user.MEM_COINS, 10) + parseInt(vm.user.MEM_COINS_ADD, 10);
        vm.user.MEM_COINS_ADD = '';
    }

    function fnUpdate() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }



        vm.user.id = id;
        memberService.updateDataAdmin(vm.user).then(function (result) {
            if(result.code == 200){
                fileCount = fileUploadCnt = 0;

                if(vm.picFile) { // 업로드할 첨부파일이 존재할 경우
                    ++fileCount;
                    fnUploadPicture(vm.picFile, '/TB_MEMBER/upload', id, "main", "MEM_IMG");
                    fileCount = 0;
                }

                if(vm.files && vm.files.length > 0) {
                    fileCount += vm.files.length;
                    var idx = 0;

                    for (var i = 0; i < vm.files.length; i++) {
                        fnUploadPicture(vm.files[i], '/TB_PORTFOLIO/upload', id, 1, 'PRF_FILE');
                    }
                    fileCount = 0;
                }

                if (fileCount <= 0) fnSaved();

                // fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    //이미지 파일 업로드
    function fnUploadPicture(file, url, id, idx, colName) {
        file.upload = Upload.upload({
            url: '/api' + url,
            data: {
                file: file,
                id: id,
                MEM_ID: id,
                idx: idx,
                colName: colName
            }
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
                if(idx == 'main') {
                    vm.user['MEM_IMG'] = response.data['MEM_IMG'] + '?' + (new Date()).getTime();
                }
                // 성공시
                vm.picFile = null;
                fileUploadCnt += 1;
                // if(idx == 1) fnSaved();
                // fnAfterSave(response.data);
            });
        }, function (response) {
            if (response.status > 0) {
                $log.log('오류 발생 : ' + response.status + ' - ' + response.data);
                // fnSaved();
                // fnAfterSave(response.data);
            }
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    function fnDelete() {
        var confirm = helperService.confirmSignOut();

        $mdDialog.show(confirm).then(function () {
            var params = {
                MEM_ID: id
            };
            profileService.deleteMember(params).then(function (data) {
                if(data.code == '200') {
                    vm.logout(vm);
                }
            });
        });
    }




    function fnAfterSave(result) {
        if (result.code == 200) {
            if (fileUploadCnt >= fileCount) {
                helperService.mdToast(msg.saved);
                // fnCancel();
            }
        } else {
            var dialog = helperService.getDialog(result.message);
            $mdDialog.show(dialog).then(function (result) {
            });
        }
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        vm.files = [];
        fnSearch();
        // fnCancel();
    }

    function fnDelete() {
        var confirm = helperService.confirmSignOut();

        $mdDialog.show(confirm).then(function () {
            var params = {
                MEM_ID: id
            };
            profileService.deleteMember(params).then(function (data) {
                if(data.code == '200') {
                    vm.logout(vm);
                }
            });
        });
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }
}

function profileCoinsController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type, price_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 12,
        sort: null
    };

    angular.extend(vm, {
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        delete: fnDelete,
        detail: fnDetail,
        price_type: price_type
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }



    function fnSearch() {
        /*if (!id) {
            return;
        }*/

        var params = {firstRow: 0, lastRow: 0, MEM_ID : id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getCoins(params).then(function (data) {
            vm.user = data;
        });
    }

    function fnUpdate() {
        /*if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }*/

        console.log(vm.user.MEM_COINS_TYPE);

        var params = {
            MEM_ID: id,
            CON_GOODS_TYPE: vm.price_type[vm.user.MEM_COINS_TYPE].type,
            CON_GOODS_PRICE: vm.price_type[vm.user.MEM_COINS_TYPE].price
        }

        profileService.buyCoins(params).then(function (result) {
            if(result.code == 200){
                $state.go('Profile.coinsResult', {
                    CON_GOODS_PRICE: params.CON_GOODS_PRICE
                });
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnDelete(FAB_ID) {
        // 삭제확인
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.FAB_ID = FAB_ID;
            return profileService.deleteData(vm.user).then(function (news) {
                helperService.mdToast(msg.deleted);
                fnSearch();
                // helperService.goBack();
            });
        });

    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnDetail(PJT_ID) {
        $state.go('Project.detail', {
            id: PJT_ID
        });
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }
}

function profileCoinsResultController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, profileService, member_type, price_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 12,
        sort: null
    };

    angular.extend(vm, {
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        delete: fnDelete,
        detail: fnDetail,
        CON_GOODS_PRICE: $state.params.CON_GOODS_PRICE
    });

    function activate() {
        id = $rootScope.currentUser.MEM_ID;
        fnSearch();
    }



    function fnSearch() {
        /*if (!id) {
            return;
        }*/

        var params = {firstRow: 0, lastRow: 0, MEM_ID : id};

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        profileService.getCoins(params).then(function (data) {
            vm.user = data;
        });
    }

    function fnUpdate() {
        /*if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }*/

        console.log(vm.user.MEM_COINS_TYPE);

        var params = {
            MEM_ID: id,
            CON_GOODS_TYPE: vm.price_type[vm.user.MEM_COINS_TYPE].type,
            CON_GOODS_PRICE: vm.price_type[vm.user.MEM_COINS_TYPE].price
        }

        profileService.buyCoins(params).then(function (result) {
            if(result.code == 200){
                $state.go('Profile.coinsResult', {
                    CON_GOODS_PRICE: params.CON_GOODS_PRICE
                });
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnDelete(FAB_ID) {
        // 삭제확인
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.FAB_ID = FAB_ID;
            return profileService.deleteData(vm.user).then(function (news) {
                helperService.mdToast(msg.deleted);
                fnSearch();
                // helperService.goBack();
            });
        });

    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnDetail(PJT_ID) {
        $state.go('Project.detail', {
            id: PJT_ID
        });
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnPaging(newPage) {
        paginationOptions.pageNumber = newPage;
        fnSearch();
    }

    function fnOpenDialog(notice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: ['$scope', '$mdDialog', '$log', 'helperService', 'noticeService', '$q', '$rootScope', '$state', 'msg', 'notice', commentDialogController],
            templateUrl: 'partials/dialog/notice-comment.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            controllerAs: 'vm',
            resolve: {
                notice: function () {
                    return notice;
                }
            }
        }).then(function (result) {
            fnSearch();
        });
    }

    function commentDialogController($scope, $mdDialog, $log, helperService, noticeService, $q, $rootScope, $state, msg, notice) {
        var vm = this, scope = $scope;
        // vm.$onInit = activate;

        angular.extend(vm, {
            notice: notice,
            save: fnSave,
            cancel: function () {
                $mdDialog.cancel();
            }
        });

        function fnSave() {
            if (!$scope.commentForm.$valid) {
                vm.showError = true;
                helperService.mdToast(msg.confirm);
                return;
            }

            noticeService.saveAnswer(vm.notice).then(function (result) {
                vm.showError = false;
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            });
        }
    }
}

function suggestPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, profileService, partnerService, obj) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        fnSearch();
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.hide();
        }
    });

    function fnSearch() {
        if (!obj.PRO_ID) {
            return;
        }

        var params = {
            id: obj.PRO_ID
        };

        profileService.getProposeInfo(params).then(function (data) {
            vm.user = data;
        });
    }

    function fnConfirm() {
        var obj2 = {
            MSG_RECEIVER: vm.user.PRO_SENDER
        };

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'msg', 'partnerService', 'resolveValue', messagePopController], 'views/dialog/message.html', true, obj2, function () {
            obj.SEARCH;
        });


        /*if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.MSG_SENDER = $rootScope.currentUser.MEM_ID;
        vm.user.MSG_RECEIVER = vm.user.PRO_SENDER;

        partnerService.saveMessage(vm.user).then(function (result) {
            helperService.mdToast(msg.saved);
            $mdDialog.hide();
        });*/
    }
}

function messagePopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, partnerService, obj) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {

    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.cancel();
        },
        saveMessage: fnSaveMessage
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

    function fnSaveMessage() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.MSG_SENDER = $rootScope.currentUser.MEM_ID;
        vm.user.MSG_RECEIVER = obj.MSG_RECEIVER;

        partnerService.saveMessage(vm.user).then(function (result) {
            helperService.mdToast(msg.saved);
            $mdDialog.hide();
        });
    }

}



function notesPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, profileService, obj) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        vm.message = obj;
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.cancel();
        }
    });

    function fnConfirm() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'partnerService', 'msg', 'resolveValue', notesAnswerPopController], 'views/dialog/notes-answer.html', true, obj);
    }
}

function notesAnswerPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, partnerService, msg, obj) {
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

        vm.user.MSG_SENDER = $rootScope.currentUser.MEM_ID;
        vm.user.MSG_RECEIVER = obj.MSG_SENDER;

        partnerService.saveMessage(vm.user).then(function (result) {
            helperService.mdToast(msg.saved);
            $mdDialog.hide();
        });
    }
}


