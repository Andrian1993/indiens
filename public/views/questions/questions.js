var app = angular.module('Indiens.questions', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('Questions', {
            parent: 'root',
            url: '/Questions',
            ncyBreadcrumb: {
                label: '문의하기'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/questions/questions.html',
                    controllerAs: 'vm',
                    controller: questionsController
                }
            },
            resolve: {
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Questions.detail', {
            url: '/:id',
            ncyBreadcrumb: {
                label: '문의상세'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/questions/questions-detail.html',
                    controllerAs: 'vm',
                    controller: questionsEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Questions.new', {
            url: '/new',
            ncyBreadcrumb: {
                label: '문의작성'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/questions/questions-new.html',
                    controllerAs: 'vm',
                    controller: questionsEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Questions.edit', {
            url: '/edit/:id',
            ncyBreadcrumb: {
                label: '문의 작성'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/questions/questions-new.html',
                    controllerAs: 'vm',
                    controller: questionsEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
});

function questionsController($scope, $rootScope, helperService, uiGridConstants, $state, questionsService, $mdMedia, $mdDialog) {
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
        new: fnNew,
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

        $state.go('Questions.detail', {
            id: row.entity.QUE_ID
        });

        // helperService.getDialog3(['$scope', '$log', 'helperService', '$mdDialog', '$mdMedia', noticeEditController], 'partials/notice/notice-edit.html');
    }

    function fnSearch() {
        var params = {firstRow: 0, lastRow: 0};



        if($rootScope.currentUser.MEM_ADMIN_YN != 'Y') {
            params['MEM_ID'] = $rootScope.currentUser.MEM_ID;
        }

        if (vm.search.QUE_QS_TITLE) {
            params['QUE_QS_TITLE'] = vm.search.QUE_QS_TITLE;
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        return questionsService.getList(params).then(function (data) {
            vm.gridOptions.data = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
            console.log(vm.gridOptions.data);
        });
    }

    function fnNew() {
        $state.go('Questions.new');
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
                    field: 'QUE_QS_TITLE',
                    displayName: '문의제목',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'QUE_QS_DT',
                    displayName: '문의일자',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                },

                {
                    field: 'QUE_STATE',
                    displayName: '답변여부',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
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

        if($rootScope.currentUser.MEM_ADMIN_YN == 'Y') {
            var mem_name = {
                field: 'MEM_NAME',
                displayName: '질문자',
                cellTooltip: true,
                headerCellClass: 'text-align-center',
                width: 100,
                enableHiding: false,
                suppressRemoveSort: true,
                enableColumnMenu: false,
                enableSorting: false
            };
            gridOptions.columnDefs.push(mem_name);
        }

        return gridOptions;
    }
}

function questionsEditController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, questionsService, Upload, $timeout) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id, fileCount = 0, fileUploadCnt, image_ids = [];

    angular.extend(vm, {
        save: fnSave,
        edit: fnEdit,
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        // picFile: null,
        fileSelect: fileSelect,
        files: [],
        errFiles: [],
        update: fnUpdate,
        delete: fnDelete,
        deleteButton: $state.params.id
    });

    function activate() {
        id = $state.params.id;
        fnSearch();
    }

    function fnSearch() {
        if (!id) {
            /*vm.notice = {NO_TEACHER_YN: 'Y'};*/
            return;
        }

        questionsService.getData(id).then(function (data) {
            vm.question = data;

        });
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

    //이미지 파일 업로드
    function fnUploadPicture(file, url, MEM_ID, idx) {
        file.upload = Upload.upload({
            url: '/api' + url,
            data: {
                file: file,
                MEM_ID: MEM_ID,
                idx: idx
            }
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
                // 성공시
                vm.picFile = null;
                fileUploadCnt += 1;
                fnSaved();
            });
        }, function (response) {
            if (response.status > 0) $log.log('오류 발생 : ' + response.status + ' - ' + response.data);
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    function fnUpdate() {
        if (!scope.questionForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;

            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }
        fileCount = 0;

        if (id) { // 수정
            vm.user.SEI_ID = id;
            bloomengineService.saveData(vm.user).then(function (result) {
                if (vm.picFile) { // 업로드할 첨부파일이 존재할 경우
                    ++fileCount;
                    fnUploadPicture(vm.picFile, '/TB_SEED/upload', id, "seed");
                }
                fnSaved();
            });
        } else { // 신규
            bloomengineService.saveData(vm.user).then(function (result) {
                if (vm.picFile) { // 업로드할 첨부파일이 존재할 경우
                    ++fileCount;
                    fnUploadPicture(vm.picFile, '/TB_SEED/upload', result.data, "seed");
                }
                fnSaved();
            });
        }
    }

    function fnDelete() {
        // 삭제확인
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.question.QUE_ID = id;
            return questionsService.deleteData(vm.question).then(function (news) {
                helperService.mdToast(msg.deleted);
                helperService.goBack();
            })
        });
    }

    function fnSave() {
        if (!scope.questionForm.$valid) {
            $log.log('입력에러', scope.questionForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        fileCount = 0;

        vm.question['MEM_ID'] = $rootScope.currentUser.MEM_ID;
        vm.question['MEM_ADMIN_YN'] = $rootScope.currentUser.MEM_ADMIN_YN;

        vm.question.id = id;
        questionsService.saveData(vm.question).then(function (result) {
            helperService.mdToast(msg.saved);
            fnCancel();
        });

        /*        if (vm.files && vm.files.length > 0) { // 업로드할 첨부파일이 존재할 경우
                    if (id) vm.notice.id = id;
                    image_ids = [];
                    fnUploadPicture(vm.picFile, vm.notice);
                } else {
                    if (id) { // 수정
                        vm.user.id = id;
                        memberService.updateData(vm.notice).then(function (result) {
                            helperService.mdToast(msg.saved);
                            fnList();
                        });
                    } else { // 신규
                        memberService.saveData(vm.notice).then(function (result) {
                            helperService.mdToast(msg.saved);
                            fnList();
                        });
                    }
                }*/
    }

    function fnEdit() {
        $state.go('Questions.edit', {
            id: vm.question.QUE_ID
        });
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnList() {
        helperService.mdToast(msg.saved);
        helperService.goBack();
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
