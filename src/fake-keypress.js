'use strict';

module.exports = function(key, keyMeta) {
    process.stdin.emit('keypress', key, keyMeta);
};
