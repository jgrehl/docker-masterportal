const inquirer = require("inquirer"),
    convertConfigJson = require("./convertConfigJson.js"),
    questions = [
        {
            type: "input",
            name: "sourcePath",
            message: "Pfad zum Portal, das nach 3.0.0 konvertiert werden soll (ausgehend von \"[...]/masterportal/\"):\n",
            // default: "portal/master_dev"//"portal/basic_dev"
            default: "portalconfigs/geo-online"
        },
        {
            type: "input",
            name: "destPath",
            message: "Pfad unter dem das konvertierte Portal abgelegt werden soll (ausgehend von \"[...]/masterportal/\"):\n",
            // default: "portal/master_dev_vue"//"portal/basic_dev_vue"
            default: "portalconfigs/geo-online_3_0_0"
        }
    ];

inquirer.prompt(questions).then(function (answers) {
    convertConfigJson(answers);
});
