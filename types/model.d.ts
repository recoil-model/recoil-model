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
  RecoilValue,
  CallbackInterface,
  Loadable,
  RecoilValueReadOnly,
  SerializableParam,
} from 'recoil';

import { ReactElement } from 'react';

export type ValidateInfo = {
  error: boolean;
  message: string | null;
  messages: string[];
};
type RecoilFieldComponentProps<T> = {
  value: T;
  setValue: (v: T) => void;
} & ValidateInfo;
type RecoilFieldProps<T> = {
  component: (props: RecoilFieldComponentProps<T>) => ReactElement<T, any>;
  valueRecoilState: RecoilState<T>;
  validateRecoilState: RecoilValue<ValidateInfo>;
};
type NodeKey = string;
type RecoilFieldC = <T>(props: RecoilFieldProps<T>) => ReactElement<T, any>;


export type Collection<T> = {
  rowCount: number;
  offset: number;
  limit: number;
  rows: T[];
};
type RecoilComboFieldComponentProps<
  T,
  TRequestFn extends { (...args: any[]): any }
  > = {
    value: T;
    setValue: (v: T) => void;
    collection: Loadable<Collection<T>>;
    request: TRequestFn;
  } & ValidateInfo;
type RecoilComboFieldProps<T, TRequestFn extends { (...args: any[]): any }> = {
  component: (
    props: RecoilComboFieldComponentProps<T, TRequestFn>,
  ) => ReactElement<T, any>;
  collectionRecoilValue: RecoilValue<Collection<T>>;
  requestCallback: (callbackInterface: CallbackInterface) => TRequestFn;
  valueRecoilState: RecoilState<T>;
  validateRecoilState: RecoilValue<ValidateInfo>;
};

type RecoilComboFieldC = <T, TRequestFn extends { (...args: any[]): any }>(
  props: RecoilComboFieldProps<T, TRequestFn>,
) => ReactElement<T, any>;


type RecoilCollectionComponentProps<
  T,
  TRequestFn extends { (...args: any[]): any }
  > = {
    collection: Loadable<Collection<T>>;
    request: TRequestFn;
  };
type RecoilCollectionProps<T, TRequestFn extends { (...args: any[]): any }> = {
  component: (
    props: RecoilCollectionComponentProps<T, TRequestFn>,
  ) => ReactElement<T, any>;
  collectionRecoilValue: RecoilValue<Collection<T>>;
  requestCallback: (callbackInterface: CallbackInterface) => TRequestFn;
};

type RecoilCollectionC = <T, TRequestFn extends { (...args: any[]): any }>(
  props: RecoilCollectionProps<T, TRequestFn>,
) => ReactElement<T, any>;

type RecoilValueFieldComponentProps<T> = {
  value: T;
  setValue: (v: T) => void;
};
type RecoilValueFieldProps<T> = {
  component: (props: RecoilValueFieldComponentProps<T>) => ReactElement<T, any>;
  valueRecoilState: RecoilState<T>;
};

type RecoilValueFieldC = <T>(
  props: RecoilValueFieldProps<T>,
) => ReactElement<T, any>;


export interface ModelFieldReturn<T> {
  validate: RecoilValueReadOnly<ValidateInfo>;
  value: RecoilState<T>;
}
export interface ModelField<T> {
  (key: NodeKey): ModelFieldReturn<T>;
  _$ModelField: true;
}
type ModelFields<T> = {
  [K in keyof T]?: T[K] extends ModelField<any> ? T[K] : ModelFields<T[K]>;
};

type ModelFieldsReturn<T> = {
  [K in keyof T]: T[K] extends ModelReturn<any>
  ? T[K]['fields']
  : T[K] extends ModelField<infer Y>
  ? {
    validate: RecoilValueReadOnly<ValidateInfo>;
    value: RecoilState<Y>;
  }
  : ModelFieldsReturn<T[K]>;
};

type ModelValueReturn<T> = {
  [K in keyof T]: T[K] extends ModelField<infer Y>
  ? Y
  : T[K] extends ModelReturn<any>
  ? T[K]['value']
  : ModelValueReturn<T[K]>;
};

type ModelReturn<T> = {
  fields: ModelFieldsReturn<T>;
  validate: RecoilValueReadOnly<ValidateInfo>;
  value: RecoilValue<ModelValueReturn<T>>;
  __$model: true;
};
export declare const model: {
  <T>(props: { fields: ModelFields<T>; key: NodeKey }): ModelReturn<T>;
};