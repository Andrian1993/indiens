(function () {
    'use strict';

    angular
        .module('app')
        .factory('noticeService', noticeService);

    function noticeService(Restangular, $log) {

        var table_name = 'TB_BOARD';
        var baseUrl = Restangular.all(table_name);

        return {
            getList: getList,
            getData: getData,
            getDetail: getDetail,
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
            saveComment: saveComment,
            deleteData: deleteData,
            updateComment: updateComment,
            deleteComment: deleteComment
        };

        function getList(params) {
            return baseUrl.getList(params).then(getComplete).catch(callFailed);
        }

        function getData(id) {
            return Restangular.one(table_name, id).get().then(getComplete).catch(callFailed);
        }

        function getDetail(params) {
            return Restangular.one(table_name).customGET('get/detail', params).then(getComplete).catch(callFailed);
        }

        function saveComment(params) {
            return Restangular.one(table_name + '/saveComment').customPOST(params).then(getComplete).catch(callFailed);
        }

        function deleteData(params) {
            return Restangular.one(table_name + '/delete').customPOST({id: params.BRD_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function updateComment(params) {
            return Restangular.one(table_name + '/updateComment').customPOST(params).then(getComplete).catch(callFailed);
        }

        function deleteComment(params) {
            return Restangular.one(table_name + '/deleteComment').customPOST(params).then(getComplete).catch(callFailed);
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
