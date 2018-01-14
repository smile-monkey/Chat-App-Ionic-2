import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
@Component({
  selector: 'page-invite',
  templateUrl: 'logout.html'
})

export class LogoutPage {
	 constructor(
     public navCtrl: NavController,
     public http:Http,
     public storage: Storage,
     private event:Events,
     public loadingCtrl: LoadingController) {
		let loading = this.loadingCtrl.create({
			content: 'Logout...'
		  });

		  loading.present();
		  setTimeout(() => {
			loading.dismiss();
		  }, 2000);

    this.storage.remove('user_id');
    this.event.publish('stopApp');
	}

}
