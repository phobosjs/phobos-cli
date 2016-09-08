const fs = require('fs');

const STARTER_REPO = 'git@github.com:phobosjs/phobosjs-sampleapp.git';

module.exports = function(_) {

  return {

    name: 'new [name]',
    desc: 'initializes a new Phobos.js project with [name]',

    action: (name) => {
      _.info(`=> Initializing project with name '${name}'...`);

      const command = `git clone ${STARTER_REPO} ${_.directory}/${name}`;

      const execute = _.shell(command, (err, stdout, stderr) => {
        if (err) {
          _.error(err);
          _.info(`=> Unable to complete command due to error`);
        }
      });

      execute.on('exit', (code) => {
        if (code === 0) {
          const pjsonPath = `${_.directory}/${name}/package.json`;
          const pjson = require(pjsonPath);

          pjson.name = name;
          pjson.author = '';
          pjson.description = 'A brand spanking new Phobos.js project';

          fs.writeFile(pjsonPath, JSON.stringify(pjson, null, 2), (err) => {
            if (err) {
              _.error(err);
              _.info(`=> Unable to complete command due to error`);
              return;
            }

            _.info(`=> All done - navigate over to the ${name} folder to get started`);
          });
        } else {
          _.info(`=> Unable to complete command due to error`);
        }
      });
    }

  }

}
