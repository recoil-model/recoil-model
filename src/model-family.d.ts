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

import { RecoilState, SerializableParam } from "recoil";
import { RecoilValue } from "recoil";
import { RecoilValueReadOnly } from "recoil";
import { ModelFields, ModelFieldsReturn } from "./model";
import { NodeKey } from "./node-key";
import { ValidateInfo } from "./validate-info";



export interface ModelFieldReturnFamily<T, P extends SerializableParam> {
  validate: RecoilValueReadOnly<ValidateInfo>;
  value: RecoilState<T>;
}
export interface ModelFieldFamily<T, P extends SerializableParam> {
  (key: NodeKey): ModelFieldReturnFamily<T, P>;
  _$ModelField: true;
}

type ModelFieldsFamily<T, P extends SerializableParam> = {
  [K in keyof T]?: T[K] extends ModelFieldFamily<any, P>
  ? T[K]
  : ModelFields<T[K]>;
};

type ModelFieldsReturnFamily<T, P extends SerializableParam> = {
  [K in keyof T]: T[K] extends ModelReturnFamily<any, any>
  ? T[K]['fields']
  : T[K] extends ModelFieldFamily<infer Y, P>
  ? {
    validate: (p: P) => RecoilValueReadOnly<ValidateInfo>;
    value: (p: P) => RecoilState<Y>;
  }
  : ModelFieldsReturn<T[K]>;
};

type ModelValueReturnFamily<T, P extends SerializableParam> = {
  [K in keyof T]: T[K] extends ModelReturnFamily<any, any>
  ? T[K]['value']
  : T[K] extends ModelFieldFamily<infer Y, P>
  ? Y
  : ModelFieldsReturn<T[K]>;
};
type ModelReturnFamily<T, P extends SerializableParam> = {
  fields: ModelFieldsReturnFamily<T, P>;
  validate: (p: P) => RecoilValueReadOnly<ValidateInfo>;
  value: (p: P) => RecoilValue<ModelValueReturnFamily<T, P>>;
  __$model: true;
};

export declare const modelFamily: {
  <T, P extends SerializableParam>(props: {
    fields: ModelFieldsFamily<T, P>;
    key: NodeKey;
  }): ModelReturnFamily<T, P>;
};