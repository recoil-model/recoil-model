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

import recoil, { DefaultValue, GetRecoilValue, RecoilState, RecoilValue, RecoilValueReadOnly, ResetRecoilState, SerializableParam, SetRecoilState } from 'recoil';
import { Field, FieldFamily } from './field';
import { NodeKey } from './nodeKey';

import { DefaultFamilyProps, DefaultProps } from './defaultProps';

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
} & Partial<DefaultFamilyProps<T, P>>
type ModelProps<T> = { fields: Fields<T>; key: NodeKey } & Partial<DefaultProps<T>>;
type FieldsArray = ({
  item: Field<any> | FieldFamily<any, any>,
  nodeField: string[]
})[]

export class ModelFamily<T, P extends SerializableParam> {
  fields: FieldsFamily<T, P>;
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

const getValue = <T>(
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


