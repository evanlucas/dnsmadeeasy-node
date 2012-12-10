var DNSMadeEasy = require('./dnsmadeeasy').DNSMadeEasy;

var args = process.argv.splice(2);


if (args.length < 2) {
	console.log('Please enter your API Key and Secret as the first and seconds args respectively');
	process.exit(1);
}

var apikey = args[0];
var secret = args[1];

var dnsme = new DNSMadeEasy(apikey, secret);

/*
dnsme.getDomains(function(err, data) {
	if (err) {
		console.log(err);
		process.exit(1);
	} else {
		console.log(data);
	}
});
*/

dnsme.getRecordsForDomain('curapps.com', function(err, data){
	console.log(err);
	console.log(data);
}, 'A');
/*
dnsme.getDomainName('curapps.com', function(err, data) {
	console.log(err);
	console.log(data);
});
*/
/*
dnsme.getDomainNames(function(err, data){
	if (err) console.log(err);
	if (data) console.log(data);
});


dnsme.getARecordsForID('851704', function(err, data) {
	console.log('Getting A Records');
	if (err) console.log(err);
	if (data) console.log(data);	
});

dnsme.getCNAMERecordsForID('851704', function(err, data) {
	console.log('Getting CNAME Records');
	if (err) console.log(err);
	if (data) console.log(data);	
});

dnsme.getMXRecordsForID('851704', function(err, data) {
	console.log('Getting MX Records');
	if (err) console.log(err);
	if (data) console.log(data);	
});

dnsme.getTXTRecordsForID('851704', function(err, data) {
	console.log('Getting TXT Records');
	if (err) console.log(err);
	if (data) console.log(data);	
});
*/