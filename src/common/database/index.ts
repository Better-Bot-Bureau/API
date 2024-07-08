
const { Sequelize, DataTypes } = require('sequelize');
require("dotenv").config()

import * as fs from "fs"
import * as path from "path"

const {ERROR, INFO, SUCCESS} = require("../util/logger")

let sql
( () => {
  let sequelize: typeof Sequelize
    if(process.env.DATABASE_DIALECT === 'sqlite'){
       sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });
    }else {
      sequelize = new Sequelize({
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        logging: false
    });
    }
 

      (async () => {
        try {
          await sequelize.authenticate();
          INFO('Connected to database.');
        } catch (error) {
         ERROR('Unable to connect to the database:', error);
        }
      })()
    

     
      function readModels(dir: string) {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files){
          const stat = fs.lstatSync(path.join(__dirname, dir, file))
          if(stat.isDirectory()){
            readModels(path.join("models", file))
          }else  {
            const model = require(path.join(__dirname, dir, file))
            SUCCESS(`Loaded model: ${file.split(".js")[0]}`)
            model(sequelize, DataTypes)
          }
        }
      }
      
      readModels("models");


      (async () => {
        await sequelize.sync({ force: false });
      })()

  
      sql = sequelize
})()

module.exports = sql