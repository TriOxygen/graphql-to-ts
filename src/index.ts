import fetch from 'node-fetch';
import IntrospectionQuery from './IntrospectionQuery';
import processors from './processors';
import { ProcessableType, ObjectField, TypeProcessor, FieldProcessor, ObjectDescription } from './processors/types';

export const defaultTypeProcessors: TypeProcessor[] = [
  {
    match: (type: ProcessableType) => type.kind === 'ENUM' && /Order$/.test(type.name),
    process: () => null,
  },
  {
    match: (type: ProcessableType) =>
      type.name === 'EntryCollection' || type.name === 'Query' || type.kind === 'INPUT_OBJECT',
    process: () => null,
  },
  {
    match: (type: ProcessableType) => /^__/.test(type.name) || /Collections$/.test(type.name),
    process: () => null,
  },
];

export const defaultFieldProcessors: FieldProcessor[] = [
  // {
  //   match: (field: ObjectField) => /sys/.test(field.name),
  //   process: (field: ObjectField, indent: string = '') => `${indent}sys: Sys;`,
  // },
];

const processType = (
  type: ProcessableType,
  indent: string = '',
  typeProcessors: TypeProcessor[],
  fieldProcessors: FieldProcessor[]
) => {
  const foundProcessor = typeProcessors.find((subProcessor) => {
    return subProcessor.match(type);
  });
  if (foundProcessor) {
    return foundProcessor.process(type, indent);
  }
  if (processors[type.kind]) {
    return processors[type.kind](type, indent, fieldProcessors);
  }
  return null;
};

const defaultOptions = {
  headers: {},
  typeProcessors: defaultTypeProcessors,
  fieldProcessors: defaultFieldProcessors,
  prefix: '',
  module: '',
};

const GraphQLToTs = async (
  url: string,
  options: {
    headers?: {};
    typeProcessors?: TypeProcessor[];
    fieldProcessors?: FieldProcessor[];
    prefix?: string;
    module?: string;
  } = defaultOptions
) => {
  const myOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...myOptions.headers,
      },
      body: JSON.stringify({
        query: IntrospectionQuery,
      }),
    });
    const {
      data: { __schema: schema },
    } = await res.json();
    const defs: string[] = [];
    if (myOptions.module) {
      defs.push(`declare module '${myOptions.module}' {`);
    }
    schema.types.forEach((type: ProcessableType) => {
      defs.push(processType(type, myOptions.module ? '  ' : '', myOptions.typeProcessors, myOptions.fieldProcessors));
    });
    if (myOptions.module) {
      defs.push(`}`);
    }
    return myOptions.prefix + defs.filter((def) => !!def).join('\n');
  } catch (e) {
    throw new Error(e);
  }
};

export default GraphQLToTs;
