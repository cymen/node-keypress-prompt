'use strict';
require('promise-matchers');

var Q = require('q'),
    proxyquire = require('proxyquire'),
    fakeKeypress = require('../src/fake-keypress');

describe('keypress-prompt', function() {
    var prompter;

    beforeEach(function() {
        prompter = require('../src/keypress-prompt');
        spyOn(console, 'log').andCallThrough();
        spyOn(process.stdout, 'write').andCallThrough();
        spyOn(process.stdin, 'on').andCallThrough();
    });

    it('displays the prompt on stdout', function(done) {
        var promise = prompter.prompt('this is a test', ['y', 'n']);

        fakeKeypress('n');

        expect(promise).toHaveBeenResolvedWith(done, function(key) {
            expect(process.stdout.write).toHaveBeenCalledWith('this is a test [y, n]: ');
        });
    });

    it('returns a promise', function() {
        var promise = prompter.prompt('abc', [1, 2, 3]);

        fakeKeypress(2);

        expect(typeof promise.then === 'function').toBe(true);
    });

    it('resolves the promise with the key pressed', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('n');

        expect(promise).toHaveBeenResolvedWith(done, function(key) {
            expect(key).toBe('n');
        });
    });

    it('it ignores invalid key presses', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('x');
        setTimeout(function() {
            fakeKeypress('n');
        }, 100);

        expect(promise).toHaveBeenResolvedWith(done, function(key) {
            expect(key).toBe('n');
        });
    });

    it('lowercases the input to avoid issues with case', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('N');

        expect(promise).toHaveBeenResolvedWith(done, function(key) {
            expect(key).toBe('n');
        });
    });

    it('correctly handles upper case answers', function(done) {
        var promise = prompter.prompt('Yes or no', ['Y', 'N']);

        fakeKeypress('N');

        expect(promise).toHaveBeenResolvedWith(done, function(key) {
            expect(key).toBe('n');
        });
    });

    it('displays the key as pressed in terms of case', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('N');

        expect(promise).toHaveBeenResolvedWith(done, function() {
            expect(process.stdout.write).toHaveBeenCalledWith('N\n');
        });
    });

    it('works for a prompt within a prompt (promise-wise)', function(done) {
        var promise = prompter
            .prompt('Yes or no', ['y', 'n'])
            .then(function() {
                return prompter.prompt('Number of drinks', [1, 2, 3]);
            });

        fakeKeypress('n');
        setTimeout(function() {
            fakeKeypress(2);
        }, 50);

        expect(promise).toHaveBeenResolvedWith(done, function(key) {
            expect(key).toBe(2);
        });
    });

    it('logs an error and rejects if attempting to use answers longer than a single character', function(done) {
        var promise = prompter
            .prompt('Yes or no', ['yes', 'n']);

        expect(promise).toHaveBeenRejectedWith(done, function() {
            expect(console.log).toHaveBeenCalledWith('Answers can only be a single character in length!');
        });
    });

    it('logs an error rejects if attempting to use answer with number greater than 9', function(done) {
        var promise = prompter
            .prompt('Number of drinks', [1, 3, 25]);

        expect(promise).toHaveBeenRejectedWith(done, function() {
            expect(console.log).toHaveBeenCalledWith('Answers can only be a single character in length!');
        });
    });

    it('logs an error and rejects if attempting to use answer with number less than 0', function(done) {
        var promise = prompter
            .prompt('Number of drinks', [1, 3, 25, -5]);

        expect(promise).toHaveBeenRejectedWith(done, function() {
            expect(console.log).toHaveBeenCalledWith('Answers can only be a single character in length!');
        });
    });

    it('rejects the promise if Ctrl-C is pressed', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        fakeKeypress('c', {
            name: 'c',
            ctrl: true
        });

        expect(promise).toHaveBeenRejectedWith(done, function(keyMeta) {
            expect(console.log).toHaveBeenCalledWith();
            expect(keyMeta.name).toBe('c');
            expect(keyMeta.ctrl).toBe(true);
        });
    });

    it('provides access to fake keypress', function() {
        var fakeKeypressSpy = jasmine.createSpy('fakeKeypress'),
            anotherPrompter = proxyquire('../src/keypress-prompt', {
                './fake-keypress': fakeKeypressSpy
            });

        anotherPrompter.fakeKeypress('a', {
            x: 'y'
        });

        expect(fakeKeypressSpy).toHaveBeenCalledWith('a', {
            x: 'y'
        });
    });
});
