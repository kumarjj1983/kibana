/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { EuiButton, EuiTextArea } from '@elastic/eui';
import React, { Component } from 'react';

export class EditExpression extends Component<
  { onDone: (e: string) => void },
  { expression: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      expression: '',
    };
  }

  public onChange = (e: any) => {
    this.setState({ expression: e.target.value });
  };

  public saveAndClose = () => {
    this.props.onDone(this.state.expression);
  };

  public cancelAndClose = () => {
    this.props.onDone('');
  };

  public render() {
    return (
      <div>
        <EuiTextArea
          aria-label="Use aria labels when no actual label is in use"
          value={this.state.expression}
          onChange={this.onChange}
        />
        <EuiButton onClick={this.saveAndClose}>Save</EuiButton>
        <EuiButton onClick={this.cancelAndClose}>Cancel</EuiButton>
      </div>
    );
  }
}
