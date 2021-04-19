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
import { ElementType, ReactElement, ComponentType } from 'react'
import { RecoilState, RecoilValue, SerializableParam, waitForAll } from 'recoil'
import { ModelField } from './model'
import { ModelFieldFamily } from './model-family'
import { ValidateInfo } from './validate-info'

type Props<IPropsResolve> = {
  value: IPropsResolve,
  setValue: (p: IPropsResolve) => void,
  validate: ValidateInfo
}

type RecoilModelFieldProps<IPropsResolve> = {
  field: ModelField<IPropsResolve>;
  component: (props: Props<IPropsResolve>) => ReactElement<any, any>;
}


type RecoilModelFieldFamilyProps<IPropsResolve, IParam> = {
  field: ModelFieldFamily<IPropsResolve, IParam>;
  param: IParam;
  component: (props: Props<IPropsResolve>, param: IParam) => ReactElement<any, any>;
}

export const RecoilModelField: {
  <IPropsResolve>(props: RecoilModelFieldProps<IPropsResolve>, context?: any): ReactElement<any, any>
  <IPropsResolve, IParam extends SerializableParam>(props: RecoilModelFieldFamilyProps<IPropsResolve, IParam>, context?: any): ReactElement<any, any>
}
