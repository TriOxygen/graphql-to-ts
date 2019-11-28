import { ObjectDescription, ObjectField } from './types';

const typeLookup: { [key: string]: string } = {
  String: 'string',
  Boolean: 'boolean',
  Int: 'number',
  Float: 'number',
  DateTime: 'number',
};

interface FieldProcessors {
  match: (field: ObjectField) => boolean;
  process: (field: ObjectField, indent: string) => string;
}

const fieldProcessors: FieldProcessors[] = [
  {
    match: (field: ObjectField) => /sys/.test(field.name),
    process: (field: ObjectField, indent: string = '') => `${indent}sys: Sys;`,
  },
  {
    match: (field: ObjectField) => /Collection$/.test(field.name),
    process: (field: ObjectField, indent: string = '') => {
      return `${indent}sys: Collection<${field.type.name.replace('Collection', '')}>;`;
    },
  },
];

const blacklistedFields: { [key: string]: boolean } = {
  linkedFrom: true,
};

const processField = (field: ObjectField, indent: string = ''): string => {
  // if (!field.type.name) {
  //   console.log(field);
  // }
  const foundProcessor = fieldProcessors.find((subProcessor) => {
    return subProcessor.match(field);
  });
  if (foundProcessor) {
    return foundProcessor.process(field, indent);
  }
  if (field.type.kind === 'LIST') {
    return `${indent}${field.name}: ${typeLookup[field.type.ofType.name] || field.type.ofType.name}[];`;
  }
  return `${indent}${field.name}: ${typeLookup[field.type.name] || field.type.name};`;
};

const objectProcessor = (objectData: ObjectDescription, indent: string = ''): string => {
  // console.log(objectData.fields);
  return [
    `interface ${objectData.name} {`,
    ...objectData.fields
      .filter((field) => !blacklistedFields[field.name])
      .map((field) => processField(field, indent + '  ')),
    '}',
  ].join('\n');
};

export default objectProcessor;
