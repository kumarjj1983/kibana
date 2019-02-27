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

import { PanelActionAPI } from 'ui/embeddable/context_menu_actions/types';
import { Action } from './action';

class ActionsRegistry {
  private actions: { [key: string]: Action<any, any, any, any> } = {};

  public registerAction(action: Action<any, any, any, any>) {
    this.actions[action.id] = action;
  }

  public getActionById(id: string) {
    return this.actions[id];
  }

  public getCompatibleActions(panelAPI: PanelActionAPI<any, any>) {
    return Object.values(this.actions).filter((action: Action<any, any, any, any>) => {
      return action.isCompatible(panelAPI);
    });
  }
}

export const actionRegistry = new ActionsRegistry();
