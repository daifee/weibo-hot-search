const { execSync } = require('child_process');

function run(commands = []) {
  commands.forEach((command) => {
    execSync(command);
  });
}

beforeAll(() => {
  run([
    'cp -R ./source ./temp',
    'cp -R ./archives ./temp',
  ]);
});
