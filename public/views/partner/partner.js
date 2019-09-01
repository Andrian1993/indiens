var app = angular.module('Indiens.partner', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('Partner', {
            parent: 'root',
            url: '/Partner',
            ncyBreadcrumb: {
                label: '파트너'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/partner/partner.html',
                    controllerAs: 'vm',
                    controller: partnerController
                }
            },
            params: {
                MEM_TYPE: '0'
            }
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Partner.detail', {
            url: '/:id',
            // url: '/detail',
            ncyBreadcrumb: {
                label: '파트너 상세'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/partner/partner-detail.html',
                    controllerAs: 'vm',
                    controller: partnerEditController
                }
            },
           /* resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
});

function partnerController($scope, helperService, uiGridConstants, $state, partnerService, $mdMedia, $mdDialog, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi;



    function activate() {
        /*if($state.params.MEM_TYPE) {
            vm.search = {
                MEM_TYPE: $state.params.MEM_TYPE
            }
        }*/
        fnSearch();
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 9,
        sort: null
    };

    angular.extend(vm, {
        fnSearch: fnSearch,
        search: {MEM_TYPE: $state.params.MEM_TYPE},
        // new: fnNew,
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        update: fnUpdate,
        member_type: member_type,
        excelDialog: fnExcelDialog,
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

        if (vm.search.MEM_NAME || vm.search.MEM_TYPE) {
            params['MEM_NAME'] = vm.search.MEM_NAME;
            params['MEM_TYPE'] = vm.search.MEM_TYPE;
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        return partnerService.getList(params).then(function (data) {
            vm.partners = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
            console.log(vm.gridOptions.data);
        });
    }

    function fnUpdate(mem_id) {
        $state.go('Partner.detail', {
            id: mem_id
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

function partnerEditController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, partnerService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id, guest;

    if($rootScope.currentUser) {
        guest = $rootScope.currentUser.MEM_ID;
    } else {
        guest = '';
    }

    angular.extend(vm, {
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        propose: fnPropose,
        message: fnMessage,
        guest: guest
    });

    function activate() {
        id = $state.params.id;
        fnSearch();
    }

    function fnSearch() {
        if (!id) {
            return;
        }

        partnerService.getData(id).then(function (data) {
            vm.user = data[0];
            vm.user.games = data[0].list;
            vm.user.ptf = data[0].ptf;
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

    function fnPropose() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'msg', 'partnerService', 'resolveValue', sendPropPopController], 'views/dialog/propose.html', true, id);
    }

    function fnMessage() {
        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'msg', 'partnerService', 'resolveValue', messagePartnerPopController], 'views/dialog/message.html', true, id);
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
}

function messagePartnerPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, partnerService, MEM_ID) {
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
        vm.user.MSG_RECEIVER = MEM_ID;

        partnerService.saveMessage(vm.user).then(function (result) {
            helperService.mdToast(msg.saved);
            $mdDialog.hide();
        });
    }

}


function sendPropPopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, partnerService, MEM_ID) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        fnSearch();
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.cancel();
        },
        projectChange: fnProjectChange,
        mem_id: MEM_ID,
        savePropose: fnSavePropose,
        projectList: true
    });

    function fnSearch() {
        var params = {firstRow: 0, lastRow: 0};

        /*if (vm.search.MEM_NAME || vm.search.MEM_TYPE) {
            params['MEM_NAME'] = vm.search.MEM_NAME;
            params['MEM_TYPE'] = vm.search.MEM_TYPE;
        }*/

        // var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        // params.firstRow = firstRow;

        // params.lastRow = paginationOptions.pageSize;

        params.currentUser = $rootScope.currentUser.MEM_ID;

        return partnerService.getProjectList(params).then(function (data) {
            vm.projects = data[0].list;
            vm.totalItems = data[0].cnt;
            // vm.currentPage = paginationOptions.pageNumber;
            console.log(vm.gridOptions.data);
        });
    }

    function fnProjectChange() {
        partnerService.getPositionsList(vm.user.PJT_ID).then(function (result) {
            vm.positions = result;
        });
    }

    function fnSavePropose() {
        if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user.PRO_SENDER = $rootScope.currentUser.MEM_ID;
        vm.user.PRO_RECEIVER = MEM_ID;

        partnerService.savePropose(vm.user).then(function (result) {
            helperService.mdToast(msg.saved);
            $mdDialog.hide();
        });
    }


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

