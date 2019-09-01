(function () {
    'use strict';

    angular
        .module('app')
        .factory('questionsService', questionsService);

    function questionsService(Restangular, $log) {

        var table_name = 'TB_QUESTION';
        var baseUrl = Restangular.all(table_name);

        return {
            getList: getList,
            getData: getData,
            getLevel1: getLevel1,
            getLevel2: getLevel2,
            saveData: saveData,
            getPayList: getPayList,
            getReportList: getReportList,
            sendMsg: sendMsg,
            updateData: updateData,
            deleteData: deleteData,
            getCityCodeList: getCityCodeList,
            getCityGuCodeList: getCityGuCodeList,
            getChartypes: getChartypes
        };

        function getList(params) {
            return baseUrl.getList(params).then(getComplete).catch(callFailed);
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

        function deleteData(params) {
            return Restangular.one(table_name + '/delete').customPOST({id: params.QUE_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
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
