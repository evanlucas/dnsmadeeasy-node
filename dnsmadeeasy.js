

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
	console.log('Setting up DNSMadeEasy');	
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


DNSMadeEasy.prototype.managedDNS = function(callback) {
	if (typeof callback != 'function') throw new Error('Callback must be a function');

	var now = new Date().toGMTString();

	var httpOptions = this._createHttpOptions('dns/managed', 'GET', '', now);
	httpOptions.headers['Content-Type'] = 'application/json';
	
	var req = http.request(httpOptions, function(res) {
		if (res.statusCode != 200)
			return callback(res.statusCode);

		var data = '';

		res.on('data', function(c) {
			data += c;
		});

		res.on('close', function(err) {
			callback(err.code);
		});

		res.on('end', function() {
			callback(undefined, data);
		});
	});

	req.end();
};
