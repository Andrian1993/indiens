var app = angular.module('Indiens.project', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('Project', {
            parent: 'root',
            url: '/Project',
            ncyBreadcrumb: {
                label: '프로젝트'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project.html',
                    controllerAs: 'vm',
                    controller: projectController
                }
            },
            params: {
                PJT_NAME: ''
            }
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Project.genre', {
            url: '/genre',
            ncyBreadcrumb: {
                label: '프로젝트 등록'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project-genre.html',
                    controllerAs: 'vm',
                    controller: projectGenreController
                }
            },
            resolve: {
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }
        })

        .state('Project.genreEdit', {
            url: '/genre/:id',
            ncyBreadcrumb: {
                label: '프로젝트 장르 수정'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project-genre.html',
                    controllerAs: 'vm',
                    controller: projectGenreController
                }
            },
            resolve: {
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }
        })

        .state('Project.new', {
            url: '/new/:newId',
            ncyBreadcrumb: {
                label: '프로젝트 등록'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project-regDetail.html',
                    controllerAs: 'vm',
                    controller: projectRegDetailController
                }
            },
            params: {PJT_ID: null},
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Project.edit', {
            url: '/:id',
            ncyBreadcrumb: {
                label: '프로젝트 수정'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project-regDetail.html',
                    controllerAs: 'vm',
                    controller: projectRegDetailController
                }
            },
            params: {PJT_ID: null},
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Project.detail', {
            url: '/detail/:id',
            // url: '/detail',
            ncyBreadcrumb: {
                label: '프로젝트 상세'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project-detail.html',
                    controllerAs: 'vm',
                    controller: projectEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Project.member', {
            // url: '/:id',
            url: '/member/:id',
            ncyBreadcrumb: {
                label: '프로젝트 상세'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/project/project-member.html',
                    controllerAs: 'vm',
                    controller: projectMemberController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })

});

