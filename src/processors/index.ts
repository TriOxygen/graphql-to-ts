import ENUM from './enum';
import OBJECT from './object';
import UNION from './union';
import { Processors } from './types';

const processors: Processors = {
  ENUM,
  OBJECT,
  UNION,
  INTERFACE: OBJECT,
};

export default processors;
