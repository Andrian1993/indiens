(function () {
    'use strict';

    angular
        .module('app')
        .factory('homeService', homeService);

    function homeService(Restangular, $log) {
        var table_name = 'TB_CODE';
        var baseUrl = Restangular.all(table_name);

        return {
            getData: getData,
            getProjectsHome: getProjectsHome
        };

        function getData(params) {
            return Restangular.one(table_name).customGET('homeCount', params).then(getComplete).catch(callFailed);
        }

        function getProjectsHome(params) {
            return Restangular.one('TB_PROJECT').customGET('get/ProjectsHome', params).then(getComplete).catch(callFailed);
        }
    }
}());