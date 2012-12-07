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


var DNSMadeEasy = function(apikey, secret) {
	this._apiKey = apikey;
	this._secret = secret;
}

DNSMadeEasy.prototype = {};

DNSMadeEasy.prototype._createHttpOptions = function(resource, method, action) {
	var date = new Date().toGMTString();
	return {
		host: 'api.dnsmadeeasy.com',
		port: 80,
		method: method,
		path: '/V2.0/' + resource + '/' + action,
		headers: {
			'x-dnsme-apiKey': this._apiKey,
			'x-dnsme-requestDate': date,
			'x-dnsme-hmac': crypto.createHmac('sha1', this._secret).update(date).digest('hex'),
			'Content-Type': 'application/json'
		}
	};
}

// Get all domains

DNSMadeEasy.prototype.getAllDomains = function(cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	var httpOptions = this._createHttpOptions('dns/managed', 'GET', '');
	
	var req = http.request(httpOptions, function(res) {
		if (res.statusCode != 200)
			return cb(res.statusCode);

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

DNSMadeEasy.prototype.getDomainByID = function(id, cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	
	var httpOptions = this._createHttpOptions('dns/managed', 'GET', id);
	
	var req = http.request(httpOptions, function(res) {
		if (res.statusCode != 200)
			return cb(res.statusCode);

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

DNSMadeEasy.prototype.updateDomainWithID = function(id, putData, cb) {
	if (typeof cb != 'function') throw new Error('Callback must be a function');
	
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	
	if (toString.call(putData) !== "[object Array]") throw new Error("Data to update must be in an array");
	
	var httpOptions = this._createHttpOptions('dns/managed', 'GET', id);
	
	
	var req = http.request(httpOptions, function(res) {
		if (res.statusCode != 200)
			return cb(res.statusCode);

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

