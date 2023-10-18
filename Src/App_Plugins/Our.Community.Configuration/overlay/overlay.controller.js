angular.module("umbraco").controller("ConfigOverlayController", function ($scope,ConfigResource) {
    var vm = this;
    vm.loading = true;

    vm.buttonState = "init";
    vm.configSettingStatus = "init";

    vm.configSetting = {
        Name: "",
        Label: "",
        Value: "",
        Encrypted: false,
        Group: "",
        Type: 0,
        Key:""
    };
    vm.varType = [
        { "name": "String", "value": 0 }
        , { "name": "Numeric", "value": 1 }
        , { "name": "Boolean", "value": 2 }];


    vm.selectType = selectType;
    vm.toggle = toggleType;

    $scope.model.process =  process;
    $scope.model.complete = false;

    function process() {
        vm.configSettingStatus = "busy";
        console.log(vm.configSetting);
        ConfigResource.addCustomConfig(vm.configSetting).then(function () {
            vm.configSettingStatus = "success";
            $scope.model.complete = true;
        });     

    }

    function toggleType() {
        vm.dropdownOpen = !vm.dropdownOpen;
    }
    function selectType(config, type) {
        config.PropType = type;
        config.Type = type.value;
        vm.dropdownOpen = false;
    }
});
