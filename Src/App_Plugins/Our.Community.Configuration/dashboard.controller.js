angular.module("umbraco").controller("ConfigDashboardController", function ($scope, $filter, ConfigResource, userService, overlayService) {
    var vm = this;
    vm.loading = true;
    vm.UserName = "guest";
    vm.IsAdmin = false;

    vm.buttonState = "init";
    vm.syncResponse = "";
    vm.configSettingStatus = "init";

    vm.configSetting = {
        Name: "",
        Alias:"",
        Label: "",
        Value: "",
        Encrypted: false,
        Group: "",
        Type: 0,
        Key:""
    };


    vm.groups = [];
    vm.config = [];

    vm.deleteConfig = deleteConfig;
    vm.saveConfig = saveConfig;
    vm.updateConfigBool = toggleCheckBox;
    vm.onButtonClick = btnClick;

    init();

    userService.getCurrentUser().then(function (user) {
        vm.UserName = user.name;
        vm.IsAdmin = user.userGroups.includes("admin");
    });

    //Config values
    function init() {
        vm.loading = true;

        ConfigResource.getCustomConfig().then(function (response) {
            vm.config = [];
            angular.forEach(angular.fromJson(response.data), function (item) {
                console.log(item);
                var inputType = "text";
                if (item.type === 1) {
                    inputType = "number";
                }
                if (item.encrypted) {
                    inputType = "password";
                }
                if (item.type === 2) {
                    inputType = "checkbox";
                }
                vm.config.push({ Name: item.name,Alias: item.alias, Value: item.value, Label: item.label, Group: item.group, Type: inputType, PropType: item.type, Key: item.key });

            });
            getGroups();
            vm.loading = false;
        });

    }

    function deleteConfig(fieldname) {
        vm.loading = true;
        ConfigResource.deleteConfig(fieldname);
        refresh();
    }

    function saveConfig(filter) {
        
        vm.loading = true;
        var changes = [];
        var items = vm.config.filter(item => (item.Group != null && item.Group === filter) || item.Name === filter);
        angular.forEach(items, function (item) {
            setting = {
                "Name": item.Name,
                "Label": item.Label,
                "Value": item.Value,
                "Encrypted": item.Type === "password",
                "Group": item.Group,
                "Type" : item.PropType,
                "Key":item.Key
            };

            changes.push(setting);
        });

        ConfigResource.saveConfig(changes);

        refresh();
    };

    function btnClick() {
        var options = {
            view: Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + '/Our.Community.Configuration/overlay/overlay.html',
            title: 'Add Property',
            description: 'A custom view in an overlay',
            disableBackdropClick: true,
            disableEscKey: true,
            submitButtonLabel: 'Save',
            closeButtonLabel: 'Close',
            submit: function (model) {

                if (model.complete) {
                    overlayService.close();
                }
                else {
                    model.process();
                    vm.loading = true;
                    overlayService.close();
                    refresh();
                }

            },
            close: function () {
                overlayService.close();
            }

        }

        overlayService.open(options);
    }
    function toggleCheckBox(prop) {
        if (prop.Value === 1) {
            prop.Value = 0;
        } else {
            prop.Value = 1;
        }
    }

    function getGroups() {
        vm.groups = [];
        ConfigResource.displayGroups().then(function (response) {
            var groups = response.data;
            if (groups != null) {
                angular.forEach(angular.fromJson(groups), function (item) {
                    vm.groups.push(item);
                });
            }

        });
    }

    function refresh() {
        setTimeout(() => {
            vm.loading = true;
            init();
            vm.loading = false;
        }, 500);
    }

});
