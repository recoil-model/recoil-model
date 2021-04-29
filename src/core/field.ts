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

import {
  GetRecoilValue,
  RecoilState,
  RecoilValue,
  SerializableParam,
} from 'recoil';
import recoil from 'recoil';
import { DefaultAndDefaultFamilyProps, DefaultAndDefaultProps } from './defaultProps';


export abstract class AbstractField<T> {
  public value!: RecoilState<T>;
  public abstract build(key: string, nodeField: string[]): void
}
export abstract class AbstractFieldFamily<T, P extends SerializableParam> {
  public value!: (param: P) => RecoilState<T>;
  public abstract build(key: string, nodeField: string[]): void
}




type FieldProps<T> = DefaultAndDefaultProps<T>

type FieldFamilyProps<T, P extends SerializableParam> = DefaultAndDefaultFamilyProps<T, P>
export class FieldFamily<T, P extends SerializableParam> extends AbstractFieldFamily<T, P> {
  public value!: (param: P) => RecoilState<T>
  public build(key: string, nodeField: string[]) {
    const { value } = this.FnBuild(key, nodeField)
    this.value = value;
  }
  constructor(
    private FnBuild: {
      (key: string, nodeField: string[]): {
        value: (param: P) => RecoilState<T>
      }
    }) {
    super();
  }
}

export class Field<T> extends AbstractField<T> {
  public value!: RecoilState<T>
  public build(key: string, nodeField: string[]) {
    const { value } = this.FnBuild(key, nodeField)
    this.value = value;
  }
  constructor(
    private FnBuild: {
      (key: string, nodeField: string[]): {
        value: RecoilState<T>
      }
    }) {
    super();
  }
}

export const field = <T>(props: FieldProps<T>): Field<T> => {
  return new Field<T>((key) => {
    let value;
    if ((props as any).defaultSelector) {
      let ldefault = recoil.selector<T>({
        key: [key, '$value', '$default'].join('-'),
        get: (props as any).defaultSelector,
      });
      value = recoil.atom<T>({
        key: [key, '$value'].join('-'),
        default: ldefault,
      });
    } else {
      value = recoil.atom<T>({
        key: [key, '$value'].join('-'),
        default: (props as any).default,
      });
    }
    return {
      value,
    };
  });
};
export const fieldFamily = <T, P extends SerializableParam>(
  props: FieldFamilyProps<T, P>
): FieldFamily<T, P> => {
  return new FieldFamily<T, P>((key) => {
    let value;
    if ((props as any).defaultSelector) {
      let ldefault = recoil.selectorFamily<T, P>({
        key: [key, '$value', '$default'].join('-'),
        get: (props as any).defaultSelector,
      });
      value = recoil.atomFamily<T, P>({
        key: [key, '$value'].join('-'),
        default: ldefault,
      });
    } else {
      value = recoil.atomFamily<T, P>({
        key: [key, '$value'].join('-'),
        default: (props as any).default,
      });
    }
    return {
      value,
    }
  });
};
