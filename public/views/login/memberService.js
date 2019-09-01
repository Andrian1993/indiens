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
            getData: getData,
            updateData: updateData,
            findId: findId,
            resetPasswd: resetPasswd,
            findResetPwd: findResetPwd,

        };

        function signup(params) {
            return Restangular.one(table_name + '/signup').customPOST(params).then(getComplete).catch(callFailed);
        }

        function getData(id) {
            return Restangular.one(table_name, id).get().then(getComplete).catch(callFailed);
        }

        function updateData(user) {
            return user.put().then(getComplete).catch(callFailed);
        }

        function findId(params) {
            return Restangular.one(table_name).customGET('findId', params).then(getComplete).catch(callFailed);
        }

        function resetPasswd(params) {
            return Restangular.one(table_name + '/resetPasswd').customPOST(params).then(getComplete).catch(callFailed);
        }

        function findResetPwd(params) {
            return Restangular.one('TB_MEMBER').customGET('get/resetPwd', params).then(getComplete).catch(callFailed);
        }


    }
}());
