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

import { AbstractField, AbstractFieldFamily, AbstractFieldStateFamily, AbstractFieldState } from './field';
import { NodeKey } from './types';

export type Fields = {
  [key: string]: Fields
} | AbstractField<any, any>

type ExtValueFields<IFields> = {
  [K in keyof IFields]?: IFields[K] extends AbstractField<infer T, any> ? T : ExtValueFields<IFields[K]>
}


type ExtValueFieldsFamily<IFields> = {
  [K in keyof IFields]: IFields[K] extends AbstractFieldFamily<infer T, any, any> ? T : ExtValueFieldsFamily<IFields[K]>
}
type ExtRawFields<IFields> = {
  [K in keyof IFields]:
  IFields[K] extends AbstractField<any, infer R> ? R : ExtRawFields<IFields[K]>
}
type ExtRawFieldsFamily<IFields> = {
  [K in keyof IFields]:
  IFields[K] extends AbstractFieldFamily<any, any, infer R> ? R : ExtRawFieldsFamily<IFields[K]>
}





export type FieldsFamily<P extends SerializableParam> = {
  [key: string]: FieldsFamily<P>
} | AbstractFieldFamily<any, any, any>
type FieldsArray = ({
  item: AbstractField<any, any> | AbstractFieldFamily<any, any, any>,
  nodeField: string[]
})[]

type KeysField = AbstractFieldFamily<any, any, any> | {
  [key: string]: AbstractFieldFamily<any, any, any>
}
export class ModelFamily<T, R, P extends SerializableParam, TFieldsFamily extends FieldsFamily<P>> {
  fields!: TFieldsFamily;
  key!: string;
  state!: (p: P) => RecoilState<T>;
  rawState!: (p: P) => RecoilState<R>;
  getKey!: (o: ExtRawFieldsFamily<TFieldsFamily>) => P
  addFields<TFieldsFamily1 extends FieldsFamily<P>>(
    fields: TFieldsFamily1 | ((fields: TFieldsFamily) => TFieldsFamily1)
  ): ModelFamily<ExtValueFieldsFamily<TFieldsFamily1 & TFieldsFamily>, ExtRawFieldsFamily<TFieldsFamily1 & TFieldsFamily>, P, TFieldsFamily1 & TFieldsFamily> {
    let f: TFieldsFamily1;
    if (typeof fields == 'function') {
      f = fields(this.fields)
    } else {
      f = fields;
    }
    this.fields = mergeFieldsFamily(this.fields ?? {}, f) as any;
    return this as any;
  }
  mapKey<P1 extends SerializableParam>(
    getKey: {
      (fields: ExtRawFieldsFamily<TFieldsFamily>): P1
    },
  ): ModelFamily<T, R, P1, TFieldsFamily> {
    this.getKey = getKey as any;
    return this as any;
  }
  constructor(key: NodeKey) {
    this.key = key;
  }
  public build(): ModelFamily<T, R, P, TFieldsFamily> {
    const { key, fields } = this;
    const fieldsArray: FieldsArray = [];
    buildFields(this)(
      [key, '$fields'].join('-'),
      [],
      fields,
      fieldsArray,
    );
    this.rawState = recoil.selectorFamily({
      key: [key, '$state'].join('-'),
      get: param => ({ get }) => {
        return getValueFamily({
          fields: fields,
          param,
          property: 'rawState',
          get
        });
      },
      set: param => ({ set, reset }, value) => {
        return setValueFamily({
          param,
          fields: fields,
          set,
          reset,
          property: 'rawState',
          value
        });
      },
    });

    this.state = recoil.selectorFamily({
      key: [key, '$state'].join('-'),
      get: param => ({ get }) => {
        return getValueFamily({
          fields: fields,
          param,
          property: 'state',
          get
        });
      },
      set: param => ({ set, reset }, value) => {
        return setValueFamily({
          param,
          fields: fields,
          set,
          reset,
          property: 'state',
          value
        });
      },
    });
    return this;
  }
};


