(function () {
    'use strict';

    angular
        .module('app')
        .factory('partnerService', partnerService);

    function partnerService(Restangular, $log) {

        var table_name = 'TB_PARTNER';
        var baseUrl = Restangular.all(table_name);

        return {
            getList: getList,
            getProjectList: getProjectList,
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
            getPositionsList: getPositionsList,
            savePropose: savePropose,
            saveMessage: saveMessage,
        };

        function getList(params) {
            return baseUrl.getList(params).then(getComplete).catch(callFailed);
        }

        function getData(id) {
            return Restangular.one(table_name, id).get().then(getComplete).catch(callFailed);
        }

        function getPositionsList(PJT_ID) {
            return Restangular.one(table_name).customGET('get/PositionsList', {'PJT_ID': PJT_ID}).then(getComplete).catch(callFailed);
        }

        function getProjectList(params) {
            return Restangular.one(table_name).customGET('get/ProjectList', params).then(getComplete).catch(callFailed);
        }

        function savePropose(params) {
            return Restangular.one(table_name + '/savePropose').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
        }

        function saveMessage(params) {
            return Restangular.one(table_name + '/saveMessage').customPOST(params).then(saveDataComplete).catch(callFailed);

            function saveDataComplete(response) {
                return response;
            }
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
    }
}());
