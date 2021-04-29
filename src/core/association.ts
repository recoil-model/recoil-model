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
  RecoilState,
  SerializableParam,
} from 'recoil';
import recoil from 'recoil';
import { DefaultAndDefaultFamilyProps, DefaultAndDefaultProps } from './defaultProps';




type AssociationProps<T> = DefaultAndDefaultProps<T>

type AssociationFamilyProps<T, P extends SerializableParam> = DefaultAndDefaultFamilyProps<T, P>
export class AssociationFamily<T, P extends SerializableParam> {
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
  }
}
export class Association<T> {
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
  }
}

export const association = <T>(props: AssociationProps<T>): Association<T> => {
  return new Association<T>((key) => {
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
export const associationFamily = <T, P extends SerializableParam>(
  props: AssociationFamilyProps<T, P>
): AssociationFamily<T, P> => {
  return new AssociationFamily<T, P>((key) => {
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
