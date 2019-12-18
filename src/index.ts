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
    match: (type: ProcessableType) => type.name === 'EntryCollection' || type.name === 'Query',
    process: () => null,
  },
  {
    match: (type: ProcessableType) => /^__/.test(type.name) || /Collections$/.test(type.name),
    process: () => null,
  },
];

export const defaultFieldProcessors: FieldProcessor[] = [
  {
    match: (field: ObjectField) => /sys/.test(field.name),
    process: (field: ObjectField, indent: string = '') => `${indent}sys?: Sys;`,
  },
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
  postfix: '',
  module: '',
  indent: '  ',
};

const GraphQLToTs = async (
  url: string,
  options: {
    headers?: {};
    typeProcessors?: TypeProcessor[];
    fieldProcessors?: FieldProcessor[];
    prefix?: string;
    postfix?: string;
    indent?: string;
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
    schema.types.forEach((type: ProcessableType) => {
      defs.push(processType(type, myOptions.indent, myOptions.typeProcessors, myOptions.fieldProcessors));
    });
    return myOptions.prefix + defs.filter((def) => !!def).join('\n') + myOptions.postfix;
  } catch (e) {
    throw new Error(e);
  }
};

export default GraphQLToTs;
