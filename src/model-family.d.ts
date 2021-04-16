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
export type ModelFamilyField<T, P extends SerializableParam> = {
  validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
  value: (param: P) => RecoilState<T>;
}
export type ModelFamilyFieldBuild<T, P extends SerializableParam> = {
  (): ModelFamilyField<T, P>
  _$ModelField: true
}
export type ModelFamilyFields<T, P extends SerializableParam> = {
  [k in keyof T]: T[k] extends { [key: string]: any } ? ModelFamilyFields<T[k], P> : ModelFamilyFieldBuild<T[k], P>
}
export type ModelFamilyFieldsReturn<T, P extends SerializableParam> = {
  [k in keyof T]: T[k] extends { [key: string]: any } ? ModelFamilyFields<T[k], P> : ModelFamilyField<T[k], P>
}

type ModelFamilyReturn<T, P extends SerializableParam> = {
  fields: ModelFamilyFieldsReturn<T, P>;
  validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
  value: (param: P) => RecoilState<T>;
  __$model: true;
};
export declare const modelFamily: {
  <T, P extends SerializableParam>(props: { fields: ModelFamilyFields<T, P>; key: NodeKey }): ModelFamilyReturn<T, P>;
};
