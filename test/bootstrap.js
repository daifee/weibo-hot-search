const { execSync } = require('child_process');

function run(commands = []) {
  commands.forEach((command) => {
    const output = execSync(command);

    // eslint-disable-next-line no-console
    console.log(output);
  });
}

run([
  'cp -R ./source ./temp',
  'cp -R ./archives ./temp',
]);
