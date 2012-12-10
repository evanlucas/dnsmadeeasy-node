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
			if (data) {
				cb(undefined, JSON.parse(data));
			} else {
				cb(undefined, {status: 'success'});
			}
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
			if (data) {
				cb(undefined, JSON.parse(data));
			} else {
				cb(undefined, {status: 'success'});
			}
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
			if (data) {
				cb(undefined, JSON.parse(data));
			} else {
				cb(undefined, {status: 'success'});
			}

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
			if (data) {
				cb(undefined, JSON.parse(data));
			} else {
				cb(undefined, {status: 'success'});
			}

		});
	});
	req.end();
}


// Get all domains
DNSMadeEasy.prototype.getDomains = function(cb) {
	var self = this;
	self._getRequest('domains', cb);
}

DNSMadeEasy.prototype.getDomainName = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self._getRequest('domains/'+domainName, cb);
}

DNSMadeEasy.prototype.createDomain = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self._putRequest('domains/'+domainName, '', cb);
}

DNSMadeEasy.prototype.deleteDomain = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self._deleteRequest('domains/'+domainName, cb);
}

DNSMadeEasy.prototype.getNameServersForDomain = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self.getDomainName(domainName, cb);
}

DNSMadeEasy.prototype.getRecordsForDomain = function(domainName, cb, filter, gtd) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	var url = 'domains/'+domainName+'/records';
	if (typeof(filter) != 'undefined') {
		url += '?type='+filter;
	}
	
	if (typeof(gtd) != 'undefined') {
		if (typeof(filter) == 'undefined') {
			url += '?gtdLocation='+gtd;
		} else {
			url += '&gtdLocation='+gtd;
		}

	}
	self._getRequest(url, cb);
}

DNSMadeEasy.prototype.getRecordForDomain = function(domainName, recordId, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	if (typeof(recordId) == 'undefined') cb(new Error('Record ID must be specified'));
	self._getRequest('domains/'+domainName+'/records/'+recordId, cb);
}

DNSMadeEasy.prototype.addRecordForDomain = function(domainName, recordData, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	if (typeof(recordId) == 'undefined') cb(new Error('Record ID must be specified'));
	self._postRequest('domains/'+domainName+'/records', recordData, cb);
}

DNSMadeEasy.prototype.deleteRecordForDomain = function(domainName, recordId, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	if (typeof(recordId) == 'undefined') cb(new Error('Record ID must be specified'));
	self._deleteRequest('domains/'+domainName+'/records/'+recordId, cb);
}

DNSMadeEasy.prototype.updateRecordForDomain = function(domainName, recordId, recordData, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	if (typeof(recordId) == 'undefined') cb(new Error('Record ID must be specified'));
	self._putRequest('domains/'+domainName+'/records/'+recordId, recordData, cb);
}

DNSMadeEasy.prototype.getSecondaryDomains = function(cb) {
	var self = this;
	self._getRequest('secondary', cb);
}

DNSMadeEasy.prototype.getSecondaryDomain = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self._getRequest('secondary/'+domainName, cb);
}

DNSMadeEasy.prototype.deleteSecondaryDomain = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self._deleteRequest('secondary/'+domainName, cb);
}

DNSMadeEasy.prototype.createSecondaryDomain = function(domainName, cb) {
	var self = this;
	if (typeof(domainName) == 'undefined') cb(new Error('Domain name must be specified'));
	self._putRequest('secondary/'+domainName, '', cb);
}




exports.DNSMadeEasy = DNSMadeEasy;

module.exports = exports;