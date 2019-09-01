(function () {
    'use strict';

    angular
        .module('app')
        .factory('signInService', signInService);

    function signInService(Restangular, $log) {

        var table_name = 'TB_MEMBER';
        var baseUrl = Restangular.all(table_name);

        return {
            signup: signup,
            signupUpdate: signupUpdate,
            saveData: saveData,
            deleteData: deleteData,
            getUserType: getUserType,
            getUserInfo: getUserInfo
        };

        function getUserInfo(params) {
            return Restangular.one(table_name).customGET('get/getUserInfo', params).then(getComplete).catch(callFailed);
        }

        function signup(params) {
            return Restangular.one(table_name + '/signup').customPOST(params).then(getComplete).catch(callFailed);
        }

        function signupUpdate(params) {
            return Restangular.one(table_name + '/signupUpdate').customPOST(params).then(getComplete).catch(callFailed);
        }

        function saveData(data) {
            return baseUrl.post(data).then(getComplete).catch(callFailed);
        }

        function getUserType(params) {
            return Restangular.one(table_name).customGET('getUserType', params).then(getComplete).catch(callFailed);
        }

        function deleteData(params) {
            return Restangular.one(table_name + '/deleteMember').customPOST({id: params.MEM_ID}).then(deleteDataComplete).catch(callFailed);

            function deleteDataComplete(response) {
                return response;
            }
        }
    }
}());
