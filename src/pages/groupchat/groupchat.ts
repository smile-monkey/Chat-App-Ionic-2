import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, PopoverController, Events  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
// import $ from 'jquery';
import 'expose-loader?jQuery!jquery';
import 'signalr';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { ChatSettingsComponent } from '../../components/chat-settings/chat-settings';

@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
  queries: {
    content: new ViewChild('content')
  }
})

export class GChatPage {
  public item: any;
  public msg: any;
  public contactName: any;
  public recivername: any;
  public content: any;
  private htmlchg: string = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private dbProvider: DbProvider,
    private event: Events,
    public popoverCtrl: PopoverController,
    public http: Http) {

    this.item = navParams.get('item');
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    if (this.item.Name == null) {
      this.contactName = "User";
    } else {
      this.contactName = this.item.Name;
    }

    // var that = this;

    // var hub = $.connection.chatHub;
    // if ($.connection.hub.state == 1) {
    //   $.connection.hub.stop();
    // }

    // this.storage.get('user_id').then((val) => {
    //   $.connection.hub.qs = {
    //     'userId': val
    //   };
    // });

    // $.connection.hub.url = 'https://chat.emailcipher.com:8081/signalr';

    this.event.subscribe('messageReceived:'+this.item.Type+':'+this.item.Id, function(message){
      // this.dbProvider.saveMessage(this.item.Type, this.item.Id, message)
      // .then(() => {
        this.proccessMessage(message);
      // })
      // .catch(() => {});
    }.bind(this));
    // hub.on('MessageReceived', function (message) {
    //   console.log(message);
    //   //here
    //   this.dbProvider.saveMessage(this.item.Type, this.item.Id, message)
    //     .then(() => {
    //       this.proccessMessage(message);
    //     })
    //     .catch(() => {});

    // }.bind(this));

    // $.connection.hub.start().done(function (e) {
    //     console.log('connected');
    //   })
    //   .fail(function () {
    //     console.log(' not connected');
    //   });

    this.loadMessage();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  ionViewDidEnter(){
    if (window['jQuery'].connection.hub.state == 4) {
      window['jQuery'].connection.hub.start().done(function (e) {
        console.log(e);
        console.log('connected');
      })
      .fail(function () {
        console.log(' not connected');
      });
    }
  }

  loadMessage() {
    this.htmlchg = "";
    this.dbProvider.loadMessage(this.item.Type, this.item.Id)
      .then((item) => {
        console.log(item);
        var i = 0;
        var messArray = []
        while (i < item.rows.length) {
          let message = JSON.parse(item.rows.item(i).messageData);
          // this.proccessMessage(message);
          messArray.push(message);
          i++;
        }
        this.proccessMessage(messArray, true);
        // messages.forEach(message => {
        //   this.proccessMessage(messages);
        // });
      })
      .catch(e => console.log(e));
  }

  SendMessage() {
    this.storage.get('user_id').then((val) => {
      this.storage.get('username').then((username) => {
        console.log(this.item.Type);
        // if(this.item.Type == '2')
        // {

        var message = {
          Message: this.msg,
          IsGroupMessage: this.item.Type == '2',
          SenderName: username,
          SenderId: val,
          SenderType: this.item.Type,
          RecipientId: this.item.Id
        }
        // this.dbProvider.saveMessage(this.item.Type, this.item.Id, message);
        window['jQuery'].connection.chatHub.invoke('SendMessage', message);
        // this.proccessMessage(message);
        this.msg = "";
        // setTimeout(() => {
        // this.content.scrollToBottom();

        // });

        // }
        // else
        // {
        //   this.dbProvider.saveMessage(this.item.Type, this.item.Id, this.msg);
        // 	$.connection.chatHub.invoke('SendMessage', {
        // 	Message: this.msg,
        // 	SenderName: username,
        // 	SenderId: val,
        // 	RecipientId: this.item.Id
        // 	});
        // 	this.msg = "";
        // 	setTimeout(() => {
        // 	  this.content.scrollToBottom();
        // 	});
        // }
      });
    });
  }

  proccessMessage(theMessage, isArray ? : boolean) {
    var recivername = this.item.Name;
    var that = this;
    var messages = [];

    that.storage.get('user_id').then((val) => {
      that.storage.get('username').then((username) => {
        /* console.log(message); */
        if (isArray) {
          messages = theMessage;
        } else {
          messages.push(theMessage);
        }
        messages.forEach((message) => {
          var dateval = message.Date;
          var Date = dateval.split('T');
          var time = Date[1].split('.');

          if (message.SenderId == val) {
            if (message.RecipientId == that.item.Id) {
              this.htmlchg += '<div class="chatBubble"><div class="chat-bubble rightcol" style="float:right"><div class="message">' + message.Message + '</div><div class="message-detail"><p style="font-weight:bold;">' + username + '</p><p>' + Date[0] + ':' + time[0] + '</p></div></div></div>';
            }
          } else if (message.SenderId == that.item.Id) {
            if (message.RecipientId == val) {
              this.htmlchg += '<div class="chatBubble"><div class="chat-bubble leftcol" style="float:left"><div class="message">' + message.Message + '</div><div class="message-detail"><p style="font-weight:bold;">' + recivername + '</p><p>' + Date[0] + ':' + time[0] + '</p></div></div></div>';
            }
          } else {}
        });
        window['jQuery']('#groupsms').html(this.htmlchg);
        // that.content.scrollToBottom();
        // document.getElementById("cont").scrollIntoView();
        if(this.content._scroll) this.content.scrollToBottom(0);
      });
    });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ChatSettingsComponent, {
      type: this.item.Type,
      id: this.item.Id,
      cpage: this
    });
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillLeave(){
    this.event.unsubscribe('messageReceived:'+this.item.Type+':'+this.item.Id, function(message){
      console.log('messageReceived:'+this.item.Type+':'+this.item.Id+' unsibscribed');
    });
  }
}