export class Model<T, R, TFields extends Fields>  {
  fields!: TFields;
  key!: string;
  state!: RecoilState<T>;
  rawState!: RecoilState<R>;
  constructor(key: NodeKey) {
    this.key = key;
  }
  addFields<TFields1 extends Fields>(
    fields: TFields1 | ((fields: TFields) => TFields1)
  ): Model<ExtValueFields<TFields1 & TFields>, ExtRawFields<TFields1 & TFields>, TFields1 & TFields> {
    let f: TFields1;
    if (typeof fields == 'function') {
      f = fields(this.fields)
    } else {
      f = fields;
    }
    this.fields = mergeFields(this.fields ?? {}, f) as any;
    return this as any;
  }
  build(): Model<T, R, TFields> {
    const { key, fields } = this;
    const fieldsArray: FieldsArray = [];
    buildFields(this)(
      [key, '$fields'].join('-'),
      [],
      fields,
      fieldsArray,
    );

    this.rawState = recoil.selector<R>({
      key: [key, '$rawState'].join('-'),
      get: ({ get }) => {
        return getValue({
          fields: fields,
          get,
          property: 'rawState'
        });
      },
      set: ({ set, reset }, value) => {
        return setValue({
          fields: fields,
          set,
          property: 'rawState',
          reset,
          value
        });
      },
    });


    this.state = recoil.selector<T>({
      key: [key, '$state'].join('-'),
      get: ({ get }) => {
        return getValue({
          fields: fields,
          get,
          property: 'state'
        });
      },
      set: ({ set, reset }, value) => {
        return setValue({
          fields: fields,
          set,
          reset,
          property: 'state',
          value
        });
      },
    });
    return this;
  }
}


export const modelFamily = <T, R, P extends SerializableParam>(key: NodeKey) => {
  return new ModelFamily<T, R, P, {}>(key);
};


export const model = <T, R>(key: NodeKey) => {
  return new Model<T, R, {}>(key);
};


export const buildFields = <M>(props: M) => (
  key: string,
  nodeField: string[],
  fields: Fields | FieldsFamily<any> | AbstractField<any, any> | AbstractFieldFamily<any, any, any>,
  itens: FieldsArray,
): void => {
  if (fields instanceof AbstractFieldState || fields instanceof AbstractFieldStateFamily) {
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
    param: SerializableParam,
    property: 'state' | 'rawState'
  }): any => {

  const { fields, get, param } = props;
  if (fields instanceof AbstractFieldStateFamily) {
    return get(fields[props.property](param));
  } else {
    const obj: any = {};
    for (const _key in fields) {
      obj[_key] = getValueFamily({
        fields: fields[_key],
        get,
        param,
        property: props.property
      });
    }
    return obj;
  }
};

const getValue = (
  props: {
    fields: Fields,
    property: 'state' | 'rawState'
    get: GetRecoilValue

  }): any => {

  const { fields, get } = props;
  if (fields instanceof AbstractFieldState) {
    return get(fields[props.property]);
  } else {
    const obj: any = {};
    for (const _key in fields) {
      obj[_key] = getValue({
        fields: fields[_key],
        get,
        property: props.property
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
    property: 'state' | 'rawState'

  }): void => {
  const { fields, set, param, value, reset } = props;
  if (fields instanceof AbstractFieldStateFamily) {
    set(fields[props.property](param), value);
  } else {
    for (const _key in fields) {
      if (!(value instanceof DefaultValue) && value && value[_key]) {
        setValueFamily({
          fields: fields[_key],
          set,
          reset,
          property: props.property,
          param, value: value[_key]
        });
      } else {
        resetValueFamily({
          fields: fields[_key],
          property: props.property,
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
    property: 'state' | 'rawState'

  }): void => {
  const { fields, param, reset } = props;
  if (fields instanceof AbstractFieldStateFamily) {
    reset(fields[props.property](param));
  } else {
    for (const _key in fields) {
      resetValueFamily({
        fields: fields[_key],
        reset,
        property: props.property,
        param,
      });
    }
  }
};

const setValue = (
  props: {
    fields: Fields, set: SetRecoilState,
    value: any | DefaultValue, reset: ResetRecoilState,
    property: 'state' | 'rawState'

  }): void => {
  const { fields, set, value, reset } = props;
  if (fields instanceof AbstractFieldState) {
    set(fields[props.property], value);
  } else {
    for (const _key in fields) {
      if (!(value instanceof DefaultValue) && value && value[_key]) {
        setValue({
          fields: fields[_key],
          set,
          reset,
          property: props.property,
          value: value[_key]
        });
      } else {
        resetValue({
          fields: fields[_key],
          property: props.property,
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
    property: 'state' | 'rawState'

  }): void => {
  const { fields, reset } = props;
  if (fields instanceof AbstractFieldState) {
    reset(fields[props.property]);
  } else {
    for (const _key in fields) {
      resetValue({
        fields: fields[_key],
        reset,
        property: props.property
      });
    }
  }
};
function mergeFieldsFamily(target: any, sources: FieldsFamily<any>): FieldsFamily<any> {
  if (sources instanceof AbstractFieldStateFamily) {
    return sources;
  } else {
    for (const _key in sources) {
      target[_key] = mergeFieldsFamily(target[_key] ?? {}, sources[_key])
    }
  }
  return target;
}
function mergeFields(target: any, sources: Fields): Fields {
  if (sources instanceof AbstractFieldState) {
    return sources;
  } else {
    for (const _key in sources) {
      target[_key] = mergeFields(target[_key] ?? {}, sources[_key])
    }
  }
  return target;
}

