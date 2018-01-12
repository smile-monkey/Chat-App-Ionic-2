import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
@Component({
  selector: 'page-staffbymail',
  templateUrl: 'staffbymail.html'
})
 
export class staffbymailPage {
	public first_name:any;
	public last_name:any;
	public mobile:any;
	public email:any;
	public password:any;
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
		
	sendinvitbymail()
	{
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		  });
		loading.present();
		var that = this;
		/* let headers = new Headers(); */
		var headers:any = new Headers();
		headers.append('Content-Type', 'application/json');
		that.storage.get('user_id').then((val) => {
			let data=JSON.stringify({action: 'staff_registerby_mail',user_id: val,first_name: that.first_name,last_name: that.last_name,mobile: that.mobile,email: that.email,password: that.password});
			that.http.post('https://emailcipher.com/Emailcypher/ionicrequest.php',data,headers)
			.map(res => res.json()) 
			.subscribe(res => {
				if(res.status == 'true')
				{
					loading.dismiss();
					that.first_name = "";
					that.last_name = "";
					that.mobile = "";
					that.email = "";
					that.password = "";
					that.response = "";
					that.response_succ = res.success;
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