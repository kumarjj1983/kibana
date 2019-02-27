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

import { Action } from 'ui/embeddable/actions';
import { ExecuteOptions } from 'ui/embeddable/actions/action';

// @ts-ignore
import {
  EuiButton,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';
import React, { Component } from 'react';
import { ActionFactory, CreateOptions } from 'ui/embeddable/actions/action_factory';
import { FlyoutSession, openFlyout } from 'ui/flyout';
// @ts-ignore
import { interpretAst } from '../../interpreter/public/interpreter';
import {
  DashboardContainer,
  DashboardEmbeddable,
  DashboardEmbeddableInput,
} from '../../kibana/public/dashboard/embeddables/dashboard_container';
import { EditExpression } from './edit_expression';
import { ExpressionAction } from './expression_action';

export class ExpressionActionFactory extends ActionFactory {
  constructor() {
    super({ id: 'expressionActionFactory', displayName: 'Custom Expression Action' });
  }

  public isCompatible({
    embeddable,
    container,
  }: {
    embeddable: DashboardEmbeddable;
    container: DashboardContainer;
  }) {
    return Promise.resolve(true);
  }

  public async create({ embeddable, container }: CreateOptions) {
    return new Promise((resolve, reject) => {
      let session: FlyoutSession;
      const onDone = (e: string) => {
        if (session) {
          session.close();
        }
        e === '' ? resolve(undefined) : resolve(new ExpressionAction(e));
      };

      session = openFlyout(
        <React.Fragment>
          <EuiFlyoutHeader>
            <EuiTitle size="s" data-test-subj="samplePanelActionTitle">
              <h1>Espression for action:</h1>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EditExpression onDone={onDone} />
          </EuiFlyoutBody>
        </React.Fragment>,
        {
          'data-test-subj': 'samplePanelActionFlyout',
        }
      );
    });
  }
}
