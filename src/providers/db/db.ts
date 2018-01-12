
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  dbase:SQLiteObject;
  sql:SQLite;
  isInserting:boolean = false;
  constructor(private sqlite: SQLite) {
    this.sql = this.sqlite;
    console.log('Hello DbProvider is ready');
  }

  initDb():Promise<any>{
    var $_this = this;
    return new Promise(function(resolve, reject){
      $_this.sql.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject)=>{
        $_this.dbase = db;
        $_this.dbase.executeSql('CREATE TABLE IF NOT EXISTS `chats` (`id` INTEGER UNIQUE, `messageData`	TEXT, `resceiptId` INTEGER, `type` INTEGER);', {})
        .then((res) => {
          console.log('result from create table', res);
          console.log('chats table created / opened');
        })
        .catch(e => console.log(e));
        resolve('db Initialized');
      })
      .catch(e => console.log(e));
    })
  }

  loadMessage(type, id):Promise<any>{
    var $_this = this;
    console.log('hia', $_this);
    console.log("type, id", [type, id]);
    return new Promise(function(resolve, reject){
      $_this.dbase.executeSql('SELECT * FROM chats WHERE type = ? AND resceiptId = ? ', [type, id])
      // this.dbase.executeSql('SELECT * FROM chats', [type, id])
      .then(res => {
        console.log('result from select all', res);
        resolve(res);
      })
      .catch(err => reject(err));
    });
  }

  getMessage(id, type, rescId):Promise<any>{
    var $_this = this;
    return new Promise(function(resolve, reject){
      $_this.dbase.executeSql('SELECT * FROM chats WHERE type = ? AND resceiptId = ? AND id = ?', [type, rescId, id])
      // this.dbase.executeSql('SELECT * FROM chats', [type, id])
      .then(res => {
        console.log('result from getMessage', res);
        resolve(res);
      })
      .catch(err => reject(err));
    });
  }

  saveMessage(type, id, mess):Promise<any> {
    var message = JSON.stringify(mess);
    var $_this = this;
    return new Promise(function (resolve,reject) {
      // if (this.isInserting == false) {
        // this.isInserting = true;
        // this.getMessage(mess.Id, type, id)
        //   .then((res) => {
        //     if (res.rows.length == 0) {
              $_this.dbase.executeSql('INSERT INTO chats (id, messageData, resceiptId, type) VALUES (?, ?, ?, ?)', [mess.Id, message, id, type])
                .then((res) => {
                  console.log('result from insert into', res);
                  console.log('data saved');
                  $_this.isInserting = false;
                  resolve(true);
                })
                .catch(e => {
                  console.log(e);
                  $_this.isInserting = false;
                  reject(false);
                });
            // }
          // })
          // .catch(e => {
          //   console.log(e);
          //   this.isInserting = false;
          //   reject(false);
          // });
      // }
    })
  }

  clearHistory(type, id){
    this.dbase.executeSql('DELETE FROM chats WHERE type = ? AND resceiptId = ?', [type, id])
    .then((res) =>{
      console.log('result from delete from', res);
      console.log('data deleted');
    })
    .catch(e => console.log(e));
  }
}
