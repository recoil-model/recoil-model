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

import { modelFamily } from '../model-family';
import { fieldFamilyYup } from '../yup-family';
import { RecoilRoot } from 'recoil';
import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import { RecoilModelField } from '../recoil-model-field';

const mapToProps = (props) => {
  return {
    onChange: (e) => {
      props.setValue(e.target.value)
    },
    value: props.value,
  }
}

let container;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});


describe('recoil-model-field', () => {
  const personModel = modelFamily({
    key: 'recoil-model-field',
    fields: {
      name: fieldFamilyYup({
        default: '',
      }),
      email: fieldFamilyYup({
        default: '',
      }),
    },
  });
  const id = "01";
  test('model-family-basic', async done => {
    const { getByTestId } = render(
      <RecoilRoot>
        <RecoilModelField
          params={id}
          field={personModel.fields.name}
          component={(props) => <input data-testid="input-name-1"  {...mapToProps(props)} />}
        />
        <RecoilModelField
          params={id}
          field={personModel.fields.name}
          component={(props) => <input data-testid="input-name-2"  {...mapToProps(props)} />}
        />
      </RecoilRoot>
    )
    const inputName1 = await getByTestId('input-name-1');
    fireEvent.change(inputName1, { target: { value: '239487878787877' } })
    const inputName2 = await getByTestId('input-name-2')
    await expect(inputName2.value)
      .toEqual('239487878787877');
    done();
  });
});
