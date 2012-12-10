/*
 *		Copyright (c) 2012, Evan Lucas
 *		All rights reserved.
 *
 *		Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *		Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 *		Redistributions in binary form must reproduce the above copyright notice, this 
 *		list of conditions and the following disclaimer in the documentation and/or other 
 *		materials provided with the distribution.
 *
 *		THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
 *		INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var http = require('http'),
	querystring = require('querystring'),
	crypto = require('crypto');


var DNSMadeEasy = function(apikey, secret, isProd) {
	this._apiKey = apikey;
	this._secret = secret;
	if (typeof(isProd) == 'undefined' || isProd == true) {
		this._host = 'api.dnsmadeeasy.com';
	} else {
		this._host = 'api.sandbox.dnsmadeeasy.com';
	}
}



DNSMadeEasy.prototype = {};

DNSMadeEasy.prototype._createHttpOptions = function(resource, method, action) {
	var date = new Date().toGMTString();
	return {
		host: this._host,
		port: 80,
		method: method,
		path: '/V1.2/' + resource + '/' + action,
		headers: {
			'x-dnsme-apiKey': this._apiKey,
			'x-dnsme-requestDate': date,
			'x-dnsme-hmac': crypto.createHmac('sha1', this._secret).update(date).digest('hex'),
			'Content-Type': 'application/json'
		}
	};
}

DNSMadeEasy.prototype._getRequest = function(path, cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	var httpOptions = this._createHttpOptions(path, 'GET', '');
	var req = http.request(httpOptions, function(res) {
		var data = '';
		res.on('data', function(c) {
			data += c;
		});
		res.on('close', function(err) {
			cb(err.code);
		});
		res.on('end', function() {
			cb(undefined, data);
		});
	});
	req.end();
}

DNSMadeEasy.prototype._putRequest = function(path, putData, cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	var httpOptions = this._createHttpOptions(path, 'PUT', '');
	var body = JSON.stringify(putData);
	httpOptions.headers['Content-Length'] = Buffer.byteLength(body);
	var req = http.request(httpOptions, function(res) {
		var data = '';
		res.on('data', function(c) {
			data += c;
		});
		res.on('close', function(err) {
			cb(err.code);
		});
		res.on('end', function() {
			cb(undefined, data);
		});
	});
	req.end(body);
}

DNSMadeEasy.prototype._postRequest = function(path, postData, cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	var httpOptions = this._createHttpOptions(path, 'POST', '');
	var body = JSON.stringify(postData);
	httpOptions.headers['Content-Length'] = Buffer.byteLength(body);
	var req = http.request(httpOptions, function(res) {
		var data = '';
		res.on('data', function(c) {
			data += c;
		});
		res.on('close', function(err) {
			cb(err.code);
		});
		res.on('end', function() {
			cb(undefined, data);
		});
	});
	req.end(body);
}

DNSMadeEasy.prototype._deleteRequest = function(path, cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	var httpOptions = this._createHttpOptions(path, 'DELETE', '');
	var req = http.request(httpOptions, function(res) {
		var data = '';
		res.on('data', function(c) {
			data += c;
		});
		res.on('close', function(err) {
			cb(err.code);
		});
		res.on('end', function() {
			cb(undefined, data);
		});
	});
	req.end();
}


// Get all domains
DNSMadeEasy.prototype.getDomains = function(cb) {
	var self = this;
	this._getRequest('domains', function(err, data){
		if (err) {
			cb(err);
		} else {
			cb(null, JSON.parse(data).list);
		}
	});
}

DNSMadeEasy.prototype.getDomainName = function(domainName, cb) {
	var self = this;
	self._getRequest('domains/'+domainName, function(err, data){
		if (err) {
			cb(err);
		} else {
			cb(null, JSON.parse(data));
		}
	});
}

DNSMadeEasy.prototype.getNameServersForDomain = function(domainName, cb) {
	var self = this;
	self.getDomainName(domainName, function(err, data) {
		if (err) {
			cb(err);
		} else {
			cb(null, data.nameServer);
		}
	});
}

DNSMadeEasy.prototype.getRecordsForDomain = function(domainName, cb, filter) {
	var self = this;
	self._getRequest('domains/'+domainName+'/records', function(err, data) {
		if (err) {
			cb(err);
		} else {
			var d = JSON.parse(data);
			if (typeof(filter) != 'undefined') {
				var records = [];
				d.forEach(function(record) {
					if (record.type == filter) {
						//console.log(record);
						records.push(record);
					}
				});
				cb(null, records);
			} else {
				cb(null, d);
			}
		}
	});
}
exports.DNSMadeEasy = DNSMadeEasy;

module.exports = exports;