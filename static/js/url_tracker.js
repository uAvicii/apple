// url_tracker.js

Event.observe(document, 'dom:loaded', function() { 
	new VisitPage();
});

var VisitPage = Class.create({
	recentCheck: 
	[ 
		{ title:"MacCTO", url:"/cn/mac/" },
		{ title:"MacCTO", url:"/cn/macbook-air/" },
		{ title:"MacCTO", url:"/cn/macbook-pro/" },
		{ title:"MacCTO", url:"/cn/mac-mini/" },
		{ title:"MacCTO", url:"/cn/imac/" },
		{ title:"MacCTO", url:"/cn/mac-pro/" },             
		{ title:"iPodEngraving", url:"/cn/ipod/" },
		{ title:"iPodEngraving", url:"/cn/ipod-shuffle/" },
		{ title:"iPodEngraving", url:"/cn/ipod-nano/" },
		{ title:"iPodEngraving", url:"/cn/ipod-touch/" },
		{ title:"iPodEngraving", url:"/cn/ipodclassic/" },
        { title:"iPadstore", url:"/cn/ipad/" },
		{ title:"iPadstore", url:"/cn/ipad-air/" },
		{ title:"iPadstore", url:"/cn/ipad-mini/" },
		{ title:"iPadstore", url:"/cn/ipad-2/specs/" },
		{ title:"EducationStore", url:"/cn/education/" },
		{ title:"EducationStore", url:"/cn/apps/itunes-u/" }
	],

	index: 
	[
		{ title:"Environment", url:"/cn/environment/" },
		{ title:"Apple Rebates", url:"/cn/promo/" },
        { title:"Supplier Responsibility", url:"/cn/supplier-responsibility/" },
		{ title:"OS X - Apps", url:"/cn/osx/apps/" },
		{ title:"OS X - How to Upgrade", url:"/cn/osx/how-to-upgrade/" },
		{ title:"Mac Print products", url:"/cn/mac/print-products/"},
		{ title:"iOS Print products", url:"/cn/ios/print-products/"},
		{ title:"iPhone in Business", url:"/cn/iphone/business/" },
		{ title:"iPad in Business", url:"/cn/ipad/business/"},
		{ title:"Mac in Education", url:"/cn/education/mac/"},
		{ title:"iPad in Education", url:"/cn/education/ipad/"},
		{ title:"Support products", url:"/cn/support/products/"}
	],  	
	allJSON: 
	[
	 	{ title:"Environment", type:"match", id:"jpenvironment", 
	 		check:[ {url:"/cn/environment/"} ] },
	 	{ title:"Apple Rebates", type:"match", id:"jppromo", 
	 		check:[ {url:"/cn/promo/"} ] },
        { title:"Supplier Responsibility", type:"match", id:"jpsupplierresponsibility", 
	 		check:[ {url:"/cn/supplier-responsibility/"} ] }, 
 		{ title:"OS X - Apps", type:"equal", id:"jpappstore",
 			check:[ {url:"/cn/osx/apps/app-store.html"} ] },
        { title:"OS X - How to Upgrade", type:"match", id:"jphowtoupgrade",
        	check:[ {url:"/cn/osx/how-to-upgrade/"} ] },
        { title:"Mac Print products", type:"match", id:"macprint",
        	check:[ {url:"/cn/mac/print-products/"} ] },
        { title:"iOS Print products", type:"match", id:"iosprint",
        	check:[ {url:"/cn/ios/print-products/"} ] },
 		{ title:"iPhone in Business", type:"match", id:"jpbusiness",
 			check:[ {url:"/cn/iphone/business/"} ] },
 		{ title:"iPad in Business", type:"match", id:"jpipadbusiness",
 			check:[ {url:"/cn/ipad/business/"} ] },
 		{ title:"Mac in Education", type:"match", id:"jpeducationmac",
 			check:[ {url:"/cn/education/mac/"} ] },
 		{ title:"iPad in Education", type:"match", id:"jpeducationipad",
 			check:[ {url:"/cn/education/ipad/"} ] },
 	    { title:"Support products", type:"match", id:"jpproducts",
 	    	check:[ {url:"/cn/support/products/"} ] }
 	],

	RECENT_COOKIE_NAME:"rc_cn",
	INVISIT_COOKIE_NAME:"vs_cn",
	
	initialize: function(){
		var nu = location.href;		
		var jp_i = nu.indexOf('/cn/');
		var nu_s = nu.substring( jp_i );		
		this.recentPageSet( nu_s, this.recentCheck );
		this.indexSearch( nu_s, this.index );
	},
	recentPageSet: function( n_url, jsonl ){
		var m_id=null;						
		for( var i=0; i<jsonl.length; i++){
			var matched = n_url.match( jsonl[i].url );
			if ( matched != null ) { m_id = jsonl[i].title; }
		}	
		if( m_id != null ) this.setCookie('rc_cn', m_id, 1000 * 60 * 60 * 24 * 100);
	},
	indexSearch: function( n_url, json ) {
		var title=null;
		
		for( var i=0; i< json.length; i++){
			var matched = n_url.match( json[i].url );
			if ( matched != null ) { title = json[i].title; }
		}

		if ( title != null ){
			for( var i=0; i< this.allJSON.length; i++){ if ( this.allJSON[i].title == title ) m_j=this.allJSON[i]; }
			var c_id=null;
			if (m_j.type=="equal"){ 
				for( var i=0; i< m_j.check.length; i++){if ( m_j.check[i].url==n_url ) { c_id = m_j.id; }}				
			}
			else if (m_j.type=="match"){ 
				for( var i=0; i< m_j.check.length; i++){if ( m_j.check[i].url.match(n_url) != null ) { c_id = m_j.id; }}
			}			
			if( c_id != null ) this.visitedPageSet(c_id);
		}
	},
	visitedPageSet: function( id ){		
		var s_c=null;
		if ( this.getCookie('vs_cn') != null ){
			var g_c = this.getCookie('vs_cn');
			if ( g_c.match(id) != null ) { s_c = g_c; }
			else s_c = g_c + id + ' ';
		}
		else { s_c = id + ' '; }

		this.setCookie('vs_cn', s_c, 1000 * 60 * 60 * 24 * 100 );
	},
	setCookie: function (cookieName,cookieValue,ttlMillis) {
        var domain=location.hostname;
		var expire = new Date();
		expire.setTime(expire.getTime() + ttlMillis);
		var cookie = cookieName + "=" + escape(cookieValue) + "; domain="+domain+"; path=/; expires=" + expire.toGMTString();
		document.cookie = cookie;
	},
	getCookie: function (cookieName) {
		if (null == document.cookie || null == cookieName) return null;
		var cookies = document.cookie.split(';');
		var result = null;
		for (var i=0; i < cookies.length; i++) {
			var c = cookies[i];
			var keyValue = c.split('=');
			if (-1 < keyValue[0].indexOf(cookieName)) {
				result = unescape(keyValue[1]);
				break;
			}
		}
		//info("getCookie(" + cookieName + "): " + result);
		return result;
	}
});