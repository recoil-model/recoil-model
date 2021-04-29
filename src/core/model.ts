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

import recoil, { DefaultValue, GetRecoilValue, RecoilState, ResetRecoilState, SerializableParam, SetRecoilState } from 'recoil';

import { AbstractField, AbstractFieldFamily, } from './field';
import { NodeKey } from './nodeKey';

type Fields = {
  [key: string]: Fields
} | AbstractField<any>

type ExtFields<IFields> = {
  [K in keyof IFields]: IFields[K] extends AbstractField<infer T> ? T : ExtFields<IFields[K]>
}


type ExtFieldsFamily<IFields> = {
  [K in keyof IFields]: IFields[K] extends AbstractFieldFamily<infer T, any> ? T : ExtFieldsFamily<IFields[K]>
}






type FieldsFamily<P extends SerializableParam> = {
  [key: string]: FieldsFamily<P>
} | AbstractFieldFamily<any, any>
type ModelFamilyProps<TFieldsFamily> = {
  fields: TFieldsFamily;
  key: NodeKey
}
type ModelProps<TFields> = { fields: TFields; key: NodeKey }
type FieldsArray = ({
  item: AbstractField<any> | AbstractFieldFamily<any, any>,
  nodeField: string[]
})[]

export class ModelFamily<T, P extends SerializableParam, TFieldsFamily extends FieldsFamily<P>> {
  fields: TFieldsFamily;
  key!: string;
  value!: (p: P) => RecoilState<T>;
  constructor(props: ModelFamilyProps<TFieldsFamily>) {
    const { key } = props;
    this.key = key;
    this.fields = props.fields;
  }
  build() {
    const { key, fields } = this;
    const fieldsArray: FieldsArray = [];
    buildFields(this)(
      [key, '$fields'].join('-'),
      [],
      fields,
      fieldsArray,
    );
    this.value = recoil.selectorFamily({
      key: [key, '$value'].join('-'),
      get: param => ({ get }) => {
        return getValueFamily({
          fields: fields,
          param,
          get
        });
      },
      set: param => ({ set, reset }, value) => {
        return setValueFamily({
          param,
          fields: fields,
          set,
          reset,
          value
        });
      },
    });
  }
};


export class Model<T, TFields extends Fields>  {
  fields: TFields;
  key!: string;
  value!: RecoilState<T>;
  constructor(props: ModelProps<TFields>) {

    const { key } = props;
    this.fields = props.fields;
    this.key = key;
  }

  build() {
    const { key, fields } = this;
    const fieldsArray: FieldsArray = [];
    buildFields(this)(
      [key, '$fields'].join('-'),
      [],
      fields,
      fieldsArray,
    );
    this.value = recoil.selector<T>({
      key: [key, '$value'].join('-'),
      get: ({ get }) => {
        return getValue({
          fields: fields,
          get
        });
      },
      set: ({ set, reset }, value) => {
        return setValue({
          fields: fields,
          set,
          reset,
          value
        });
      },
    });
  }
}

type ModelFamilyBuild = {
  <P extends SerializableParam, TFieldsFamily extends FieldsFamily<P>>(props: {
    fields: TFieldsFamily,
    key: string
  }): {
    build: <T extends ExtFieldsFamily<TFieldsFamily> = ExtFieldsFamily<TFieldsFamily>, P1 extends P = P>() => ModelFamily<T, P1, TFieldsFamily>
  }
}
type ModelBuild = {
  <TFields extends Fields>(props: {
    fields: TFields,
    key: string
  }): {
    build: <T extends ExtFields<TFields> = ExtFields<TFields>>() => Model<T, TFields>
  }
}



export const modelFamily: ModelFamilyBuild = ({
  fields,
  key
}) => {

  const m = new ModelFamily<any, any, any>({
    fields,
    key
  });
  return {
    build: () => {
      m.build();
      return m;
    }
  }
};


export const model: ModelBuild = (props) => {

  const m = new Model<any, any>(props);
  return {
    build: () => {
      m.build();
      return m;
    }
  }
};

export const buildFields = <M>(props: M) => (
  key: string,
  nodeField: string[],
  fields: Fields | FieldsFamily<any> | AbstractField<any> | AbstractFieldFamily<any, any>,
  itens: FieldsArray,
): void => {
  if (fields instanceof AbstractField || fields instanceof AbstractFieldFamily) {
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









const getValueFamily = (
  props: {
    fields: FieldsFamily<any>, get: GetRecoilValue,
    param: SerializableParam
  }): any => {

  const { fields, get, param } = props;
  if (fields instanceof AbstractFieldFamily) {
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

const getValue = <TFields>(
  props: {
    fields: AbstractField<TFields> | TFields, get: GetRecoilValue
  }): any => {

  const { fields, get } = props;
  if (fields instanceof AbstractField) {
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



const setValueFamily = (
  props: {
    fields: FieldsFamily<any>, set: SetRecoilState,
    param: SerializableParam,
    value: any | DefaultValue, reset: ResetRecoilState,

  }): void => {
  const { fields, set, param, value, reset } = props;
  if (fields instanceof AbstractFieldFamily) {
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


const resetValueFamily = (
  props: {
    fields: FieldsFamily<any>
    param: SerializableParam,
    reset: ResetRecoilState,

  }): void => {
  const { fields, param, reset } = props;
  if (fields instanceof AbstractFieldFamily) {
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

const setValue = (
  props: {
    fields: Fields, set: SetRecoilState,
    value: any | DefaultValue, reset: ResetRecoilState,

  }): void => {
  const { fields, set, value, reset } = props;
  if (fields instanceof AbstractField) {
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


const resetValue = (
  props: {
    fields: Fields
    reset: ResetRecoilState,

  }): void => {
  const { fields, reset } = props;
  if (fields instanceof AbstractField) {
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


