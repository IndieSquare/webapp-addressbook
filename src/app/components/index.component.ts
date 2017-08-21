import { Component, ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { IndieSquareActivity } from '../extends/indiesquare.extend';

@Component({
  selector: 'application',
  templateUrl: '../templates/index.template.html',
  //styleUrls: ['../sass/index.scss']
})
export class IndexComponent extends IndieSquareActivity {
    private _el: HTMLElement;
    private data;
	
	constructor( router: Router, el: ElementRef ){
		super(router);
		this._el = el.nativeElement;
	}
	
	sync(){
		let self = this;
		this._el.querySelector('#getbutton').innerHTML = '<i class="fa fa-spinner fa-spin fa-1x fa-fw margin-bottom"></i>';
		
		var indiesquare = this.IndiesquareSDK;
		var connect = function (data, urlScheme, error) {
			if (urlScheme) {
			  //document.location = urlScheme;
		    } else {
			  console.log(urlScheme);
		    }
		};
		indiesquare.getAddress('Address Book', connect, function(data, error) {
			if( error ){
				console.log(error);
			}
			self.idb.update('owner', { 'id': 1, 'name': '', 'address': data.address }, function(result, error){
				console.log('update:'+result+'; error='+error);
				self.router.navigate(['list']);
			});
		});
	}
}