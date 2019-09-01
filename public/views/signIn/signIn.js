var app = angular.module('Indiens.signIn', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('SignIn', {
            parent: 'root',
            url: '/SignIn',
            ncyBreadcrumb: {
                label: '회원정보 입력'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/signIn/signIn.html',
                    controllerAs: 'vm',
                    controller: signInController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })

        .state('SignIn.edit', {
            url: '/SignIn/:id',
            ncyBreadcrumb: {
                label: '회원정보 입력'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/signIn/signIn.html',
                    controllerAs: 'vm',
                    controller: signInController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })

        .state('SignIn.type', {
            url: '/type/:id',
            ncyBreadcrumb: {
                label: '직군 선택'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/signIn/signIn-type.html',
                    controllerAs: 'vm',
                    controller: signInTypeController
                }
            },
            params: {MEM_ID: null},
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('SignIn.portfolio', {
            url: '/portfolio/:id',
            ncyBreadcrumb: {
                label: '포트폴리오 등록'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/signIn/signIn-portfolio.html',
                    controllerAs: 'vm',
                    controller: signInPortfolioController
                }
            },
            params: {
                MEM_ID: null,
                MEM_TYPE: null
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
});

function signInController($scope, $log, helperService, uiGridConstants, $state, signInService, $mdMedia, $mdDialog) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi, id;

    function activate() {
        if($state.params.id) {
            id = $state.params.id;
        }
        fnSearch();
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };

    angular.extend(vm, {
        search: fnSearch,
        signUp: signUp,
        // new: fnNew,
        gridOptions: gridOption(),
        fnPaging: fnPaging,
        pageSize: paginationOptions.pageSize,
        totalItems: 0,
        currentPage: 1,
        update: fnUpdate,
        cancel: fnCancel,
        // teacher_type: teacher_type,
        excelDialog: fnExcelDialog,
        inputErrors: {}
    });

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        $state.go('Partner.detail', {
            id: row.entity.CAR_ID
        });

        // helperService.getDialog3(['$scope', '$log', 'helperService', '$mdDialog', '$mdMedia', noticeEditController], 'partials/notice/notice-edit.html');
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

        if(!id) {
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
        } else {
            if (vm.user.MEM_PASS_NEW != vm.user.confirm_password_new) {
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
        }



        // $log.log('회원가입', vm.user);
        if(!id) { //신규
            signInService.signup(vm.user).then(function (result) {
                if (result.code == 200) {
                    // helperService.mdDialog('인디언즈 서비스에 가입되었습니다. 로그인해 주시기 바랍니다.');
                    $state.go('SignIn.type', {
                        id: result.data.MEM_NUM,
                        MEM_ID: result.data.MEM_NUM
                    });
                } else {
                    helperService.mdToast(result.message);
                    // var dialog = helperService.getDialog(result.message);
                    // $mdDialog.show(dialog).then(function (result) {});
                }
            });
        } else {
            signInService.signupUpdate(vm.user).then(function (result) {
                if (result.code == 200) {
                    // helperService.mdDialog('인디언즈 서비스에 가입되었습니다. 로그인해 주시기 바랍니다.');
                    $state.go('SignIn.type', {
                        id: result.data.MEM_NUM,
                        MEM_ID: result.data.MEM_NUM
                    });
                } else {
                    helperService.mdToast(result.message);
                    // var dialog = helperService.getDialog(result.message);
                    // $mdDialog.show(dialog).then(function (result) {});
                }
            });
        }


    }

    function fnSearch() {
        if (!id) {
            return;
        }
        var params = {
            MEM_ID: id
        }

        return signInService.getUserInfo(params).then(function (data) {
            vm.user = data[0];
        });
    }

    function fnUpdate() {
        $state.go('SignIn.type');
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

    function fnCancel() {
        // helperService.goBack();
        if(!id) {
            $state.go('home');
        } else {
            var confirm = helperService.confirmCancel();

            $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.MEM_ID = id;
            return signInService.deleteData(vm.user).then(function (news) {
                // helperService.mdToast(msg.deleted);
                $state.go('home');
            })
        });
        }

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

function signInTypeController($scope, helperService, uiGridConstants, $state, signInService, $mdMedia, $mdDialog) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi;
    var MEM_ID;

    function activate() {
        // MEM_ID = $state.params.MEM_ID;
        MEM_ID = $state.params.id;
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
        update: fnUpdate,
        delete: fnDelete,
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

    function fnUpdate() {
        // $state.go('SignIn.portfolio');
        vm.user['MEM_STEP'] = '2';
        vm.user['MEM_ID'] = MEM_ID;
        signInService.saveData(vm.user).then(function (result) {
            if (result.code == 200) {
                $state.go('SignIn.portfolio', {
                    id: MEM_ID,
                    MEM_ID: MEM_ID,
                    MEM_TYPE: vm.user.MEM_TYPE
                });
            } else {
                helperService.mdToast(result.message);
                // var dialog = helperService.getDialog(result.message);
                // $mdDialog.show(dialog).then(function (result) {});
            }
        });
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

    function fnDelete() {
        // 삭제확인
        /*var confirm = helperService.confirmCancel();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.MEM_ID = MEM_ID;
            return signInService.deleteData(vm.user).then(function (news) {
                // helperService.mdToast(msg.deleted);
                $state.go('home');
            })
        });*/


        $state.go('SignIn.edit', {
            id: MEM_ID
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

function signInPortfolioController($scope, $log, helperService, uiGridConstants, $state, signInService, $mdMedia, $mdDialog, member_experience, Upload, $timeout) {
    var vm = this, scope = $scope;
    vm.$onInit = activate;
    var gridApi;
    var MEM_ID, MEM_TYPE,  fileCount = 0, fileUploadCnt, image_ids = [];

    function activate() {

        // MEM_ID = $state.params.MEM_ID;
        MEM_ID = $state.params.id;
        fnSearch();
        // MEM_TYPE = $state.params.MEM_TYPE;

       /* MEM_ID = '25';
        MEM_TYPE = '3';*/

        /*vm.user = {};
        vm.user.MEM_TYPE = MEM_TYPE;
        vm.user.GME_YN = 'N';
        vm.user.PIC_YN = 'N';
        vm.user.AUD_YN = 'N';

        vm.user.details = [{}];*/
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
        addDetail: fnAddDetail,
        removeDetail: fnRemoveDetail,
        member_experience: member_experience,
        excelDialog: fnExcelDialog,
        fileSelect: fileSelect,
        files: [],
        errFiles: [],
        picRemove: fnPicRemove,
        fnFileDelete: fnFileDelete,
        delete: fnDelete
    });


    function fnSearch() {
        var params = {
            MEM_ID: MEM_ID
        };

        return signInService.getUserType(params).then(function (data) {
            vm.user = data;
            // vm.user.MEM_TYPE = MEM_TYPE;
            vm.user.GME_YN = 'N';
            vm.user.PIC_YN = 'N';
            vm.user.AUD_YN = 'N';
            // vm.user.PRF_FILE = '../../img/ex/ex_photo2.png';

            vm.user.details = [{}];
            console.log(vm.gridOptions.data);
        });
    }

    function fileSelect(files, errFiles) {
        /*angular.forEach(files, function (file) {
            file['content'] = file.lastModified;
            file['content'] = file.lastModified;
        });*/

        $log.log('파일 선택 files : ', files);
        $log.log('파일 선택 errFiles : ', errFiles);

        // vm.files = files;
        for(var i = 0; i<files.length; i++) {
            vm.files.push(files[i]);
        }

        vm.errFiles = errFiles;
    }

    function fnAddDetail() {
        vm.user.details.push({});
    }

    function fnRemoveDetail(ev, index, com) {
        vm.user.details.splice(index, 1);
    }

    function fnPicRemove(idx) {
       /* if (gubun == 1) {
            vm.select_imgs.splice(idx, 1);
        } else {
            vm.select_imgs2.splice(idx, 1);
        }*/
        vm.files.splice(idx, 1);
    }

    function fnFileDelete(ev, index, file) {
        // 삭제확인
       /* var confirm = $mdDialog.confirm()
            .title('한국성서한림원')
            .textContent('삭제 하시겠습니까?')
            .ariaLabel('삭제')
            .clickOutsideToClose(true)
            .targetEvent(ev)
            .ok('확인')
            .cancel('취소');*/

        vm.files.splice(index, 1);

        /*$mdDialog.show(confirm).then(function () {
            return articleService.deleteFile(file.id).then(function (news) {
                vm.article.attachments.splice(index, 1);
                helperService.mdToast('삭제 하였습니다');
            });
        }/!*, function() {
         $log.log('삭제 취소');
         }*!/);*/
    }



    function fnUpdate() {
        // $state.go('home');
        var optionCnt = 1;

        if(vm.user.MEM_TYPE == '2') {
            for (var keyName in vm.user.MEM_LANG) {
                // $log.log(keyName, ' = ', vm.data.ET_OPTION[keyName]);
                if (vm.user.MEM_LANG[keyName]) {
                    optionCnt++;
                    break;
                }
            }

            if (optionCnt <= 1) {
                vm.optionReq = true;
                optionCnt = 0;
            } else {
                vm.optionReq = false;
            }
        }

        if (!scope.userForm.$valid || optionCnt <= 0) {
            $log.log('입력에러', scope.userForm.$error);
            vm.showError = true;
            helperService.mdToast('입력 항목을 확인해 주시기 바랍니다');
            return;
        }

        vm.user['MEM_STEP'] = '3';

        fileCount = 0;

        vm.user.MEM_ID = MEM_ID;

        if(vm.user.GME_YN == 'Y') {
            vm.user.details = [];
        }

        if(vm.user.PIC_YN == 'Y' || vm.user.AUD_YN == 'Y') {
            vm.files = [];
        }


        /*if (vm.files && vm.files.length > 0) { // 업로드할 첨부파일이 존재할 경우
            image_ids = [];
            fnUploadPicture(vm.picFile, vm.user);
        } else {
            signInService.saveData(vm.user).then(function (result) {
                if (result.code == 200) {
                    fileCount = fileUploadCnt = 0;

                    /!*if (vm.picFile) { // 메인 사진
                        ++fileCount;
                        fnUploadPicture(vm.picFile, '/TB_MEMBER/upload', MEM_ID, 'main');
                    }*!/

                    if (fileCount <= 0) fnSaved();
                    /!*helperService.mdToast(msg.saved);
                    fnCancel();*!/
                } else {
                    helperService.mdToast(result.message);
                }
            });
        }*/

        signInService.saveData(vm.user).then(function (result) {
            // if (!id) id = result.data;
            if (result.code == 200) {
                fileCount = fileUploadCnt = 0;

                if(vm.files && vm.files.length > 0) {
                    fileCount += vm.files.length;
                    var idx = 0;

                    for (var i = 0; i < vm.files.length; i++) {
                        fnUploadPicture(vm.files[i], '/TB_PORTFOLIO/upload', MEM_ID, 1, 'PRF_FILE');
                    }
                }
                helperService.mdDialog('인디언즈 서비스에 가입되었습니다. 로그인해 주시기 바랍니다.');
                $state.go('home');
            } else {
                helperService.mdToast(result.message);
            }



            /*if (vm.select_imgs.length > 0) { // 도면 이미지
                fileCount += vm.select_imgs.length;
                var idx = 0;
                if (vm.data['ET_SKT_IMGS']) idx = Object.keys(vm.data['ET_SKT_IMGS']).length; // 기존에 저장된 이미지

                for (var i = 0; i < vm.select_imgs.length; i++) {
                    fnUploadPicture(vm.select_imgs[i], '/TB_ESTATE/upload', id, (i + 1 + idx), 'ET_SKT_IMG');
                }
            }

            if (vm.select_imgs2.length > 0) { // 매물 사진
                fileCount += vm.select_imgs2.length;
                var idx = 0;
                if (vm.data['ET_IMGS']) idx = Object.keys(vm.data['ET_IMGS']).length; // 기존에 저장된 이미지

                for (var i = 0; i < vm.select_imgs2.length; i++) {
                    fnUploadPicture(vm.select_imgs2[i], '/TB_ESTATE/upload2', id, (i + 1 + idx), 'ET_IMG');
                }
            }*/

            // fnAfterSave({code: 200});
        });





    }

    function fnSaved() {
        // helperService.mdToast(msg.saved);
        $state.go('home');
    }


    function fnDelete() {
        // 삭제확인
        /*var confirm = helperService.confirmCancel();

        $mdDialog.show(confirm).then(function () {
            vm.user = {};
            vm.user.MEM_ID = MEM_ID;
            return signInService.deleteData(vm.user).then(function (news) {
                // helperService.mdToast(msg.deleted);
                $state.go('home');
            })
        });*/
        $state.go('SignIn.type', {
            id: MEM_ID,
            MEM_ID: MEM_ID
        });

    }


    //이미지 파일 업로드
    function fnUploadPicture(file, url, id, idx, colName) {
        file.upload = Upload.upload({
            url: '/api' + url,
            data: {
                file: file,
                id: id,
                idx: idx,
                colName: colName
            }
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
                // 성공시
                vm.picFile = null;
                fileUploadCnt += 1;
                fnAfterSave(response.data);
            });
        }, function (response) {
            if (response.status > 0) {
                $log.log('오류 발생 : ' + response.status + ' - ' + response.data);
                fnAfterSave(response.data);
            }
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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


    /*function fnUploadPicture() {
        angular.forEach(vm.files, function (file, key) {
            $log.log('파일 업로드 file : ', file);

            file.upload = Upload.upload({
                url: '/api/TB_PORTFOLIO/upload',
                data: {file: file, seq: key}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    $log.log('업로드 결과 : ', response.data);
                    file.result = response.data;
                    image_ids.push(response.data);
                    // vm.article.attach_id = response.data.attach_id;
                    fileCount += 1;
                    // if (fileCount >= vm.files.length) fnList();
                    if (fileCount >= vm.files.length) {
                        $log.log('업로드 완료 : ', vm.files.length);
                        signInService.saveData(vm.user, image_ids).then(function (news) {
                            helperService.mdToast(msg.saved);
                            // fnList();
                        });
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        });
    }*/

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

