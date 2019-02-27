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

import { Container } from 'ui/embeddable';
import { Action } from 'ui/embeddable/actions/action';
import { Embeddable } from 'ui/embeddable/embeddables';

export class Trigger<O> {
  private actions: Array<Action<O, any, any, any>> = [];

  constructor(public readonly id: string) {}

  public getCompatibleActions<EI, EO, CI, CO>({
    embeddable,
    container,
  }: {
    embeddable: Embeddable<EI, EO>;
    container: Container<CI, CO, EI>;
  }) {
    return this.actions.filter(action => action.isCompatible({ embeddable, container }));
  }

  public addAction(action: Action<O, any, any, any>) {
    this.actions.push(action);
  }

  public containsAction(id: string) {
    return !!this.actions.find(action => action.id === id);
  }

  public removeAction(actionId: string) {
    this.actions = this.actions.filter(action => action.id !== actionId);
  }
}
