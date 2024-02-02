const inquirer = require("inquirer"),
    buildFunctions = require("./buildFunctions"),
    questions = [
        
    ];

inquirer.prompt(questions).then(function (answers) {
    buildFunctions(answers);
});
