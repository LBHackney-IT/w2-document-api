const shell = require('shelljs');

shell.echo('> Checking status of container(s): uh_test_db');

const checkState = () =>
  shell.exec('$(which docker) inspect -f {{.State.Running}} uh_test_db', {
    silent: true
  }).stdout;

while (checkState()[0] != 't') {
  console.log('Container(s) not yet running. Checking again...');
  shell.exec('sleep 1');
}

shell.echo('> Checking health of service(s) in container(s): uh_test_db');

const checkHealth = () =>
  shell.exec("$(which docker) inspect -f='{{json .State.Health}}' uh_test_db", {
    silent: true
  }).stdout;

while (JSON.parse(checkHealth()).Status !== 'healthy') {
  console.log('Container(s) not yet healthy. Checking again...');
  shell.exec('sleep 1');
}

console.log('> Container(s) healthy.');

shell.exit(0);
