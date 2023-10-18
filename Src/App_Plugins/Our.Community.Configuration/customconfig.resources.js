angular.module("umbraco.resources").factory("ConfigResource", function ($http) {
    return {
        getCustomConfig: function () {
            return $http.get("/umbraco/api/ourconfig/config");
        },
        addCustomConfig: function (config) {
            console.log(config);
            return $http.post("/umbraco/api/ourconfig/create", angular.toJson(config));
        },
        saveConfig: function (config) {
            $http.post("/umbraco/api/ourconfig/update", config);
        },
        deleteConfig: function (fieldname) {
            $http.post("/umbraco/api/ourconfig/delete", angular.toJson(fieldname));
        },
        displayGroups: function () {
            return $http.get("/umbraco/api/ourconfig/groups");
        }
    };
});
