import { EnumDescription } from './types';

const enumProcesor = (enumData: EnumDescription, indent: string = '') => {
  return [
    `${indent}export enum ${enumData.name} {`,
    ...enumData.enumValues.map((enumValue) => `${indent}  ${enumValue.name} = '${enumValue.name}',`),
    `${indent}}`,
  ].join('\n');
};

export default enumProcesor;
