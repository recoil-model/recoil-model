/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import recoil, { DefaultValue, GetRecoilValue, RecoilState, RecoilValueReadOnly, ResetRecoilState, SerializableParam, SetRecoilState } from 'recoil';
import { Field, FieldFamily } from './field';
import { NodeKey } from './nodeKey';
import { ValidateInfo, ValidateInfoFields, ValidateInfoModel } from './validateInfo';


export type FieldsFamily<T, P extends SerializableParam> = {
  [k in keyof T]:
  T[k] extends any[] ? FieldFamily<T[k], P> :
  T[k] extends { [key: string]: any } ? FieldsFamily<T[k], P> : FieldFamily<T[k], P>

}
export type Fields<T> = {
  [k in keyof T]:
  T[k] extends any[] ? Field<T[k]> :
  T[k] extends { [key: string]: any } ? Fields<T[k]> : Field<T[k]>
}
type ModelFamilyProps<T, P extends SerializableParam> = {
  fields: FieldsFamily<T, P>;
  key: NodeKey
}
type ModelProps<T> = { fields: Fields<T>; key: NodeKey };
type FieldsArray = ({
  item: Field<any> | FieldFamily<any, any>,
  nodeField: string[]
})[]

export class ModelFamily<T, P extends SerializableParam> {
  fields: FieldsFamily<T, P>;
  validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
  value: (param: P) => RecoilState<T>;

  constructor(props: ModelFamilyProps<T, P>) {
    const { key } = props;
    const fieldsArray: FieldsArray = [];
    this.fields = props.fields;
    buildFields(props)(
      [key, '$fields'].join('-'),
      [],
      props.fields,
      fieldsArray,
    );
    this.validate = recoil.selectorFamily({
      key: [key, '$validate'].join('-'),
      get: param => ({ get }) => {
        return validateValueFamily({
          fields: props.fields, get, param
        });
      },
    });
    this.value = recoil.selectorFamily({
      key: [key, '$value'].join('-'),
      get: param => ({ get }) => {
        return getValueFamily({
          fields: props.fields,
          param,
          get
        });
      },
      set: param => ({ set, reset }, value) => {
        return setValueFamily({
          param,
          fields: props.fields,
          set,
          reset,
          value
        });
      },
    });
  }
};
export class Model<T>  {
  fields: Fields<T>;
  validate: RecoilValueReadOnly<ValidateInfo>;
  value: RecoilState<T>;
  constructor(props: ModelProps<T>) {
    const { key } = props;
    const fieldsArray: FieldsArray = [];
    this.fields = props.fields;
    buildFields(props)(
      [key, '$fields'].join('-'),
      [],
      props.fields,
      fieldsArray,
    );
    this.validate = recoil.selector({
      key: [key, '$validate'].join('-'),
      get: ({ get }) => {
        const ddd = validateValue({
          fields: props.fields, get
        });;
        return ddd
      },
    });
    this.value = recoil.selector({
      key: [key, '$value'].join('-'),
      get: ({ get }) => {
        return getValue({
          fields: props.fields,
          get
        });
      },
      set: ({ set, reset }, value) => {
        return setValue({
          fields: props.fields,
          set,
          reset,
          value
        });
      },
    });
  }
};





export const modelFamily = <T, P extends SerializableParam>(
  props: ModelFamilyProps<T, P>): ModelFamily<T, P> => {
  return new ModelFamily<T, P>(props);
};
export const model = <T>(
  props: ModelProps<T>): Model<T> => {
  return new Model<T>(props);
};


export const buildFields = <M>(props: M) => (
  key: string,
  nodeField: string[],
  fields: Fields<any> | FieldsFamily<any, any> | Field<any> | FieldFamily<any, any>,
  itens: FieldsArray,
): void => {
  if (fields instanceof FieldFamily || fields instanceof Field) {
    fields.build([key, ...nodeField].join('-'), nodeField);
    itens.push({
      item: fields,
      nodeField,
    });
  } else {
    for (const _key in fields) {
      buildFields(props)(
        key,
        [...nodeField, _key],
        fields[_key],
        itens,
      );
    }
  }
};




const validateValueArrayFamily = <T, P extends SerializableParam>(props: {
  fields: FieldFamily<T, P> | FieldsFamily<T, P>, get: GetRecoilValue, param: P
}): ValidateInfo[] => {
  if (props.fields instanceof FieldFamily) {
    return [props.get(props.fields.validate(props.param))]
  } else {
    let array: ValidateInfo[] = [];
    for (const _key in props.fields) {
      array = [...array, ...validateValueArrayFamily({
        fields: props.fields[_key],
        get: props.get,
        param: props.param
      })];
    }
    return array;
  }
};

