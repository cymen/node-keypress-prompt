'use strict';

var fakeKeypress = require('../src/fake-keypress');

describe('fake keypress', function() {
    beforeEach(function() {
        spyOn(process.stdin, 'emit');
    });

    it('emits a keypress event', function() {
        fakeKeypress('x');

        expect(process.stdin.emit.mostRecentCall.args[0]).toBe('keypress');
        expect(process.stdin.emit.mostRecentCall.args[1]).toBe('x');
    });

    it('emits a keypress event with key metadata for key combinations like ctrl-c', function() {
        fakeKeypress('c', {
            name: 'c',
            ctrl: true
        });

        expect(process.stdin.emit).toHaveBeenCalledWith('keypress', 'c', {
            name: 'c',
            ctrl: true
        });
    });
});
