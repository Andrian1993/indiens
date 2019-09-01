(function () {
    'use strict';

    angular
        .module('app')
        .factory('profileService', profileService);

    function profileService(Restangular, $log) {

        var table_name = 'TB_MEMBER';
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
            getCityCodeList: getCityCodeList,
            getCityGuCodeList: getCityGuCodeList,
            getChartypes: getChartypes,


            getSuggestions: getSuggestions,
            getSuggestionsOut: getSuggestionsOut,
            getFabs: getFabs,
            getProposeInfo: getProposeInfo,
            changeState: changeState,
            changeStateOut: changeStateOut,
            coinsUse: coinsUse,
            deleteData: deleteData,
            getNotes: getNotes,
            getNotesOut: getNotesOut,
            getCoins: getCoins,
            buyCoins: buyCoins,
            deleteMember: deleteMember
        };

        function getSuggestions(params) {
            return Restangular.one('TB_PROPOSAL').customGET('getSuggestions', params).then(getComplete).catch(callFailed);
        }

        function getSuggestionsOut(params) {
            return Restangular.one('TB_PROPOSAL').customGET('getSuggestionsOut', params).then(getComplete).catch(callFailed);
        }

        function getNotes(params) {
            return Restangular.one('TB_MESSAGE').customGET('getNotes', params).then(getComplete).catch(callFailed);
        }

        function getNotesOut(params) {
            return Restangular.one('TB_MESSAGE').customGET('getNotesOut', params).then(getComplete).catch(callFailed);
        }

        function getFabs(params) {
            return Restangular.all('TB_FABS').getList(params).then(getComplete).catch(callFailed);
        }

        function getCoins(params) {
            return Restangular.one('TB_COIN').customGET('getCoins', params).then(getComplete).catch(callFailed);
        }

        function buyCoins(params) {
            return Restangular.one('TB_COIN' + '/buyCoins').customPOST(params).then(getComplete).catch(callFailed);
        }

        function getProposeInfo(params) {
            return Restangular.one('TB_PROPOSAL').customGET('getProposeInfo', params).then(getComplete).catch(callFailed);
        }

        function changeState(params) {
            return Restangular.one('TB_PROPOSAL' + '/changeState').customPOST(params).then(getComplete).catch(callFailed);
        }

        function changeStateOut(params) {
            return Restangular.one('TB_PROPOSAL' + '/changeStateOut').customPOST(params).then(getComplete).catch(callFailed);
        }

        function coinsUse(params) {
            return Restangular.one('TB_PROPOSAL' + '/coinsUse').customPOST(params).then(getComplete).catch(callFailed);
        }

        function deleteData(params) {
            return Restangular.one('TB_FABS' + '/delete').customPOST({id: params.FAB_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        function deleteMember(params) {
            return Restangular.one('TB_MEMBER' + '/delete').customPOST({id: params.MEM_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }

        //////////////////////////////////////////////////////////////////////////////////
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
