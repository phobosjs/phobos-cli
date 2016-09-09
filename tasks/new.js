const fs = require('fs');
const STARTER_REPO = 'git@github.com:phobosjs/phobos-start.git';

function randomString(length = 25) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let text = '';

  for (let i of new Array(length).keys()) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = function(_) {

  return {

    name: 'new [name]',
    desc: 'initializes a new Phobos.js project with [name]',

    action: (name) => {
      _.info(`=> Initializing project with name '${name}'...`);

      const clone = `git clone ${STARTER_REPO} ${_.directory}/${name}`;
      const cloneCommand = _.shell(clone);

      cloneCommand.then(() => {
        const deleteGitFolder = `rm -rf ${_.directory}/${name}/.git`;
        const deleteGitFolderCommand = _.shell(deleteGitFolder);

        deleteGitFolderCommand.then(() => {
          const pjsonPath = `${_.directory}/${name}/package.json`;
          const pjson = require(pjsonPath);

          pjson.name = name;

          fs.writeFile(pjsonPath, JSON.stringify(pjson, null, 2), (err) => {
            if (err) {
              _.error(err);
              _.info(`=> Unable to complete command due to error`);
              return;
            }

            const dotenv = `${_.directory}/${name}/.env`;

            fs.readFile(`${dotenv}-sample`, 'utf8', (err, file) => {
              if (err) {
                _.error(err);
                _.info(`=> Unable to complete command due to error`);
                return;
              }

              let newEnv = file.replace('FILL_IN_BEARER_SIGNATURE', randomString(150));
              newEnv.replace('mongodb://localhost/start', `mongodb://localhost/${name}`);

              fs.writeFile(dotenv, newEnv, err => {
                if (err) {
                  _.error(err);
                  _.info(`=> Unable to complete command due to error`);
                  return;
                }

                _.info(`=> All done - navigate over to the ${name} folder to get started`);
              });
            });
          });
        });
      });
    }

  }

}
