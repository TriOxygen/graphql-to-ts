import { EnumDescription } from './types';

const enumProcesor = (enumData: EnumDescription) => {
  return [
    `enum ${enumData.name} {`,
    ...enumData.enumValues.map((enumValue) => `  ${enumValue.name} = '${enumValue.name},`),
    '}',
  ].join('\n');
};

export default enumProcesor;
