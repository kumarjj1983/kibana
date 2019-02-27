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
import { fromExpression } from '@kbn/interpreter/common';
import React from 'react';
// @ts-ignore
import { interpretAst } from '../../interpreter/public/interpreter';
import {
  DashboardContainer,
  DashboardEmbeddable,
  DashboardEmbeddableInput,
} from '../../kibana/public/dashboard/embeddables/dashboard_container';
import { CustomizeTimeRangeFlyout } from './customize_time_range_flyout';

interface CustomizePanelTitleActionInput {
  titleOverride?: string;
  inherit: boolean;
}

export class ExpressionAction extends Action<any, any, any, any> {
  constructor(private expression: string) {
    super({ id: 'expressionAction', displayName: 'Custom Expression Action' });
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

  public execute({
    embeddable,
    actionInput,
    container,
  }: ExecuteOptions<CustomizePanelTitleActionInput, DashboardEmbeddable, DashboardContainer>) {
    const ast = fromExpression(this.expression);
    interpretAst(ast, actionInput);
  }
}
