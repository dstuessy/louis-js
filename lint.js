var fs = require('fs'),
	LintStream = require('jslint').LintStream;

var filename = 'src/louis.js';
var lintStream = new LintStream({
	edition: 'latest',
	length: 120,
	single: true,
	browser: true,
	predef: ['window', 'console', 'requestAnimationFrame']
});

fs.readFile(filename, function(err, data) {
	var filteredFile = data.toString().replace(/\w*\/\*[^i]*ignoreme[^\*]*\*\/[^\/]*\/\*[^i]*ignoreme[^\*]*\*\/\w*/g, '');

	console.log(`JSLint: Linting ${filename}`);

	lintStream.write({
		file: filename,
		body: filteredFile
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
