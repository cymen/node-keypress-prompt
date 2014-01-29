var prompter = require('./src/keypress-prompt');

prompter
  .prompt('Are you crazy', ['y', 'n'])
  .then(function(choice) {
      console.log('choice', choice);
      process.exit(0);
  });
