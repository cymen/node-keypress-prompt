'use strict';

var Q = require('q'),
    keypress = require('keypress');

module.exports = {
    prompt: function(message, choices) {
        process.stdout.write(message + ' [' + choices.join(', ') + ']: ');

        return Q.promise(function(resolve) {
            keypress(process.stdin);

            process.stdin.on('keypress', function(key) {
                var valid,
                    keyAsInteger = parseInt(key, 10),
                    value;

                if (choices.indexOf(key) !== -1) {
                    valid = true;
                    value = key;
                } else if (choices.indexOf(keyAsInteger) !== -1) {
                    valid = true;
                    value = keyAsInteger;
                } else {
                    valid = false;
                }

                if (valid) {
                    process.stdout.write(key + '\n');
                    process.stdin.pause();
                    process.stdin.setRawMode(false);
                    resolve(value);
                } else {
                    process.stdout.write(key + ' is not a valid choice, please try again\n');
                    process.stdout.write(message + ' [' + choices.join(', ') + ']: ');
                }
            });

            process.stdin.setRawMode(true);
        });
    }
};
