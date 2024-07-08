const chalk = require("chalk")

module.exports.INFO = (string: String) => { 
    console.log(chalk.blue("[INFO]: ") + string)
}

module.exports.SUCCESS = (string: String) => { 
    console.log(chalk.green("[INFO]: ") + string)
}

module.exports.WARNING = (string: String) => { 
    console.log(chalk.yellow("[WARNING]: ") + string)
}

module.exports.ERROR = (string: any) => { 
    console.log(chalk.red("[ERROR]: ") + string)
}