(function () {
    'use strict';

    angular
        .module('app')
        .factory('memberService', memberService);

    function memberService(Restangular, $log) {

        var table_name = 'TB_MEMBER';
        var baseUrl = Restangular.all(table_name);

        return {
            signup: signup,
            findEmail: findEmail,
            getList: getList,
            getList2: getList2,
            updateData2: updateData2,
            updateDataAdmin: updateDataAdmin,
            getData: getData,
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
            deleteData: deleteData,
            deleteGame: deleteGame,
            findResetPwd: findResetPwd,
            resetPwd: resetPwd,
            findPasswd: findPasswd
        };

        function findEmail(params) {
            return Restangular.one(table_name).customGET('findEmail', params).then(getComplete).catch(callFailed);
        }

        function getList(params) {
            return baseUrl.getList(params).then(getComplete).catch(callFailed);
        }

        function getList2(params) {
            return Restangular.one(table_name).customGET('getList2', params).then(getComplete).catch(callFailed);
        }

        function updateData2(params) {
            return Restangular.one(table_name + '/updateData').customPOST(params).then(getComplete).catch(callFailed);
        }

        function updateDataAdmin(params) {
            return Restangular.one(table_name + '/updateDataAdmin').customPOST(params).then(getComplete).catch(callFailed);
        }

        function getData(id) {
            return Restangular.one(table_name, id).get().then(getComplete).catch(callFailed);
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

        function signup(params) {
            return Restangular.one(table_name + '/signup').customPOST(params).then(getComplete).catch(callFailed);
        }

        function updateData(params) {
            return params.put().then(getComplete).catch(callFailed);
        }

        function getPayList(params) {
            return Restangular.all('TB_PAYMENTS').getList(params).then(getComplete).catch(callFailed);
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

        function deleteData(params) {
            return Restangular.one('TB_PORTFOLIO' + '/delete').customPOST({id: params.PRF_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function deleteGame(params) {
            return Restangular.one('TB_GAMES' + '/delete').customPOST({id: params.GME_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function findResetPwd(params) {
            return Restangular.one('TB_MEMBER').customGET('get/resetPwd', params).then(getComplete).catch(callFailed);
        }

        function resetPwd(params) {
            return Restangular.one('TB_MEMBER/resetPwd').customPOST(params).then(getComplete).catch(callFailed);
        }

        function findPasswd(params) {
            return Restangular.one(table_name + '/findPasswd').customPOST(params).then(getComplete).catch(callFailed);
        }
    }
}());
