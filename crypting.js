var bcrypt = require('bcrypt');

function hashPassword(plainTextPassword) {

    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return console.log(err);
            }

            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    console.log(err)
                }

                resolve(hash);
            });
        });
    })
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase, callback) {
    bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, doesMatch);
    });
}


exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;