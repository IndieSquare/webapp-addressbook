import { Router } from '@angular/router';
import { IDB } from '../services/idb.service';
import IndieSquare from 'indiesquare/src';

export class IndieSquareActivity {
	public router: Router;
	public idb = new IDB();
	public IndiesquareSDK = new IndieSquare({
		'apikey': '' // https://developer.indiesquare.me/#api-key
	});
	
	constructor( router: Router ){
		this.router = router;
	}
}