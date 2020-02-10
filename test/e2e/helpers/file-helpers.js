function readFileSync(filePath){
    var fs = protractor.libs.fs;    
    try {
        if (fs.lstatSync(filePath).isFile()) {
            return fs.readFileSync(filePath, 'utf8');
        }
        else{
            console.error('readFileSync: filePath = ' + filePath)
            return null;
        }
    } catch (e) {
        console.error('readFileSync: e = ' + e)
        return null;
    }
}
            
exports.prependFileSync = function(filePath, buffer){
	var fs = protractor.libs.fs;
	var data = fs.readFileSync(filePath); //read existing contents into data
	var fd = fs.openSync(filePath, 'w+');
	fs.writeSync(fd, buffer, 0, buffer.length); //write new data
	fs.writeSync(fd, data, 0, data.length); //append old data
	fs.close(fd);                
};

function writeFileSync(filePath, buffer) {
	var fs = protractor.libs.fs;
    var fd = fs.openSync(filePath, 'w+');
	fs.writeSync(fd, buffer, 0, buffer.length); //write new data
	fs.close(fd, function(error) {
        if (error) {
            console.error('Error writing and closing the file:  ' + error.message);
        } else {
            // console.log('Write to file 'totalStatus.json' successful. File was closed!');
        }
    });
}

exports.readFileSync = readFileSync;
exports.writeFileSync = writeFileSync;
