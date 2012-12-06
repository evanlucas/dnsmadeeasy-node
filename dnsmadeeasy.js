

/* TODO
 *
 * Add Copyright info
 *
 */

var http = require('http'),
	querystring = require('querystring'),
	crypto = require('crypto');


var DNSMadeEasy = function(apikey, secret) {
	this._apiKey = apikey;
	this._secret = secret;
	
}

DNSMadeEasy.prototype = {};

DNSMadeEasy.prototype._createHttpOptions = function(resource, method, action, date) {
	return {
		host: 'api.dnsmadeeasy.com',
		port: 80,
		method: method,
		path: '/V2.0/' + resource + '/' + action,
		headers: {
			'x-dnsme-apiKey': this._apiKey,
			'x-dnsme-requestDate': date,
			'x-dnsme-hmac': crypto.createHmac('sha1', this._secret).update(date).digest('hex')
		}
	};
}


DNSMadeEasy.prototype.managedDNS = function() {
	var callback = null;

	var args = Array.prototype.slice.call(arguments, 1);
	if (args[0] && typeof args[0] == 'function')
		callback = args.shift() || callback;
	
	delete args;
	var now = new Date().toGMTString();

	var httpOptions = this._createHttpOptions('dns/managed', 'GET', '', now);
	httpOptions.headers['Content-Type'] = 'application/json';
	
	var req = http.request(httpOptions, function(res) {
		if (callback) callback(res,statusCode != 201 ? new Error(res.statusCode) : undefined);
	});

	req.end();
};
