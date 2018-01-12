import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
@Component({
  selector: 'page-invite',
  templateUrl: 'docinvite.html'
}) 

export class docinvitePage {
	public content:any;
	public response:any;
	public response_succ:any;
	constructor(public navCtrl: NavController,public http:Http,public storage: Storage,public loadingCtrl: LoadingController) {
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		  });

		  loading.present();
		  setTimeout(() => {
			loading.dismiss();
		  }, 3000);
	}
Sendinvitation(){
	let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		  });
		loading.present();
	var that = this;
		/* let headers = new Headers(); */
		var headers:any = new Headers();
		headers.append('Content-Type', 'application/json');
		that.storage.get('user_id').then((val) => {
			let data=JSON.stringify({action: 'send_invitation',user_id: val,emails: that.content});
			that.http.post('https://emailcipher.com/Emailcypher/ionicrequest.php',data,headers)
			.map(res => res.json()) 
			.subscribe(res => {
				if(res.status == 'true')
				{
					loading.dismiss();
					that.content = "";
					that.response = "";
					that.response_succ = res.Successfully;
				}
			 else
			 {
				loading.dismiss();
				that.response_succ = "";
				that.response = res.error;
			 }

		}, (err) => {
				loading.dismiss();
				that.response = 'Something is wrong';
		});  
			});
}
}