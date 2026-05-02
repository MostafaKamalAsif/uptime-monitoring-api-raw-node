// ================= DEPENDENCIES =================
const fs = require('fs');
const path = require('path');

// ================= MODULE SCAFFOLDING =================
const lib = {};

// base diractory of the data folder
lib.basedir = path.join(__dirname, '/../data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open data to file
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err1, fileDiscriptor) => {
        if (!err1 && fileDiscriptor) {
            // convert data into string
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDiscriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDiscriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback(`Could not create new file , it may alrady exits ${err1}`);
        }
    });
};

// Read data to file
lib.read = (dir, file, callback) => {
    // read data from file
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

// Update data to file
lib.update = (dir, file, data, callback) => {
    // Open file
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDiscriptor) => {
        if (!err && fileDiscriptor) {
            const stringData = JSON.stringify(data);
            // Truncate file
            fs.ftruncate(fileDiscriptor, (err3) => {
                if (!err3) {
                    fs.writeFile(fileDiscriptor, stringData, (err1) => {
                        if (!err1) {
                            fs.close(fileDiscriptor, (err2) => {
                                if (!err2) {
                                    callback(false);
                                } else {
                                    callback('Error in closing');
                                }
                            });
                        } else {
                            callback('Error in file update');
                        }
                    });
                } else {
                    callback('Error truncate file');
                }
            });
        } else {
            callback('File not found or could not open');
        }
    });
};
// Delete file
lib.delete = (dir, file, callback) => {
    // unlink data from file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error in Deleting file');
        }
    });
};

module.exports = lib;