function projectController($scope, helperService, uiGridConstants, $state, projectService, $mdMedia, $mdDialog) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi;

    function activate() {
        fnSearch();
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 12,
        sort: null
    };

    angular.extend(vm, {
        search: {PJT_NAME: $state.params.PJT_NAME},
        fnSearch: fnSearch,
        // new: fnNew,
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        update: fnUpdate,
        save: fnSave,
        // teacher_type: teacher_type,
        excelDialog: fnExcelDialog
    });

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        /*$state.go('Partner.detail', {
            id: row.entity.CAR_ID
        });*/

        // helperService.getDialog3(['$scope', '$log', 'helperService', '$mdDialog', '$mdMedia', noticeEditController], 'partials/notice/notice-edit.html');
    }

    function fnSearch() {
        var params = {firstRow: 0, lastRow: 0};

        if (vm.search.PJT_NAME) {
            params['PJT_NAME'] = vm.search.PJT_NAME;
        }

        var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        params.firstRow = firstRow;
        params.lastRow = paginationOptions.pageSize;

        return projectService.getList(params).then(function (data) {
            // vm.gridOptions.data = data[0].list;
            vm.projects = data[0].list;
            vm.totalItems = data[0].cnt;
            vm.currentPage = paginationOptions.pageNumber;
            console.log(vm.gridOptions.data);
        });
    }

    function fnUpdate(pjt_id) {
        $state.go('Project.detail', {
            id: pjt_id
        });
    }

    function fnSave() {
        $state.go('Project.genre');
        /*if (!scope.userForm.$valid) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }*/

        /*fileCount = 0;

        vm.user.id = id;
        memberService.updateData(vm.user).then(function (result) {
            if (result.code == 200) {
                fileCount = fileUploadCnt = 0;

                if (vm.picFile) { // 메인 사진
                    ++fileCount;
                    fnUploadPicture(vm.picFile, '/TB_MEMBER/upload', id, 'main');
                }

                if (fileCount <= 0) fnSaved();
                /!*helperService.mdToast(msg.saved);
                fnCancel();*!/
            } else {
                helperService.mdToast(result.message);
            }
        });*/


        /*        memberService.updateData(vm.user).then(function (result) {
                    if(result.code == 409){
                        helperService.mdToast(result.message);
                    } else {
                        helperService.mdToast(msg.saved);
                        fnList();
                    }
                });*/
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

function projectGenreController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, projectService, member_type) {
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
        if($state.params.id) {
            id = $state.params.id;
        }

        vm.data = {};
        vm.data.PJT_TYPE = {};
        /*id = $state.params.id;
        fnSearch();*/
    }

    function fnSearch() {
        if (!id) {
            return;
        }

        projectService.getData(id).then(function (data) {
            vm.user = data;
        });
    }

    function fnUpdate() {
        var optionCnt = 0;

        for (var keyName in vm.data.PJT_TYPE) {
            // $log.log(keyName, ' = ', vm.data.ET_OPTION[keyName]);
            if (vm.data.PJT_TYPE[keyName]) {
                optionCnt++;
                break;
            }
        }

        if (optionCnt <= 0) {
            vm.optionReq = true;
        } else {
            vm.optionReq = false;
        }

        if (!scope.inputForm.$valid || optionCnt <= 0) {
            $log.log('입력에러', scope.inputForm.$error);
            vm.showError = true;

            var dialog = helperService.getDialog('입력 항목을 확인해 주시기 바랍니다.');
            $mdDialog.show(dialog).then(function (result) {
            });
            return;
        }

        vm.data.MEM_ID = $rootScope.currentUser.MEM_ID;
        // console.log(vm.data.PJT_TYPE);
        if(!id) {
            projectService.saveData(vm.data).then(function (result) {
                if (result.code == 200) {
                    $state.go('Project.new', {
                        newId: result.data.PJT_ID
                    });
                } else {
                    helperService.mdToast(result.message);
                    // var dialog = helperService.getDialog(result.message);
                    // $mdDialog.show(dialog).then(function (result) {});
                }
            });
        } else {
            vm.data.PJT_ID = id;
            projectService.updateGenre(vm.data).then(function (result) {
                if (result.code == 200) {
                    $state.go('Project.new', {
                        newId: result.data.PJT_ID
                    });
                } else {
                    helperService.mdToast(result.message);
                    // var dialog = helperService.getDialog(result.message);
                    // $mdDialog.show(dialog).then(function (result) {});
                }
            });
        }

        // $state.go('Project.new');

        /*if (!scope.userForm.$valid) {
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
        });*/
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        fnCancel();
    }

    function fnCancel() {
        if(!id) {
            helperService.goBack();
        } else {
            // 삭제확인
            var confirm = helperService.confirmCancel();

            $mdDialog.show(confirm).then(function () {
                vm.user = {};
                vm.user.PJT_ID = id;
                return projectService.deleteData(vm.user).then(function (news) {
                    // helperService.mdToast(msg.deleted);
                    $state.go('Project');
                })
            });
        }
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

function projectRegDetailController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, projectService, member_type, Upload, $timeout) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id, PJT_ID, fileCount = 0, fileUploadCnt, image_ids = [], today;

    angular.extend(vm, {
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        addDetail: fnAddDetail,
        removeDetail: fnRemoveDetail,
        member_type: member_type,
        fileSelect: fileSelect,
        delete: fnDelete,
        edit: 'N',
        compareDate: fnCompareDate,
        minDate: new Date()
    });

    function activate() {
        id = $state.params.id;
        PJT_ID = $state.params.newId;
        vm.data = {
            details: [{}]
        }
        fnSearch();
    }

    function fnSearch() {
        if (!id) {
            // vm.data.PJT_DUE_DT = Date.now();
            vm.data.PJT_DUE_DT = null;
            today = new Date();
            return;
        }

        vm.edit = 'Y';
        var params = {
            id: id
        };

        projectService.getProjectInfo(params).then(function (data) {
            if(data.PJT_TYPE) {
                data.PJT_TYPE = JSON.parse(data.PJT_TYPE);
            }

            vm.data = data;
            vm.data.details = [];
            vm.data.workers = [];
            for(var i = 0; i < data.list.length; i++)
            vm.data.workers.push(data.list[i]);
            vm.minDate = new Date();
        });
    }

    function fnAddDetail() {
        if(!vm.data.PJT_ID) {
            vm.data.details.push({PJT_ID: PJT_ID});
        } else {
            vm.data.details.push({PJT_ID: vm.data.PJT_ID});
        }

    }

    function fnRemoveDetail(ev, index, gubun, JOB_ID) {
        if(gubun == 1) {
            var confirm = helperService.confirmDelete();

            $mdDialog.show(confirm).then(function () {
                var params = {
                    JOB_ID: JOB_ID
                };
                projectService.deleteWorkers(params).then(function (data) {
                    if(data.code == "200") {
                        vm.data.workers.splice(index, 1);
                    } else {
                        var dialog = helperService.getDialog(data.message);
                        // dialog.multiple(true);
                        $mdDialog.show(dialog).then(function (result) {
                        });
                    }
                });
            });
        } else {
            vm.data.details.splice(index, 1);
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

    //이미지 파일 업로드
    function fnUploadPicture(file, url, PJT_ID, idx) {
        file.upload = Upload.upload({
            url: '/api' + url,
            data: {
                file: file,
                PJT_ID: PJT_ID,
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

    function fnCompareDate(date) {
        console.log(date);

        var t = date.split(/[- :]/);
        var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        console.log(d);
    }

    function fnMinDate() {
        if(!vm.data.PJT_DUE_DT) {
            return new Date();
        } else {
            return vm.data.PJT_DUE_DT;
        }
    }

    function fnUpdate() {
        if (!vm.data.PJT_STEP) {
            vm.optionReq = true;
        } else {
            vm.optionReq = false;
        }



        if (!scope.inputForm.$valid || vm.optionReq == true) {
            $log.log('입력에러', scope.inputForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        fileCount = 0;

        // vm.user.id = id;
        if(!vm.data.PJT_ID) {
            vm.data.PJT_ID = PJT_ID;
        } else {
            vm.data.PJT_EDIT = '1';
        }


        if(!vm.data.PJT_EDIT) {
            projectService.saveData(vm.data).then(function (result) {
                if(result.code == 200){
                    fileCount = fileUploadCnt = 0;

                    if (vm.picFile) { // 프로젝트 사진
                        ++fileCount;
                        fnUploadPicture(vm.picFile, '/TB_PROJECT/upload', PJT_ID, 'main');
                    }

                    if (fileCount <= 0) fnSaved();
                    // fnSaved();
                } else {
                    helperService.mdToast(result.message);
                }
            });
        } else {
            projectService.updateProject(vm.data).then(function (result) {
                if(result.code == 200){
                    fileCount = fileUploadCnt = 0;

                    if (vm.picFile) { // 프로젝트 사진
                        ++fileCount;
                        fnUploadPicture(vm.picFile, '/TB_PROJECT/upload', vm.data.PJT_ID, 'main');
                    }

                    if (fileCount <= 0) fnSaved();
                    // fnSaved();
                } else {
                    helperService.mdToast(result.message);
                }
            });
        }



    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        $state.go('Project');
        // fnCancel();
    }

    function fnCancel() {
        helperService.goBack();
    }

    function fnDelete() {
        // 삭제확인
        /*var confirm = helperService.confirmCancel();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.PJT_ID = PJT_ID;
            return projectService.deleteData(vm.user).then(function (news) {
                // helperService.mdToast(msg.deleted);
                $state.go('Project');
            })
        });*/

        $state.go('Project.genreEdit', {
            id: PJT_ID
        });
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

function projectEditController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, projectService, member_type) {
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
        memberUpdate: fnMemberUpdate,
        member_type: member_type,
        propose: fnPropose,
        favorite: fnFavorite,
        guest: guest,
        getProfile: fnGetProfile,
        changeClass: fnChangeClass,
        deleteProject: fnDeleteProject
    });

    function activate() {
        id = $state.params.id;
        fnSearch();
    }

    function fnSearch() {
        if (!id) {
            return;
        }

        /*projectService.getData(id).then(function (data) {
            vm.user = data;
            vm.jobs = data.list;
        });*/

        var MEM_ID;
        if($rootScope.currentUser) {
            MEM_ID = $rootScope.currentUser.MEM_ID;
        } else {
            MEM_ID = '';
        }

        var params = {
            id: id,
            MEM_ID: MEM_ID
        };

        projectService.getInfo(params).then(function (data) {
            vm.user = data;
            vm.jobs = data.list;
        });

    }

    function fnUpdate() {
        $state.go('Project.edit', {
            id: id
        });
    }

    function fnGetProfile(mem_id) {
        $state.go('Partner.detail', {
            id: mem_id
        });
    }

    function fnMemberUpdate() {
        // $state.go('Project.member');

        $state.go('Project.member', {
            id: id
        });
        /*if (!scope.userForm.$valid) {
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
        });*/
    }

    function fnChangeClass(FAB_YN) {
        if (FAB_YN === "Y") {
            return "md-icon-button md-accent on";
        } else {
            return "md-icon-button md-accent"; // Or even "", which won't add any additional classes to the element
        }
    }

    function fnDeleteProject() {
        // 삭제확인
        var confirm = helperService.confirmDelete();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.PJT_ID = id;
            return projectService.deleteProject(vm.user).then(function (result) {
                helperService.mdToast(msg.deleted);
                $state.go('Project');
                // helperService.goBack();
            });
        });
    }

    function fnPropose(JOB_TYPE, JOB_ID) {
        if(!vm.guest || $rootScope.currentUser.MEM_ID == vm.user.MEM_ID) {
            return;
        }
        var obj;
        if(JOB_TYPE) {
            obj = {
                PJT_ID: id,
                JOB_ID: JOB_ID,
                JOB_TYPE: JOB_TYPE,
                MEM_ID: vm.user.MEM_ID
            };
        } else {
            obj = {
                PJT_ID: id,
                MEM_ID: vm.user.MEM_ID
            };
        }



        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', 'msg', '$mdMedia', 'projectService', 'partnerService', 'resolveValue', proposePopController], 'views/dialog/propose.html', true, obj);
    }

    function fnFavorite() {
        vm.user.FAB_YN = vm.user.FAB_YN == 'Y' ? 'N':'Y';
        vm.user.PJT_ID = id;
        vm.user.FAB_MEM = $rootScope.currentUser.MEM_ID;
        projectService.addToFab(vm.user).then(function (result) {
            if(result.code == 200){
                // fnSaved();
                helperService.mdToast(result.message);
            } else {
                helperService.mdToast(result.message);
            }
        });
    }

    function fnSaved() {
        helperService.mdToast(msg.saved);
        // fnCancel();
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

function projectMemberController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, projectService, member_type) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var id;

    angular.extend(vm, {
        cancel: fnCancel,
        openDialog: fnOpenDialog,
        files: [],
        errFiles: [],
        update: fnUpdate,
        save: fnSave,
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

        var params = {
            id: id
        };

        projectService.getMembersInfo(params).then(function (data) {
            vm.user = data;
            vm.jobs = data.list;
        });
    }

    function fnUpdate(JOB_ID) {
        var obj = {
            PJT_ID: id,
            JOB_ID: JOB_ID
        };

        helperService.getDialog3(['$scope', '$mdDialog', '$log', '$rootScope', '$state', 'authService', 'helperService', '$mdMedia', 'projectService', 'msg', 'resolveValue', memberChangePopController], 'views/dialog/member-change.html', true, obj, function () {
            fnSearch();
        });

        /*var user = {};
        helperService.getDialog3(['$scope', '$log', 'helperService', 'problemService', '$mdDialog', '$mdMedia', 'msg', 'resolveValue', problemEditController], 'views/dialog/problem.html', true, user, function () {
            fnSearch();
        });*/
        /*if (!scope.userForm.$valid) {
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
        });*/
    }

    function fnSave() {
        // $state.go('Project');

        projectService.updateMembersinfo(vm.jobs).then(function (result) {
            if (result.code == 200) {
                fnSaved();
            } else {
                helperService.mdToast(result.message);
            }
        });


        /*if (!scope.userForm.$valid) {
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
        });*/

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

function proposePopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, msg, $mdMedia, projectService, partnerService, obj) {
    var vm = this, scope = $scope, PJT_ID = obj.PJT_ID, MEM_ID = obj.MEM_ID;
    vm.$onInit = activate;

    function activate() {
        if(!obj.JOB_TYPE && !obj.JOB_ID) {
            fnSearch()
        } else {
            vm.positions = [{
                JOB_ID: obj.JOB_ID,
                JOB_TYPE: obj.JOB_TYPE,
                JOB_EDIT: 1
            }];
        }
    }

    angular.extend(vm, {
        confirm: fnConfirm,
        // user: {MEM_NICK: '효섭1', MEM_TEL: '010123456781'},
        cancel: function () {
            $mdDialog.cancel();
        },
        savePropose: fnSavePropose,
    });

    function fnSearch() {
        if (!PJT_ID) {
            return;
        }

        partnerService.getPositionsList(PJT_ID).then(function (result) {
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
        vm.user.PJT_ID = PJT_ID;
        if(!vm.user.JOB_ID) {
            vm.user.JOB_ID = vm.positions[0].JOB_ID;
        }


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


function memberChangePopController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, projectService, msg, obj) {
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
        getProfile: fnGetProfile,
        changeMember: fnChangeMember
    });

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
