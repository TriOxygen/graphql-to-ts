import ENUM from './enum';
import OBJECT from './object';
import UNION from './union';
import INPUT_OBJECT from './inputObject';
import { Processors } from './types';

const processors: Processors = {
  ENUM,
  OBJECT,
  UNION,
  INTERFACE: OBJECT,
  INPUT_OBJECT,
};

export default processors;