const validateValueTreeFamily = <T, P extends SerializableParam>(props: {
  fields: FieldFamily<T, P> | FieldsFamily<T, P>, get: GetRecoilValue,
  param: P
}): ValidateInfoFields | ValidateInfo => {
  if (props.fields instanceof FieldFamily) {
    return props.get(props.fields.validate(props.param))
  } else {
    let obj: ValidateInfoFields = {};
    for (const _key in props.fields) {
      obj[_key] = validateValueTreeFamily({
        fields: props.fields[_key],
        get: props.get,
        param: props.param
      });
    }
    return obj;
  }
};
const validateValueFamily = <T, P extends SerializableParam>(props: {
  fields: FieldFamily<T, P> | FieldsFamily<T, P>, get: GetRecoilValue,
  param: P
}) => {
  const validateFields = validateValueTreeFamily(props);
  const lValidateValueArray = validateValueArrayFamily(props);
  const messages = lValidateValueArray.flatMap((a) => a.messages).flatMap((e) => e);
  return new ValidateInfoModel(
    messages.length > 0 ? messages.join("\n") : null,
    messages,
    messages.length > 0,
    validateFields as any,
  )
}










const getValueFamily = <T, P extends SerializableParam>(
  props: {
    fields: FieldFamily<T, P> | FieldsFamily<T, P>, get: GetRecoilValue,
    param: P
  }): T => {

  const { fields, get, param } = props;
  if (fields instanceof FieldFamily) {
    return get(fields.value(param));
  } else {
    const obj: any = {};
    for (const _key in fields) {
      obj[_key] = getValueFamily({
        fields: fields[_key],
        get,
        param
      });
    }
    return obj;
  }
};

const getValue = <T, P extends SerializableParam>(
  props: {
    fields: Field<T> | Fields<T>, get: GetRecoilValue
  }): T => {

  const { fields, get } = props;
  if (fields instanceof Field) {
    return get(fields.value);
  } else {
    const obj: any = {};
    for (const _key in fields) {
      obj[_key] = getValue({
        fields: fields[_key],
        get
      });
    }
    return obj;
  }
};



const setValueFamily = <T, P extends SerializableParam>(
  props: {
    fields: FieldFamily<T, P> | FieldsFamily<T, P>, set: SetRecoilState,
    param: P,
    value: any | DefaultValue, reset: ResetRecoilState,

  }): void => {
  const { fields, set, param, value, reset } = props;
  if (fields instanceof FieldFamily) {
    set(fields.value(param), value);
  } else {
    for (const _key in fields) {
      if (!(value instanceof DefaultValue) && value && value[_key]) {
        setValueFamily({
          fields: fields[_key],
          set,
          reset,
          param, value: value[_key]
        });
      } else {
        resetValueFamily({
          fields: fields[_key],
          reset,
          param
        });
      }
    }
  }
};


const resetValueFamily = <T, P extends SerializableParam>(
  props: {
    fields: FieldFamily<T, P> | FieldsFamily<T, P>
    param: P,
    reset: ResetRecoilState,

  }): void => {
  const { fields, param, reset } = props;
  if (fields instanceof FieldFamily) {
    reset(fields.value(param));
  } else {
    for (const _key in fields) {
      resetValueFamily({
        fields: fields[_key],
        reset,
        param,
      });
    }
  }
};

const setValue = <T>(
  props: {
    fields: Field<T> | Fields<T>, set: SetRecoilState,
    value: any | DefaultValue, reset: ResetRecoilState,

  }): void => {
  const { fields, set, value, reset } = props;
  if (fields instanceof Field) {
    set(fields.value, value);
  } else {
    for (const _key in fields) {
      if (!(value instanceof DefaultValue) && value && value[_key]) {
        setValue({
          fields: fields[_key],
          set,
          reset,
          value: value[_key]
        });
      } else {
        resetValue({
          fields: fields[_key],
          reset
        });
      }
    }
  }
};


const resetValue = <T>(
  props: {
    fields: Field<T> | Fields<T>
    reset: ResetRecoilState,

  }): void => {
  const { fields, reset } = props;
  if (fields instanceof Field) {
    reset(fields.value);
  } else {
    for (const _key in fields) {
      resetValue({
        fields: fields[_key],
        reset,
      });
    }
  }
};




const validateValueArray = <T>(props: {
  fields: Field<T> | Fields<T>, get: GetRecoilValue
}): ValidateInfo[] => {
  if (props.fields instanceof Field) {
    return [props.get(props.fields.validate)]
  } else {
    let array: ValidateInfo[] = [];
    for (const _key in props.fields) {
      array = [...array, ...validateValueArray({
        fields: props.fields[_key],
        get: props.get
      })];
    }
    return array;
  }
};

const validateValueTree = <T>(props: {
  fields: Field<T> | Fields<T>, get: GetRecoilValue
}): ValidateInfoFields | ValidateInfo => {
  if (props.fields instanceof Field) {
    return props.get(props.fields.validate)
  } else {
    let obj: ValidateInfoFields = {};
    for (const _key in props.fields) {
      obj[_key] = validateValueTree({
        fields: props.fields[_key],
        get: props.get
      });
    }
    return obj;
  }
};
const validateValue = <T>(props: {
  fields: Field<T> | Fields<T>, get: GetRecoilValue,
}) => {
  const validateFields = validateValueTree(props);
  const lValidateValueArray = validateValueArray(props);
  const messages = lValidateValueArray.flatMap((a) => a.messages).flatMap((e) => e);
  return new ValidateInfoModel(
    messages.length > 0 ? messages.join("\n") : null,
    messages,
    messages.length > 0,
    validateFields as any,
  )
}



