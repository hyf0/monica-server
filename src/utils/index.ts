import { DynamicImportedModule } from '../types/utils';

function createIsDevelopment(mode: String = 'development') {
  return function isDevelopment() {
    return mode === 'development' ? true : false;
  };
}

export function load(modulePath: string): Promise<DynamicImportedModule> {
  return import(modulePath);
}

export function isPlainObject(target: any): target is object {
  if (target !== null && typeof target === 'object') return true;
  return false;
}

interface Response {
  message?: string;
  status?: number;
  [props: string]: any;
}

export function formatResponse(
  msg: string,
  status: number,
  props?: object
): Response;
export function formatResponse(resp: Response): Response;
export function formatResponse(
  arg1: string | Response,
  arg2?: number,
  arg3?: object
): Response {
  let result: Response;

  if (typeof arg1 === 'string' && typeof arg2 === 'number') {
    if (arg3 == null) arg3 = {};
    result = {
      message: arg1,
      status: arg2,
      ...arg3
    };
  } else {
    result = arg1 as Response;
  }
  return result;
}

type RawTypes = 'number' | 'string';

interface PropTypeDescription {
  type: RawTypes;
  isRequerd?: boolean;
}

interface PropTypeDescriptions {
  [propName: string]: RawTypes | PropTypeDescription;
}

export function validateProps(
  target: { [propName: string]: any },
  propTypeDescriptions: PropTypeDescriptions
) {
  const formatedDescs: PropTypeDescriptions = {};
  Object.keys(propTypeDescriptions).forEach(propName => {
    const typeDescription = propTypeDescriptions[propName];
    if (typeof typeDescription === 'string') {
      formatedDescs[propName] = {
        type: typeDescription,
        isRequerd: true
      };
    } else formatedDescs[propName] = typeDescription;
  });

  Object.keys(formatedDescs).forEach(propName => {
    const typeDesc = formatedDescs[propName] as PropTypeDescription;
    const targetValue = target[propName];
    const isTargetValueEmpty = targetValue == null;
    const targetType = typeof targetValue;
    if (typeDesc.isRequerd && isTargetValueEmpty)
      throw new Error(`${propName} 要求为非空 但得到 ${targetValue}`);
    if (targetType !== typeDesc.type)
      throw new Error(
        `${propName} 要求类型 ${typeDesc.type} 但得到 ${targetType}`
      );
  });
}

export const uniqueId = (function saveNextId() {
  let curID = -1;
  const date = Date.now().toString();
  return function generatorOfUniqueId(prefix = '') {
    curID += 1;
    if (prefix.length === 0) return `${date}-${curID}`;
    return `${prefix}-${date}-${curID}`;
  };
}());

export const isDevelopment = createIsDevelopment(process.env.NODE_ENV);
