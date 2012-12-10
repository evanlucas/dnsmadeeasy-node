var DNSMadeEasy = require('./dnsmadeeasy').DNSMadeEasy;

var args = process.argv.splice(2);


if (args.length < 2) {
	console.log('Please enter your API Key and Secret as the first and seconds args respectively');
	process.exit(1);
}

var apikey = args[0];
var secret = args[1];

var dnsme = new DNSMadeEasy(apikey, secret);

// Unfortunately, the sandbox environment appears to be not working.
// So it is a little hard to 'test' without that
// I will update this as soon as I hear back from DNSMadeEasy's tech support
// in regards to the sandbox environment