// import { DbProvider } from './../../providers/db/db';
import { Component } from '@angular/core';
import { NavController, MenuController, Events, Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';
// import { ListPage } from '../list/list';
import { LoadingController } from 'ionic-angular';
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public username: any;
	public password: any;
	public response: any;
	public PlayerId: any;
	constructor(public navCtrl: NavController,
		public http: Http,
		public storage: Storage,
		public loadingCtrl: LoadingController,
		public menuCtrl: MenuController,
		private event: Events,
		public platform: Platform) {
		this.menuCtrl.enable(false);
	}

	Login() {
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();
		/* let headers = new Headers();  */
		var headers: any = new Headers();
		headers.append('Content-Type', 'application/json');
		let data = JSON.stringify({ action: 'login_action', username: this.username, password: this.password });
		this.http.post('https://emailcipher.com/Emailcypher/ionicrequest.php', data, headers)
			.map(res => res.json())
			.subscribe(res => {
				if (res.status == 'true') {
					console.log(JSON.stringify(res));
					loading.dismiss();
					this.storage.set('user_id', res.user_id)
						.then(() => {
							this.storage.set('username', res.username)
								.then(() => {
									this.event.publish('startApp', res.user_id);
									this.getOneSignalPlayerId();
								});
						});
				}
				else {
					loading.dismiss();
					this.response = res.error;
				}
			}, (err) => {
				console.log(JSON.stringify(err));
				loading.dismiss();
				this.response = 'Something is wrong';
			});
	}
	getOneSignalPlayerId() {        // get Onesignal playerid and add/update it to users node.
		window["plugins"].OneSignal.getPermissionSubscriptionState(function(status) {
			this.PlayerId = status.subscriptionStatus.userId;
		});
		var headers: any = new Headers();
		headers.append('Content-Type', 'application/json');
		this.http.get('https://chat.emailcipher.com:8081/api/device/info?userId=' + this.storage.get('user_id'), headers)
		.map(res => res.json())
		.subscribe(res => {
			console.log(res);

			if (!res.PlayerId) {
				let data = JSON.stringify(
					{
						"UserId": this.storage.get('user_id'),
						"PlayerId": this.PlayerId
					}
				);
				this.http.post('https://chat.emailcipher.com:8081/api/device/register', data, headers)
					.map(res => res.json())
					.subscribe(res => {
						if (res.Success == 'true') {
							console.log("PlayerID registered");
						}
						else {
							console.log("Error");
						}

					}, (err) => {
						console.log("Error");

					});
			}
		}, (err) => {
			console.log("Error");

		});
	}
}
