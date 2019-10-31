import * as fs from 'fs';

/* tslint:disable:no-console */

function run() {
    try {
        let r: string = '' +
            '// This file was automatically generated from protobuf files (.proto)\r\n' +
            '// Do not edit - all changes will be overwritten!\r\n' +
            '/* tslint:disable:max-classes-per-file */\r\n\r\n';
        const path = '../messaging/';
        const filesInProtoDir: string[] = fs.readdirSync(path);
        console.log('found proto files:');
        console.log(filesInProtoDir);
        filesInProtoDir.forEach(file => {
            if (file.endsWith('.proto') && !file.endsWith('.old.proto') && !file.endsWith('.service.proto') ) {
                console.log('Will parse ' + file);
                const s = fs.readFileSync(path + file).toString();
                // const data = protoParse(s);
                const parse = require('proto-parse');
                const data = parse(s);
                console.log('Parsed proto successfully');
                console.log(data);
                const content: any[] = data.content;
                content.forEach(value => {
                    if (value.type === 'message') {
                        const enums: any[] = [];
                        const messageName: string = value.name;
                        const messageFields: any[] = value.content;
                        r += 'export class ' + messageName + ' {\r\n';
                        messageFields.forEach(messageField => {
                            if (messageField.type === 'field') {
                                let typescriptType = convertProtoTypeToTypescript(messageField.typename);
                                if (messageField.repeated === true) {
                                    typescriptType += '[]';
                                }
                                r += '  ' + messageField.name + ': ' + typescriptType + ';\r\n';
                            }

                            if (messageField.type === 'enum') {
                                enums.push(messageField);
                            }
                        });
                        r += '}\r\n';

                        enums.forEach(enumMessage => {
                            const enumName: string = enumMessage.name;
                            const enumFields: any[] = enumMessage.content;
                            r += 'export enum ' + enumName + ' {\r\n';
                            enumFields.forEach(enumField => {
                                if (enumField.type === 'enumField') {
                                    r += '  ' + enumField.name + ' = ' + enumField.val + ',\r\n';
                                }
                            });
                            r += '}\r\n';
                        });
                    }

                    if (value.type === 'enum') {
                        const enumName: string = value.name;
                        const enumFields: any[] = value.content;
                        r += 'export enum ' + enumName + ' {\r\n';
                        enumFields.forEach(enumField => {
                            if (enumField.type === 'enumField') {
                                r += '  ' + enumField.name + ' = ' + enumField.val + ',\r\n';
                            }
                        });
                        r += '}\r\n';
                    }
                });
            }
        });
        console.log('Generated Proto interface:');
        console.log(r);
        const outputFile = './src/proto.interfaces.ts';
        fs.truncateSync(outputFile);
        fs.writeFileSync(outputFile, r);

    } catch (e) {
        console.error('failed to read proto');
        console.error(e);
    }
}

function convertProtoTypeToTypescript(protoType: string) {
    if (protoType.includes('int') || protoType.includes('long') ) {
        return 'number';
    }
    if (protoType === 'bool') {
        return 'boolean';
    }
    if (protoType === 'google.protobuf.Any') {
        return 'any';
    }
    if (protoType === 'bytes') {
        return 'ArrayBuffer';
    }
    return protoType;
}

run();
