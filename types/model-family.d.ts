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


import { RecoilState, RecoilValue } from "recoil"
import { RecoilValueReadOnly } from "recoil"
import { NodeKey } from "./node-key"
import { ValidateInfo } from './validate-info';
export type ModelFieldFamily<T, P extends SerializableParam> = {
  validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
  value: (param: P) => RecoilState<T>;
}
export type ModelFieldFamilyBuild<T, P extends SerializableParam> = {
  (): ModelFieldFamily<T, P>
  _$ModelField: true
}
export type ModelFieldFamilys<T, P extends SerializableParam> = {
  [k in keyof T]:
  T[k] extends any[] ? ModelFieldFamilyBuild<T[k]> :
  T[k] extends { [key: string]: any } ? ModelFieldFamilys<T[k], P> : ModelFieldFamilyBuild<T[k], P>
}
export type ModelFieldFamilysReturn<T, P extends SerializableParam> = {
  [k in keyof T]:
  T[k] extends any[] ? ModelFieldFamily<T[k]> :
  T[k] extends { [key: string]: any } ? ModelFieldFamilys<T[k], P> : ModelFieldFamily<T[k], P>
}

type ModelFamilyReturn<T, P extends SerializableParam> = {
  fields: ModelFieldFamilysReturn<T, P>;
  validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
  value: (param: P) => RecoilState<T>;
  __$model: true;
};
export declare const modelFamily: {
  <T, P extends SerializableParam>(props: { fields: ModelFieldFamilys<T, P>; key: NodeKey }): ModelFamilyReturn<T, P>;
};
