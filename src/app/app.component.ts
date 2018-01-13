import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import 'expose-loader?jQuery!jquery';
import 'signalr';
import { Http } from '@angular/http';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { InvitePage } from '../pages/invite/invite';
import { LogoutPage } from '../pages/logout/logout';
import { DbProvider } from '../providers/db/db';
import { LocalNotifications } from '@ionic-native/local-notifications';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = HomePage;
  rootPage: any = null;

  pages: Array<{ title: string, component: any }>;
  userId: any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    private event: Events,
    private dbProvider: DbProvider,
    public storage: Storage,
    private localNotifications: LocalNotifications,
    public splashScreen: SplashScreen) {

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'User List', component: ListPage },
      { title: 'Invite', component: InvitePage },
      { title: 'Logout', component: LogoutPage }
    ];

    this.event.subscribe('startApp', (id) => {
      this.userId = id;
      this.startApp();
    });
    this.event.subscribe('stopApp', () => {
      this.stopApp();
    });
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // OneSignal Code start:
      // Enable to debug issues:
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      var notificationOpenedCallback = function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

      window["plugins"].OneSignal
        .startInit("426e2e39-5ea9-4387-996a-d5e567f83699", "243600679786")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
      this.initializeApp();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('user_id').then((user_id) => {
        if (user_id) {
          this.event.publish('startApp', user_id);
        }
        else {
          this.rootPage = HomePage;
        }
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  startApp() {
    if (window['jQuery'].connection.hub.state == 1) {
      window['jQuery'].connection.hub.stop();
    }

    window['jQuery'].connection.hub.qs = {
      'userId': this.userId
    };

    window['jQuery'].connection.hub.url = 'https://chat.emailcipher.com:8081/signalr';
    var hub = window['jQuery'].connection.chatHub;
    hub.on('MessageReceived', function (message) {
      var id = message.SenderId == this.userId ? message.RecipientId : message.SenderId;
      //here
      if (message.RecipientId == this.userId) {
        this.localNotifications.schedule({
          id: id,
          title: message.SenderName,
          text: message.Message,
        });
      }


      this.event.publish('messageReceived:' + message.SenderType + ':' + id, message);
      this.dbProvider.saveMessage(message.SenderType, id, message)
        .then(() => {
          // this.proccessMessage(message);
        })
        .catch(() => { });

    }.bind(this));
    window['jQuery'].connection.hub.start().done(function (e) {
      console.log(e);
      console.log('connected');
    })
      .fail(function () {
        console.log(' not connected');
      });
    this.dbProvider.initDb()
      .then((v) => {
        console.log(v);
        // this.navCtrl.setRoot(ListPage);
        this.nav.setRoot(ListPage);
      })
    // this.nav.setRoot(ListPage);
  }

  stopApp() {
    if (window['jQuery'].connection.hub.state == 1) {
      window['jQuery'].connection.hub.stop();
    }
    console.log('stopApp called');
    var hub = window['jQuery'].connection.chatHub;
    hub.off('MessageReceived', function (res) {
      console.log('MessageReceived Off with res', res);
    });
    this.nav.setRoot(HomePage);
  }

}
