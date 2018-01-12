import { DbProvider } from './../../providers/db/db';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ChatPage } from '../../pages/chat/chat';

/**
 * Generated class for the ChatSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'chat-settings',
  templateUrl: 'chat-settings.html'
})
export class ChatSettingsComponent {
  type:any;
  id:any;
  chatpage:any;
  constructor(
    private viewCtrl: ViewController,
    private navprm: NavParams,
    private dbProvider: DbProvider
  ) {
    this.type = this.navprm.data.type;
    this.id = this.navprm.get('id');
    this.chatpage = this.navprm.get('cpage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  clearHistory(){
    this.dbProvider.clearHistory(this.type, this.id);
    this.chatpage.loadMessage();
    this.close();
  }

  deleteChat(){
    alert('Something that vikram have Todo Here');
    this.close();
  }

}
