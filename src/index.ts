import fetch from 'node-fetch';
import IntrospectionQuery from './IntrospectionQuery';
import processors from './processors';
import { ProcessableType } from './processors/types';

interface TypeProcessors {
  match: (field: ProcessableType) => boolean;
  process: (field: ProcessableType, indent: string) => string;
}

const typeProcessors: TypeProcessors[] = [
  {
    match: (type: ProcessableType) => type.kind === 'ENUM' && /Order$/.test(type.name),
    process: () => null,
  },
  {
    match: (type: ProcessableType) => type.name === 'Query' || type.kind === 'INPUT_OBJECT',
    process: () => null,
  },
  {
    match: (type: ProcessableType) =>
      /^__/.test(type.name) || /Collection$/.test(type.name) || /Collections$/.test(type.name),
    process: () => null,
  },
];

const processType = (type: ProcessableType, indent: string = '') => {
  const foundProcessor = typeProcessors.find((subProcessor) => {
    return subProcessor.match(type);
  });
  if (foundProcessor) {
    return foundProcessor.process(type, indent);
  }
  if (processors[type.kind]) {
    return processors[type.kind](type);
  }
  return null;
};

const go = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
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
      defs.push(processType(type));
    });
    console.log(defs.filter((def) => !!def).join('\n'));
  } catch (e) {
    console.error('Something went wrong with fetching the schema.please check your settings');
    console.error(e);
  }
};

//go('http://localhost:8001/graphql');

export default go;
