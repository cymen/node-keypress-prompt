var prompter = require('./src/single-prompt');

prompter
  .prompt('Number of diners', [1, 2, 3, 4, 5])
  .then(function(choice) {
      console.log('choice', choice);
  });
