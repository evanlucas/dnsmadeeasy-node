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

DNSMadeEasy.prototype.getAllDomains = function(cb) {
	return this._getRequest('dns/managed', cb);
}

DNSMadeEasy.prototype.getDomainByID = function(id, cb) {
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	return this._getRequest('dns/managed/'+id, cb);	
}
DNSMadeEasy.prototype.updateDomainWithID = function(id, putData, cb) {
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	return this._putRequest('dns/managed/'+id, putData, cb);
}
DNSMadeEasy.prototype.updateDomains = function(putData, cb) {
	return this._putRequest('dns/managed', putData, cb);
}
DNSMadeEasy.prototype.createDomains = function(putData, cb) {
	return this._postRequest('dns/managed', putData, cb);
}
DNSMadeEasy.prototype.deleteDomain = function(id, cb) {
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	return this._deleteRequest('dns/managed/'+id, cb);
}
DNSMadeEasy.prototype.getRecordsForID = function(id, cb) {
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	return this._getRequest('dns/managed/'+id+'/records', cb);
}
DNSMadeEasy.prototype.updateRecordsForID = function(domainid, recordid, putData, cb) {
	if (typeof domainid != 'number') throw new Error('Domain ID must be a number');
	if (typeof recordid != 'number') throw new Error('Record ID must be a number');
	return this._putRequest('dns/managed/'+domainid+'/records/'+recordid, putData, cb);
}
DNSMadeEasy.prototype.createRecordForDomainID = function(domainid, postData, cb) {
	if (typeof domainid != 'number') throw new Error('Domain ID must be a number');
	return this._postRequest('dns/managed/'+domainid+'/records', postData, cb);
}
DNSMadeEasy.prototype.deleteRecordIDForDomainID = function(domainid, recordid, cb) {
	if (typeof domainid != 'number') throw new Error('Domain ID must be a number');
	if (typeof recordid != 'number') throw new Error('Record ID must be a number');
	return this._deleteRequest('dns/managed/'+domainid+'/records/'+recordid, cb);
}
DNSMadeEasy.prototype.getSOA = function(cb) {
	return this._getRequest('dns/soa', cb);
}
DNSMadeEasy.prototype.updateSOA = function(putData, cb) {
	return this._putRequest('dns/managed', putData, cb);
}
DNSMadeEasy.prototype.createDomainsWithSOA = function(postData, cb) {
	return this._postRequest('dns/managed', postData, cb);
}
DNSMadeEasy.prototype.getVanityDNS = function(cb) {
	return this._getRequest('dns/vanity', cb);
}
DNSMadeEasy.prototype.getTemplates = function(cb) {
	return this._getRequest('dns/template', cb);
}
DNSMadeEasy.prototype.getRecordsForTemplateID = function(id, recordType, cb) {
	if (typeof id != 'number') throw new Error('Template ID must be a number');
	return this._getRequest('dns/template/'+id+'/records?type='+recordType, cb);
}
DNSMadeEasy.prototype.updateRecordsForTemplateID = function(id, putData, cb) {
	if (typeof id != 'number') throw new Error('Template ID must be a number');
	return this._putRequest('dns/template/'+id+'/records', putData, cb);
}
DNSMadeEasy.prototype.deleteTemplateRecordWithID = function(templateid, recordid, cb) {
	if (typeof recordid != 'number') throw new Error('Template ID must be a number');
	if (typeof templateid != 'number') throw new Error('Template ID must be a number');
	return this._deleteRequest('dns/template/'+templateid+'/records?ids='+recordid, cb);
}
DNSMadeEasy.prototype.getACL = function(cb) {
	return this._getRequest('dns/transferAcl', cb);
}
DNSMadeEasy.prototype.getFolders = function(cb) {
	return this._getRequest('security/folder', cb);
}
DNSMadeEasy.prototype.getQueryUsage = function(cb) {
	return this._getRequest('usageApi/queriesApi', cb);
}
DNSMadeEasy.prototype.getUsageForYearMonth = function(year, month, cb) {
	return this._getRequest('usageApi/queriesApi/'+year+'/'+month, cb);
}
DNSMadeEasy.prototype.getUsageForYearMonthDomainID = function(year, month, domainid, cb) {
	if (typeof domainid != 'number') throw new Error('Domain ID must be a number');
	return this._getRequest('usageApi/queriesApi/'+year+'/'+month+'/managed/'+domainid, cb);	
}
DNSMadeEasy.prototype.configureFailoverForID = function(id, putData, cb) {
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	return this._putRequest('monitor/'+id, putData, cb);
}
DNSMadeEasy.prototype.createSecondaryDomains = function(postData, cb) {
	return this._postRequest('dns/secondary', postData, cb);
}
DNSMadeEasy.prototype.deleteSecondaryDomainByID = function(id, cb) {
	if (typeof id != 'number') throw new Error('Domain ID must be a number');
	return this._deleteRequest('dns/secondary/'+id, cb);
}
DNSMadeEasy.prototype.getIPSets = function(cb) {
	return this._getRequest('dns/ipSet', cb);
}

exports.DNSMadeEasy = DNSMadeEasy;

module.exports = exports;