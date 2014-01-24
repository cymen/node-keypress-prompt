'use strict';

var Q = require('q');

describe('single-prompt', function() {
    var prompter;

    beforeEach(function() {
        prompter = require('../src/single-prompt');
        spyOn(process.stdout, 'write').andCallThrough();
        spyOn(process.stdin, 'on').andCallThrough();
    });

    it('displays the prompt on stdout', function(done) {
        process.stdin.on.andCallFake(function(event, callback) {
            callback('n');
        });

        var promise = prompter.prompt('this is a test', ['y', 'n']);

        promise.then(
            function(key) {
                expect(process.stdout.write).toHaveBeenCalledWith('this is a test [y, n]: ');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

    it('returns a promise', function() {
        process.stdin.on.andCallFake(function(event, callback) {
            callback(2);
        });

        var promise = prompter.prompt('abc', [1, 2, 3]);

        expect(typeof promise.then === 'function').toBe(true);
    });

    it('resolves the promise with the key pressed', function(done) {
        process.stdin.on.andCallFake(function(event, callback) {
            callback('n');
        });

        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        promise.then(
            function(key) {
                expect(key).toBe('n');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

    it('continues to prompt until one of the expected values is provided', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        process.stdin.emit('keypress', 'x');
        setTimeout(function() {
            process.stdin.emit('keypress', 'n');
        }, 100);

        promise.then(
            function(key) {
                expect(key).toBe('n');
                expect(process.stdout.write).toHaveBeenCalledWith('x is not a valid choice, please try again\n');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });

    it('lowercases the input to avoid issues with case', function(done) {
        var promise = prompter.prompt('Yes or no', ['y', 'n']);

        process.stdin.emit('keypress', 'N');

        promise.then(
            function(key) {
                expect(key).toBe('n');
                done();
            },
            function() {
                expect('promise').toBe('not rejected');
                done();
            }
        );
    });
});
