import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
/* import { HttpClient, HttpHeaders } from "@angular/common/http"; */

@Component({
  selector: 'page-staffbymail',
  templateUrl: 'staffbyuser.html'
})
 
export class staffbyuserPage {
	public ufirst_name:any;
	public ulast_name:any;
	public umobile:any;
	public username:any;
	public upassword:any;
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
	sendinvitebyuser()
	{
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		  });
		loading.present();
		var that = this;
		var headers:any = new Headers();
		headers.append('Content-Type', 'application/json');
		that.storage.get('user_id').then((val) => {
			let data=JSON.stringify({action: 'staff_registerby_user',user_id: val,first_name: that.ufirst_name,last_name: that.ulast_name,mobile: that.umobile,username: that.username,upassword: that.upassword});
			that.http.post('https://emailcipher.com/Emailcypher/ionicrequest.php',data,headers)
			.map(res => res.json()) 
			.subscribe(res => {
				if(res.status == 'true')
				{
					loading.dismiss();
					that.ufirst_name = "";
					that.ulast_name = "";
					that.umobile = "";
					that.username = "";
					that.upassword = "";
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