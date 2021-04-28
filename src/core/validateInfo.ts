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

export class ValidateInfo {
  constructor(
    public message: string | null,
    public messages: string[],
    public error: boolean
  ) {

  }
};

export class ValidateInfoModel extends ValidateInfo {
  constructor(
    message: string | null,
    messages: string[],
    error: boolean,
    public fields: ValidateInfoFields
  ) {
    super(message, messages, error);
  }
};
export type ValidateInfoFields = {
  [fields: string]: ValidateInfo | ValidateInfoFields
}

const errorFields = (obj: ValidateInfoFields) => {
  let fields: ValidateInfoFields = {}
  let array: ValidateInfo[] = [];
  for (const key in obj) {
    let element = obj[key]
    if (element instanceof ValidateInfo) {
      fields[key] = element
      array.push(fields[key] as ValidateInfo);
    }
    else {
      const { fields: fieldsA, array: arrayA } = errorFields(element)
      fields[key] = fieldsA;
      array = [...array, ...arrayA]
    }
  }
  return { fields: fields, array };
}
const ok = new ValidateInfo(
  null,
  [],
  false,
)

const fields = (...msgs: any) => {
  const { fields, array } = errorFields(msgs[0]);
  const erros = array.filter((e) => e.error)
  if (erros.length == 0) {
    return {
      ...ok,
      fields
    }
  }
  return new ValidateInfoModel(
    erros.map((e: any) => e.message).join('\n'),
    erros.map((e: any) => e.message),
    true,
    fields
  )
};

const error: any = (...msgs: any[]) => {
  return new ValidateInfo(
    msgs.length > 0 ? msgs.join('') : null,
    msgs,
    true
  )
};
export const validateInfo = {
  fields,
  error,
  ok
}