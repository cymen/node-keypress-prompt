var Q = require('q'),
    keypress = require('keypress'),
    util = require('util');

keypress(process.stdin);

module.exports = {
    prompt: function(message, choices) {
        process.stdout.write(message + ' [' + choices.join(', ') + ']: ');

        return Q.promise(function(resolve) {
            var x = process.stdin.on('keypress', function(key) {
                var keyAsInteger = parseInt(key, 10),
                    valid,
                    value;

                if (typeof key === 'string') {
                    key = key.toLowerCase();
                }

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
                    if (process.stdin.setRawMode) {
                        process.stdin.setRawMode(false);
                    }
                    process.stdin.removeListener('keypress', arguments.callee);
                    resolve(value);
                } else {
                    process.stdout.write(key + ' is not a valid choice, please try again\n');
                    process.stdout.write(message + ' [' + choices.join(', ') + ']: ');
                }
            });

            if (process.stdin.setRawMode) {
                process.stdin.setRawMode(true);
            }
        });
    },

    fakeKeypress: function(key) {
        process.stdin.emit('keypress', key);
    }
};
