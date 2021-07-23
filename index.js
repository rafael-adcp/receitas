const handlebars = require('handlebars');
const recursiveReadSync = require('recursive-readdir-sync');
const YAML = require('yaml')

//class pro header
//clear pro ul
const fs = require('fs');
const _ = require('lodash');

const templateSource = fs.readFileSync('./modelo.handlebars').toString();
const template = handlebars.compile(templateSource);

//var receitas = require('./receitas/picles.json');
const receitasPath = recursiveReadSync('./receitas');

let receitas = [];

let i = 0;
for (const path of receitasPath) {
        i++;

        let cssClass = '';
        if ((i % 2) == 0) {
            cssClass = 'two';
        } else {
            cssClass = 'three';
        }
        console.log(`parsing: ${path}`);

        const receitaJson = YAML.parse(
            fs.readFileSync(`./${path}`).toString()    
        );
        receitaJson.cssClass = cssClass;

        const idAlreadyExist = _.find(receitas, (o) => {
            return o.id == receitaJson.id;
        });

        if (idAlreadyExist) {
            throw new Error(`ID "${receitaJson.id}" is already in use choose another one`)
        }

        if (receitaJson.fotos && receitaJson.fotos.length > 0) {
            let i = 0;
            for (var foto in receitaJson.fotos) {
                if (i == 3) {// porque so queremos que o 1 varie entre 0,1,2
                    i = 0;
                }

                if (i == 0) {
                    receitaJson.fotos[foto].openRow = true;
                }

                else if (i == 2) {
                    receitaJson.fotos[foto].closeRow = true;
                }

                if (foto == receitaJson.fotos.length - 1) {
                    //quando eh o ultimo elemento nos temos q fechar o div pra tratar quando nao tem multiplos de 3
                    receitaJson.fotos[foto].closeRow = true;
                }

                i++;

            }
        }

        receitas.push(receitaJson);



}

//sorting things so they appear ordered ASC
receitas = _.sortBy(receitas, (o) => { return o.titulo });

var result = template(
    {
        receitas: receitas
    }
);

fs.writeFileSync('index.html', result, 'utf-8');