/**
 * NDTjs - a JavaScript library for Flash-based NDT Tests
 *
 */

"use strict"; // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

if (typeof NDTjs === 'undefined') {

	var NDTjs = function(config, function_onload, function_onerror) {
		this.build_config(config);
		this.build_client();
		this.check_loaded();
	}

}
NDTjs.prototype = {
	version: "151",
	config: null,
	client: null,
	ready: false,
	semaphore: false,
	current_state: undefined,
	current_mlab: undefined,
	onload: function(){  },
	build_config: function(config) {
        config = config || {};
        var defaults = {
            swf_url: 'ndt.swf',
            namespace: 'ndtjs',
            path: null,
            debug: false,
            timeout: 10, // number of seconds to wait before concluding there was an error
            onready: null,
            onerror: null
        };
        var key;
        for (key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                if (!config.hasOwnProperty(key)) {
                    config[key] = defaults[key];
                }
            }
        }        
        this.config = config;	
        return true;
	},
	build_client: function() {
        function id(name) {
            return "NDTjs_" + name ;
        }
        function div(visible) {
            var d = document.createElement('div');
            document.body.appendChild(d);
            d.id = id();
            if (!visible) {
                // setting display:none causes the .swf to not render at all
                d.style.position = "relative";
                d.style.position = "absolute";
                d.style.top = "-2000px";
                d.style.left = "-2000px";
                d.style.height = '1px';
                d.style.width = '1px';
            }
            return d;
        }
        // the callback functions that javascript provides to flash must be globally accessible

        var swfContainer = div(false);
        var swfName = id(this.config.namespace);

        var flashvars = "namespace=" + this.config.namespace + "&amp;" +
            (this.config.path ? "LSOPath=" + this.config.path + '&amp;' : '') +
            "LSOName=" + this.config.namespace;


//         swfContainer.innerHTML = '<object height="100" width="500" codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' +
//             swfName + '-object" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
//             '	<param value="' + this.config.swf_url + '" name="movie">' +
//             '	<param value="' + flashvars + '" name="FlashVars">' +
//             '	<param value="always" name="allowScriptAccess">' +
//             '	<embed width="1px" height="1px" pluginspage="https://www.macromedia.com/go/getflashplayer" ' +
//             'flashvars="' + flashvars + '" type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" loop="false" play="true" ' +
//             'id="' + swfName + '" bgcolor="#ffffff" src="' + this.config.swf_url + '">' +
//             '</object>';
		swfContainer.innerHTML ='<object width="483" height="387" id="' + swfName + '" data="../ndt.swf" type="application/x-shockwave-flash">';
		this.mlab_find_server()
        this.client = document[swfName] || window[swfName];	
        return true;
	},
	status: function(){
		if (this.ready === true && typeof this.client.get_status === 'function') {
			return this.client.get_status();
		}
		return false;
	},
	start_test: function(callbacks) {
		callbacks = callbacks || {'onchange': undefined, 'oncompletion': undefined, 'onerror': undefined};
		
		
		if (this.ready === true && typeof this.client.run_test === 'function' && this.semaphore == false) {
			this.semaphore = true;
			this.client.run_test();
			
			this.interval_id = setInterval(
								(function(self) {         //Self-executing func which takes 'this' as self
									 return function() {   //Return a function in the context of 'self'
									 	
									 	var reported_state = self.status(),
									 		error_message = self.client.get_errmsg();
									 	
										if (callbacks['onchange'] !== undefined) {
												if (self.current_state != reported_state) {
													callbacks['onchange'](reported_state);
													self.current_state = reported_state;
												}
										}
										if (reported_state == 'done') {			
											self.semaphore = false;
											clearInterval(self.interval_id);
																							
											if (callbacks['oncompletion'] !== undefined) {
												callbacks['oncompletion']();
											}											
										}

										if ( !(error_message == 'Test in progress.' || error_message == 'All tests completed OK.' || error_message == 'Test not run.') ) {
											if (callbacks['onerror'] !== undefined) {
												callbacks['onerror'](error_message);
											}
										}
									 }
									})(this),
									100
								);
			return true;
		}
		return false;
	},
	/**
	 * callback_constructor: Is the NDT flash client properly loaded?
	 * 
	 * @return {boolean} client state
	 */
	check_loaded: function() {
		 this.interval_id = setInterval(
			 (function(self) {         //Self-executing func which takes 'this' as self
				 return function() {   //Return a function in the context of 'self'
					if (typeof self.client != 'undefined' && typeof self.client.get_status === 'function') {			
						clearInterval(self.interval_id);
						self.ready = true;
						if (typeof self.onload === 'function') {
							self.config.onready();
						}
					}
				 }
			 })(this),
			 100
		 );
	},
	get_server: function() {
		if (this.ready === true) {
			return this.client.get_host();
		}
		return false;
	},
	/**
	 * get_results: 
	 * 
	 * @param {string} type of result to retrieve from the NDT client
	 * @return {string} result of the NDT test, otherwise returns false.
	 */
	get_result: function(result_name) {
		if (this.ready == true && result_name) {
		
			if (result_name == 'download') {
				return this.get_result('ServerToClientSpeed');
			} 
			if (result_name == 'upload') {
				return this.get_result('ClientToServerSpeed');
			} 
			if (result_name == 'rtt') {
				return this.get_result('MinRTT')
			} 
			else {
				return this.client.getNDTvar(result_name);
			}
		}		
		else {
			return false;
		}		
	},
	mlab_ns_url: 'https://mlab-ns.appspot.com/ndt',
	mlab_find_server: function() {
		var request;

		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 and older
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}

		request.open('GET', this.mlab_ns_url, false);
		request.send(null);
				
		if (request.status === 200) {
			try {
				this.current_server = JSON.parse(request.responseText);
				return this.current_server;
			} catch (e) {
				//console.error("Could not parse response: " + e.toString());
			}
		}
		else {
			//console.error("While retrieving server list encounter HTTP Error Code " + request.status);
		}
		
		return false;				
	}
}
