const fs = require('fs');

const STARTER_REPO = 'git@github.com:phobosjs/phobosjs-sampleapp.git';

module.exports = function(_) {

  return {

    name: 'new [name]',
    desc: 'initializes a new Phobos.js project with [name]',

    action: (name) => {
      _.info(`=> Initializing project with name '${name}'...`);

      const clone = `git clone ${STARTER_REPO} ${_.directory}/${name}`;

      const command = _.shell(clone, (err, stdout, stderr) => {
        if (err) {
          _.error(err);
          _.info(`=> Unable to complete command due to error`);
        }
      });

      command.on('exit', code => {
        if (code !== 0) return _.info(`=> Unable to complete command due to error`);

        const deleteGitFolder = `rm -rf ${_.directory}/${name}/.git`;

        const command = _.shell(deleteGitFolder, (err, stdout, stderr) => {
          if (err) {
            _.error(err);
            _.info(`=> Unable to complete command due to error`);
          }
        });

        command.on('exit', code => {
          if (code !== 0) return _.info(`=> Unable to complete command due to error`);

          const pjsonPath = `${_.directory}/${name}/package.json`;
          const pjson = require(pjsonPath);

          pjson.name = name;

          fs.writeFile(pjsonPath, JSON.stringify(pjson, null, 2), (err) => {
            if (err) {
              _.error(err);
              _.info(`=> Unable to complete command due to error`);
              return;
            }

            _.info(`=> All done - navigate over to the ${name} folder to get started`);
          });
        });
      });
    }

  }

}
