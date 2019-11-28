export interface TypeDescription {
  kind: string;
  name: string;
}

interface EnumValue {
  name: string;
}

interface Field {}

export interface EnumDescription extends TypeDescription {
  enumValues: EnumValue[];
}

export interface UnionDescription extends TypeDescription {
  possibleTypes: TypeDescription[];
}

export interface ObjectField {
  name: string;
  type: {
    kind: string;
    name: string;
    ofType: {
      kind: string;
      name: string;
    };
  };
}

export interface ObjectDescription extends TypeDescription {
  fields: ObjectField[];
}

export type ProcessableType = EnumDescription | ObjectDescription | UnionDescription;

type Processor = (descr: ProcessableType) => string;

export interface Processors {
  [processor: string]: Processor;
}
