(function () {
    'use strict';

    angular
        .module('app')
        .factory('projectService', projectService);

    function projectService(Restangular, $log) {

        var table_name = 'TB_PROJECT';
        var baseUrl = Restangular.all(table_name);

        return {
            getList: getList,
            getData: getData,
            getInfo: getInfo,
            getLevel1: getLevel1,
            getLevel2: getLevel2,
            saveData: saveData,
            getPayList: getPayList,
            getReportList: getReportList,
            sendMsg: sendMsg,
            updateData: updateData,
            getCityCodeList: getCityCodeList,
            getCityGuCodeList: getCityGuCodeList,
            getChartypes: getChartypes,
            addToFab: addToFab,
            getProjectInfo: getProjectInfo,
            updateProject: updateProject,
            getMembersInfo: getMembersInfo,
            getMembersList: getMembersList,
            updateWorker: updateWorker,
            updateMembersinfo: updateMembersinfo,
            deleteWorkers: deleteWorkers,
            deleteData: deleteData,
            deleteProject: deleteProject,
            updateGenre: updateGenre
        };

        function getList(params) {
            return baseUrl.getList(params).then(getComplete).catch(callFailed);
        }

        function getData(id) {
            return Restangular.one(table_name, id).get().then(getComplete).catch(callFailed);
        }

        function getInfo(params) {
            return Restangular.one(table_name).customGET('get/Info', params).then(getComplete).catch(callFailed);
        }

        function getLevel1(params) {
            return Restangular.all('TB_CODE').getList(params).then(getComplete).catch(callFailed);
        }

        function getLevel2(params) {
            return Restangular.all('TB_CODE_SMALL').getList(params).then(getComplete).catch(callFailed);
        }

        function saveData(data) {
            return baseUrl.post(data).then(getComplete).catch(callFailed);
        }

        function updateData(params) {
            return params.put().then(getComplete).catch(callFailed);
        }

        function addToFab(params) {
            return Restangular.one('TB_FABS' + '/addToFab').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
        }

        function updateWorker(params) {
            return Restangular.one(table_name + '/updateWorker').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
        }

        function updateMembersinfo(params) {
            return Restangular.one(table_name + '/updateMembersInfo').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
        }

        function updateGenre(params) {
            return Restangular.one(table_name + '/updateGenre').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
        }


        function getProjectInfo(params) {
            return Restangular.one(table_name).customGET('get/ProjectInfo', params).then(getComplete).catch(callFailed);
        }

        function getMembersInfo(params) {
            return Restangular.one(table_name).customGET('get/MembersInfo', params).then(getComplete).catch(callFailed);
        }

        function getMembersList(params) {
            return Restangular.one(table_name).customGET('get/MembersList', params).then(getComplete).catch(callFailed);
        }

        function getPayList(params) {
            return Restangular.all('TB_PAYMENTS').getList(params).then(getComplete).catch(callFailed);
        }

        function updateProject(params) {
            return Restangular.one(table_name + '/updateProject').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
        }

        function deleteWorkers(params) {
            return Restangular.one('TB_JOBS' + '/delete').customPOST({id: params.JOB_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function deleteProject(params) {
            return Restangular.one(table_name + '/deleteProject').customPOST({id: params.PJT_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function deleteData(params) {
            return Restangular.one(table_name + '/delete').customPOST({id: params.PJT_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function getReportList(params) {
            return Restangular.one('TB_REPORT').customGET('getTeacherList', params).then(getComplete).catch(callFailed);
        }

        function sendMsg(params) {
            return Restangular.one(table_name + '/sendMsg').customPOST(params).then(getComplete).catch(callFailed);
        }

        function getCityCodeList(params) {
            return Restangular.one('code').customGET('getCityCodeList', params).then(getComplete).catch(callFailed);
        }

        function getCityGuCodeList(TEA_ADDRESS1) {
            return Restangular.one('code').customGET('getCityGuCodeList', {'CIT_AMDCODE': TEA_ADDRESS1}).then(getComplete).catch(callFailed);
        }

        function getChartypes(params) {
            return Restangular.one('TB_CHARTYPE').customGET('get/List', params).then(getComplete).catch(callFailed);
        }
    }
}());
