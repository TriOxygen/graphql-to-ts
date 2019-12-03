import { UnionDescription } from './types';

const unionProcesor = (unionData: UnionDescription, indent: string = '') => {
  return `${indent}export type ${unionData.name} = ${unionData.possibleTypes
    .map((unionValue) => unionValue.name)
    .join(' | ')};`;
};

export default unionProcesor;
