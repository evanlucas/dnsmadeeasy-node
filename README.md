## A node module for DNSMadeEasy

This module allows an easy way to call the DNSMadeEasy API V1.2

Currently, it only supports V1.2, but V2.0 is in the works

## Basic setup

	var dnsme = require('dnsmadeeasy').DNSMadeEasy;
	
	dnsme = new DNSMadeEasy('apikey', 'secret');
	
## Examples

Get all domains

	dnsme.getDomains(function(error, data) {
		if (error) console.log(error);
		console.log(data);
	});
	
Get single domain

	dnsme.getDomainName('example.com', function(err, data){
		if (err) console.log(err);
		console.log(data);
	});
	
Create a domain

	dnsme.createDomain('example.com', function(err, data){
		console.log(data);
	});

Get name servers for a single domain

	dnsme.getNameServersForDomain('example.com', function(err, data){
		console.log(data);
	});
	
Get records for a single domain

	dnsme.getRecordsForDomain('example.com', function(err, data){
		console.log(data);
	});
	
Get A records for a domain

	dnsme.getRecordsForDomain('example.com', function(err, data){
		console.log(data);
	}, 'A');
	
Get record by id with domain name

	dnsme.getRecordForDomain('example.com', '1234', function(err, data){
		console.log(data);
	});
	
Create new record for domain name
	
	dnsme.addRecordForDomain('example.com', recordData, function(err, data){
		console.log(data);
	});

Delete record by id with domain name

	dnsme.deleteRecordForDomain('example.com', '1234', function(err, data){
		console.log(data);
	});
	
Update record by id for domain

	dnsme.updateRecordForDomain('example.com', 'record_id', 'array of record data', function(err, data){
		console.log(data);
	});
	
Get secondary domains

	dnsme.getSecondaryDomains(function(err, data){
		console.log(data);
	});
	
Get a single secondary domain

	dnsme.getSecondaryDomains('example.com', function(err, data){
		console.log(data);
	});
	
Delete a secondary domain

	dnsme.deleteSecondaryDomain('example.com', function(err, data){
		console.log(data);
	});
	
Create a secondary domain

	dnsme.createSecondaryDomain('example.com', function(err, data){
		console.log(data);
	});