var fs = require('fs'),
	LintStream = require('jslint').LintStream;

var filename = 'src/animate.js';
var lintStream = new LintStream({
	edition: 'latest',
	length: 100,
	single: true,
	browser: true,
	predef: ['window', 'console', 'requestAnimationFrame']
});

fs.readFile(filename, function(err, data) {

	console.log(`JSLint: Linting ${filename}`);

	lintStream.write({
		file: filename,
		body: data.toString()
	});

	lintStream.on('data', function (chunk) {
		
	    console.log(`JSLint: ${chunk.linted.errors.length} errors found:\n`);

	    chunk.linted.errors.forEach((lintError) => {
	    	var line = lintError.line,
	    		col = lintError.column,
	    		message = lintError.message;

	    	console.log(`line: ${line}, column: ${col}`);
	    	console.log(`${message}`);
	    	console.log('');
	    });
	});
});
