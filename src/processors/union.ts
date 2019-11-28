import { UnionDescription } from './types';

const unionProcesor = (unionData: UnionDescription) => {
  return `type ${unionData.name} = ${unionData.possibleTypes.map((unionValue) => unionValue.name).join(' | ')};`;
};

export default unionProcesor;
