var prompter = require('./src/single-prompt');

prompter
  .prompt('Are you crazy', ['y', 'n'])
  .then(function(choice) {
      console.log('choice', choice);
      process.exit(0);
  });
