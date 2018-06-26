let fs = require('fs');
/**
 *
 * @param filepath
 * @param data
 * @returns {Promise}
 */
function writeFile(filepath, data) {
    return new Promise(resolve => {
        fs.readFile(filepath, data, (err) => {
            resolve();
        });
    });
}
