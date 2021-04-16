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
export type ModelField<T> = {
  validate: RecoilValueReadOnly<ValidateInfo>;
  value: RecoilState<T>;
}
export type ModelFieldBuild<T> = {
  (): ModelField<T>
  _$ModelField: true
}
export type ModelFields<T> = {
  [k in keyof T]:

  T[k] extends any[] ? ModelFieldBuild<T[k]> :
  T[k] extends { [key: string]: any } ? ModelFields<T[k]> : ModelFieldBuild<T[k]>
}
export type ModelFieldsReturn<T> = {
  [k in keyof T]:
  T[k] extends any[] ? ModelField<T[k]> :
  T[k] extends { [key: string]: any } ? ModelFields<T[k]> : ModelField<T[k]>
}

type ModelReturn<T> = {
  fields: ModelFieldsReturn<T>;
  validate: RecoilValueReadOnly<ValidateInfo>;
  value: RecoilState<T>;
  __$model: true
};
export type ModelFn = {
  <T>(fields: ModelFields<T>): ModelFields<T>
}
export type ModelFieldBuildFn = {
  <T>(value: T): ModelFieldBuild<T>
}
export declare const model: {
  <T>(props: { fields: ModelFields<T>; key: NodeKey }): ModelReturn<T>;
};
