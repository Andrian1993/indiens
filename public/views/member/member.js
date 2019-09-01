var app = angular.module('Indiens.member', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('Member', {
            parent: 'root',
            url: '/Member',
            ncyBreadcrumb: {
                label: '회원 관리'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/member/member.html',
                    controllerAs: 'vm',
                    controller: memberController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
        .state('Member.detail', {
            url: '/:id',
            ncyBreadcrumb: {
                label: '회원 상세'
            },

            views: {
                'uiSubArea@root': {
                    templateUrl: 'views/member/member-detail.html',
                    controllerAs: 'vm',
                    controller: memberEditController
                }
            },
            /*resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
                auth: function (authService) {
                    return authService.loggedIn({redirect: true});
                }
            }*/
        })
});

function memberController($scope, helperService, uiGridConstants, $state, memberService, $mdMedia, $mdDialog, member_type) {
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
        member_type: member_type,
        excelDialog: fnExcelDialog
    });

    scope.cellClicked = function (row, col) {
        if (col.field == '"selectionRowHeaderCol"') return;

        $state.go('Member.detail', {
            id: row.entity.MEM_ID
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

        return memberService.getList2(params).then(function (data) {
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
                    field: 'MEM_TYPE',
                    displayName: '직군',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'MEM_NAME',
                    displayName: '성명',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 100,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'MEM_TEL',
                    displayName: '전화번호',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    width: 150,
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableColumnMenu: false,
                    enableSorting: false
                },

                {
                    field: 'MEM_EMAIL',
                    displayName: '이메일',
                    cellTooltip: true,
                    headerCellClass: 'text-align-center',
                    cellClass: 'text-align-left',
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

function memberEditController($scope, $mdDialog, $log, $rootScope, $state, authService, helperService, $mdMedia, msg, memberService, member_type, member_experience, user_lang, Upload, $timeout) {
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
        addCoins: fnAddCoins
    });

    function activate() {
        id = $state.params.id;
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
