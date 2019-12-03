import { ObjectDescription, ObjectField, FieldProcessor } from './types';

const typeLookup: { [key: string]: string } = {
  String: 'string',
  Boolean: 'boolean',
  Int: 'number',
  Float: 'number',
  DateTime: 'number',
};

const blacklistedFields: { [key: string]: boolean } = {
  linkedFrom: true,
};

const processField = (field: ObjectField, indent: string = '', fieldProcessors: FieldProcessor[]): string => {
  // if (!field.type.name) {
  //   console.log(field);
  // }
  // if (field.name === 'componentsCollection') {
  //   console.log(field);
  // }
  const foundProcessor = fieldProcessors.find((subProcessor) => {
    return subProcessor.match(field);
  });
  if (foundProcessor) {
    return foundProcessor.process(field, indent);
  }
  if (field.type.kind === 'LIST') {
    return `${indent}${field.name}?: ${typeLookup[field.type.ofType.name] || field.type.ofType.name}[];`;
  } else if (field.type.kind === 'NON_NULL') {
    if (field.type.ofType.kind === 'LIST') {
      return `${indent}${field.name}: ${typeLookup[field.type.ofType.ofType.name] || field.type.ofType.ofType.name}[];`;
    }
    return `${indent}${field.name}: ${typeLookup[field.type.ofType.name] || field.type.ofType.name};`;
  }
  return `${indent}${field.name}?: ${typeLookup[field.type.name] || field.type.name};`;
};

const objectProcessor = (
  objectData: ObjectDescription,
  indent: string = '',
  fieldProcessors: FieldProcessor[] = []
): string => {
  // console.log(objectData.fields);
  return [
    `${indent}export interface ${objectData.name} {`,
    ...objectData.fields
      .filter((field) => !blacklistedFields[field.name])
      .map((field) => processField(field, indent + '  ', fieldProcessors)),
    `${indent}}`,
  ].join('\n');
};

export default objectProcessor;
