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

import { ValidateInfo, validateInfo } from "./validateInfo";
import {
  GetRecoilValue,
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
  SerializableParam,
} from 'recoil';
import recoil from 'recoil';
export class FieldFamily<T, P extends SerializableParam> {
  public validate!: (param: P) => RecoilValueReadOnly<ValidateInfo>
  public value!: (param: P) => RecoilState<T>
  public build(key: string, nodeField: string[]) {
    const { validate, value } = this.FnBuild(key, nodeField)
    this.validate = validate;
    this.value = value;
  }
  constructor(
    private FnBuild: {
      (key: string, nodeField: string[]): {
        validate: (param: P) => RecoilValueReadOnly<ValidateInfo>,
        value: (param: P) => RecoilState<T>
      }
    }) {
  }
}
export class Field<T> {
  public validate!: RecoilValueReadOnly<ValidateInfo>
  public value!: RecoilState<T>
  public build(key: string, nodeField: string[]) {
    const { validate, value } = this.FnBuild(key, nodeField)
    this.validate = validate;
    this.value = value;
  }
  constructor(
    private FnBuild: {
      (key: string, nodeField: string[]): {
        validate: RecoilValueReadOnly<ValidateInfo>,
        value: RecoilState<T>
      }
    }) {
  }
}



type FieldProps<T> = {
  validate: (opts: {
    get: GetRecoilValue;
  }) => Promise<ValidateInfo> | RecoilValue<ValidateInfo> | ValidateInfo;
} & ({
  defaultSelector?: undefined
  default: RecoilValue<T> | Promise<T> | T;
} | {
  default?: undefined
  defaultSelector: (opts: {
    get: GetRecoilValue;
  }) => Promise<T> | RecoilValue<T> | T;
})

export const field = <T>(props: FieldProps<T>): Field<T> => {
  let validate = props.validate ?? (() => {
    return validateInfo.ok;
  })
  return new Field((key, nodeField) => {
    let value;
    if (props.defaultSelector) {
      let ldefault = recoil.selector({
        key: [key, '$value', '$default'].join('-'),
        get: props.defaultSelector,
      });
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        default: ldefault,
      });
    } else {
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        default: props.default,
      });
    }
    return {
      validate: recoil.selector({
        key: [key, 'props.validate'].join('-'),
        get: validate,
      }),
      value,
    };
  });
};
type FieldFamilyProps<T, P extends SerializableParam> =
  {
    validate?: (
      param: P,
    ) => (opts: {
      get: GetRecoilValue;
    }) => Promise<ValidateInfo> | RecoilValue<ValidateInfo> | ValidateInfo;
  } & ({
    defaultSelector: undefined
    default:
    | RecoilValue<T>
    | Promise<T>
    | T
    | ((param: P) => T | RecoilValue<T> | Promise<T>);
  }
    | {
      default: undefined
      defaultSelector: (
        param: P,
      ) => (opts: {
        get: GetRecoilValue;
      }) => Promise<T> | RecoilValue<T> | T;
    })
export const fieldFamily = <T, P extends SerializableParam>(
  props: FieldFamilyProps<T, P>
): FieldFamily<T, P> => {
  const validate = props.validate ?? (params => ({ get }) => {
    return validateInfo.ok;
  })
  return new FieldFamily((key, nodeField) => {
    let value;
    if (props.defaultSelector) {
      let ldefault = recoil.selectorFamily({
        key: [key, '$value', '$default'].join('-'),
        get: props.defaultSelector,
      });
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        default: ldefault,
      });
    } else {
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        default: props.default,
      });
    }
    return {
      validate: recoil.selectorFamily({
        key: [key, 'props.validate'].join('-'),
        get: validate,
      }),
      value,
    }
  });
};