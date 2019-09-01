var app = angular.module('Indiens.notice', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('Notice', {
            parent: 'root',
            url: '/Notice',
            ncyBreadcrumb: {
                label: '게시판'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/notice/notice.html',
                    controllerAs: 'vm',
                    controller: noticeController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Notice.new', {
            // url: '/:id',
            url: '/new',
            ncyBreadcrumb: {
                label: '게시물 작성'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/notice/notice-regDetail.html',
                    controllerAs: 'vm',
                    controller: noticeEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Notice.edit', {
            url: '/:id',
            // url: '/new',
            ncyBreadcrumb: {
                label: '게시물 수정'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/notice/notice-regDetail.html',
                    controllerAs: 'vm',
                    controller: noticeEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Notice.detail', {
            // url: '/:id',
            url: '/detail/:id',
            ncyBreadcrumb: {
                label: '게시물 상세'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/notice/notice-detail.html',
                    controllerAs: 'vm',
                    controller: noticeDetailController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
});

function noticeController($scope, helperService, uiGridConstants, $state, noticeService, $mdMedia, $mdDialog) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi;

    function activate() {
        fnSearch();
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
        update: fnUpdate,
        // teacher_type: teacher_type,
        excelDialog: fnExcelDialog
    });

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        $state.go('Notice.detail', {
            id: row.entity.BRD_ID
        });

        // helperService.getDialog3(['$scope', '$log', 'helperService', '$mdDialog', '$mdMedia', noticeEditController], 'partials/notice/notice-edit.html');
    }

    function fnSearch() {
        var params = {firstRow: 0, lastRow: 0};

        if (vm.search.BRD_MAIN_TITLE) {
            params['BRD_MAIN_TITLE'] = vm.search.BRD_MAIN_TITLE;
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        return noticeService.getList(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
            console.log(vm.gridOptions.data);
        });
    }

    function fnUpdate() {
        $state.go('Notice.new');
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
                    field: 'BRD_MAIN_TITLE',
                    displayName: '제목',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                },

                {
                    field: 'BRD_MAIN_DT',
                    displayName: '작성일자',
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
                    displayName: '작성자',
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

function noticeEditController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, noticeService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    angular.extend(vm, {
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type
    });

    function activate() {
        id = $state.params.id;
        fnSearch();
    }

    function fnSearch() {
        if (!id) {
            return;
        }

        noticeService.getData(id).then(function (data) {
            vm.user = data;
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
        vm.user.BRD_MAIN_MEM_ID = $rootScope.currentUser.MEM_ID;
        noticeService.saveData(vm.user).then(function (result) {
            if(result.code == 200){
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });
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

function noticeDetailController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, noticeService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    angular.extend(vm, {
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        member_type: member_type,
        saveComment: fnSaveComment,
        delete: fnDelete,
        editComment: fnEditComment,
        deleteComment: fnDeleteComment
    });

    function activate() {
        id = $state.params.id;
        $scope.commentFormData = {};
        fnSearch();
    }

    function fnSearch() {
        if (!id) {
            return;
        }

        var params = {
            id: id
        };

        noticeService.getDetail(params).then(function (data) {
            vm.user = data;
            vm.comments = data.list;
        });
    }

    function fnUpdate() {
        $state.go('Notice.edit', {
            id: id
        });
    }

    function fnSaveComment() {
        if (!scope.commentFormData.form.$valid) {
            $log.log('입력에러', scope.commentFormData.form.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user['BRD_SUB_MEM_ID'] = $rootScope.currentUser.MEM_ID;

        noticeService.saveComment(vm.user).then(function (data) {
            vm.showError = false;
            fnSearch();

        });
    }

    function fnDelete() {
        // 삭제확인
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.user.BRD_ID = id;
            return noticeService.deleteData(vm.user).then(function (news) {
                helperService.mdToast(msg.deleted);
                helperService.goBack();
            });
        });

    }

    function fnEditComment(com_id, com_content) {
        var obj = {
            BRD_SUB_ID: com_id,
            BRD_SUB_CONTENTS: com_content
        };

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'noticeService', 'msg', 'resolveValue', commentChangePopController], 'views/dialog/comment-edit.html', true, obj, function () {
            fnSearch();
        });
    }

    function fnDeleteComment(com_id) {
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.BRD_SUB_ID = com_id;
            return noticeService.deleteComment(vm.user).then(function (news) {
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

function commentChangePopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, noticeService, msg, obj) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
        vm.data = obj;
        // fnSearch();
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.cancel();
        },
        getProfile: fnGetProfile,
        changeMember: fnChangeMember,
        update: fnUpdate
    });

    function fnUpdate() {
        noticeService.updateComment(vm.data).then(function (result) {
            if(result.code == 200){
                $mdDialog.hide();
                helperService.mdToast(result.message);
            } else {
                $mdDialog.hide();
                helperService.mdToast(result.message);
            }
        });
    }

    function fnSearch() {
        if (!obj.PJT_ID) {
            return;
        }

        var params = {
            id: obj.PJT_ID,
            JOB_ID: obj.JOB_ID
        };

        projectService.getMembersList(params).then(function (data) {
            vm.user = data;
        });
    }

    function fnGetProfile(mem_id) {
        $state.go('Partner.detail', {
            id: mem_id
        });
        $mdDialog.hide();
    }

    function fnChangeMember(mem_id, pro_id) {
        var params = {
            JOB_ID: obj.JOB_ID,
            PJT_ID: obj.PJT_ID,
            MEM_ID: mem_id,
            PRO_ID: pro_id
        };

        projectService.updateWorker(params).then(function (result) {
            if(result.code == 200){
                $mdDialog.hide();
            } else {
                $mdDialog.hide();
                helperService.mdToast(result.message);
            }
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


function excelDialogController($scope, $mdDialog, $log, helperService, $q, $rootScope, $state, msg, Upload, $timeout) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;

    function activate() {
    }

    angular.extend(vm, {
        save: fnSave,
        cancel: fnCandel
    });

    function fnSave() {
        var file = vm.picFile;

        if (!file) {
            helperService.mdToast('엑셀 파일을 선택해 주세요!');
            return;
        }

        var uploadData = {
            url: '/api/TB_CAR/upload',
            data: {
                file: file
            }
        };

        file.upload = Upload.upload(uploadData);

        file.upload.then(function (response) {
/*            if (response && response.status == '200') {

                if (response.data) {
                    $timeout(function () {
                        $mdDialog.show(helperService.getDialog2(response.data));
                        fnCandel();
                    });
                } else {
                    $timeout(function () {
                        helperService.mdToast('엑셀 식단을 입력 하였습니다.');
                        fnCandel();
                    });
                }
            }*/
            if(response.data.code == '200') {
                helperService.mdToast(msg.saved);
                $mdDialog.hide();
            } else {
                $timeout(function () {
                    $mdDialog.show(helperService.getDialog2(JSON.stringify(response.data.message)));
                    fnCandel();
                });
            }
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;

        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    function fnCandel() {
        $mdDialog.cancel();
    }
}
