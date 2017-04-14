import { WsdlParser } from './wsdlParser'
import * as path from 'path'
import * as ejs from 'ejs';
import * as fs from 'fs';


let wsdlFilePath = path.join(__dirname, '../amadeus.wsdl');
let templateFilePath = path.join(__dirname, '../templates/typescript.ejs');
let outputFilePath = path.join(__dirname, '../test/amadeus.ts');

var parser = new WsdlParser(wsdlFilePath);

console.log(`Initializing WSDL parser from: ${wsdlFilePath}`);

parser.init().then(() => {
    let sd = parser.service();
    console.log(`WSDL parsed. Rendering service: ${sd.name}`);
    ejs.renderFile(templateFilePath, { service: sd }, (err: Error, result: string) => {
        if (err) {
            throw err;
        }

        fs.writeFile(outputFilePath, result, (err: Error) => {
            if(err) {
                throw err;
            }

            console.log(`Service rendered to: ${outputFilePath}`);
        })
    });

}).catch((err) => {
    console.error(err);
});


