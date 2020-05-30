const handlebars = require('handlebars');
const recursiveReadSync = require('recursive-readdir-sync');
//validar campos obrigatorios,

//class pro header
//clear pro ul
const fs = require('fs');
const _ = require('lodash');

const templateSource = fs.readFileSync('./modelo.handlebars').toString();
const template = handlebars.compile(templateSource);

//var receitas = require('./receitas/picles.json');
const receitasPath = recursiveReadSync('./receitas');

const receitas = [];

let i = 0;
for (const path of receitasPath) {
    i++;

    let cssClass = '';
    if ((i % 2) == 0) {
        cssClass = 'two';
    } else {
        cssClass = 'three';
    }
    console.log(`\n\n parsing: ${path}`);

    const receitaJson = require(`./${path}`);
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


            console.log(`foto: ${foto} tem o contador ${i}`)
            console.log('\n\n\n')

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

console.log(
    JSON.stringify(receitas, null, 2)
)

var result = template(
    {
        receitas: receitas
    }
);

fs.writeFileSync('teste.html', result, 'utf-8');