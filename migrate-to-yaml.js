const handlebars = require('handlebars');
const recursiveReadSync = require('recursive-readdir-sync');
const YAML = require('yaml')

const fs = require('fs');
const _ = require('lodash');

const receitasPath = recursiveReadSync('./receitas');

for (const path of receitasPath) {
    if (path.includes(".json")) {
        const receitaJson = require(`./${path}`);

        ///.replace("json",".yaml")
        fs.writeFileSync(`./${path}`,

            YAML.stringify(
                receitaJson
            ).toString(),
            'utf-8'
        );
    }
}