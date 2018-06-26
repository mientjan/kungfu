var fs = require('fs');
/**
 *
 * @param filepath
 * @param data
 * @returns {Promise}
 */
function writeFile(filepath, data) {
    return new Promise(function (resolve) {
        fs.readFile(filepath, data, function (err) {
            resolve();
        });
    });
}
