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
  RecoilValue,
} from 'recoil';
import { BaseSchema } from 'yup';
import { ModelFieldBuild } from './model';
import { ValidateInfo } from './validate-info';

export declare const field: {
  <T>(
    props: (
      {


        validate: (opts: {
          get: GetRecoilValue;
        }) => Promise<ValidateInfo> | RecoilValue<ValidateInfo> | ValidateInfo;
      }
      | {
        default: RecoilValue<T> | Promise<T> | T;
      }
      | {
        defaultGet: (opts: {
          get: GetRecoilValue;
        }) => Promise<T> | RecoilValue<T> | T;
      }
    ),
  ): ModelFieldBuild<T>;
};