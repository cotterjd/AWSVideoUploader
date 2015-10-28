/**
 * Created by jordan.cotter on 10/27/2015.
 */

var Busboy = require('busboy');

/**
 * Parses the request headers and returns an object with files and form data
 * @param req
 * @param cb
 */
module.exports = function(req, cb) {
    var obj = {
        files: []
    };
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        file.fileRead = [];
        file.on('data', function(data) {
            this.fileRead.push(data);
        });
        file.on('end', function() {
            obj.files.push({
                fieldname: fieldname,
                filename: filename,
                encoding: encoding,
                mimetype: mimetype,
                data: Buffer.concat(this.fileRead)
            });
        });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        obj[fieldname] = val;
    });

    busboy.on('finish', function() {
        cb(null, obj);
    });

    req.pipe(busboy);
};