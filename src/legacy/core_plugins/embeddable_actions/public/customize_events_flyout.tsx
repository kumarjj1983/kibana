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

import {
  EuiButton,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiSelect,
  EuiTab,
  EuiTitle,
} from '@elastic/eui';
import React, { Component } from 'react';
import { Action, actionRegistry } from 'ui/embeddable/actions';
import { ActionFactory } from 'ui/embeddable/actions/action_factory';
import { actionFactoryRegistry } from 'ui/embeddable/actions/action_factory_registry';
import { SHOW_EDIT_MODE_ACTIONS, triggerRegistry } from 'ui/embeddable/actions/trigger_registry';
import { DashboardContainer } from '../../kibana/public/dashboard/embeddables';
import { DashboardEmbeddable } from '../../kibana/public/dashboard/embeddables/dashboard_container';

interface CustomizeEventsFlyoutProps {
  container: DashboardContainer;
  embeddable: DashboardEmbeddable;
  onClose: () => void;
}

interface CustomizeEventsFlyoutState {
  triggerValue: string;
  triggerToActionMap: { [key: string]: Array<Action<any, any, any, any>> };
  tabId: string;
  actionFactoryId: string;
}

export class CustomizeEventsFlyout extends Component<
  CustomizeEventsFlyoutProps,
  CustomizeEventsFlyoutState
> {
  private tabs: Array<{ id: string; name: string }>;

  constructor(props: CustomizeEventsFlyoutProps) {
    super(props);
    this.state = {
      triggerValue: this.getTriggerOptions()[0].value,
      triggerToActionMap: this.getTriggerActionMapping(),
      tabId: 'events',
      actionFactoryId: this.getActionFactoryOptions()[0].value,
    };

    this.tabs = [
      {
        id: 'events',
        name: 'Customize events',
      },
      {
        id: 'actions',
        name: 'Create new actions',
      },
    ];
  }

  public onSelectedTabChanged = (id: string) => {
    this.setState({
      tabId: id,
    });
  };

  public renderTabs() {
    return this.tabs.map((tab: { id: string; name: string }, index: number) => (
      <EuiTab
        onClick={() => this.onSelectedTabChanged(tab.id)}
        isSelected={tab.id === this.state.tabId}
        key={index}
      >
        {tab.name}
      </EuiTab>
    ));
  }

  public renderTabBody() {
    switch (this.state.tabId) {
      case 'events': {
        return this.renderSetUpEvents();
      }
      case 'actions': {
        return this.renderCreateNewActions();
      }
    }
  }

  public render() {
    return (
      <React.Fragment>
        <EuiFlyoutHeader>
          <EuiTitle size="s" data-test-subj="customizePanelTitle">
            <h1>{this.props.embeddable.getOutput().title}</h1>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          {this.renderTabs()}
          {this.renderTabBody()}
        </EuiFlyoutBody>
      </React.Fragment>
    );
  }

  private createNewAction = async () => {
    const actionFactory = actionFactoryRegistry.getFactoryById(this.state.actionFactoryId);
    actionRegistry.registerAction(
      await actionFactory.create({
        embeddable: this.props.embeddable,
        container: this.props.container,
      });
    );
  }

  private renderCreateNewActions() {
    return (
      <div>
        {this.renderActionFactorySelect()}
        <EuiButton onClick={this.createNewAction}>Create new action</EuiButton>
      </div>
    );
  }

  private renderSetUpEvents() {
    return (
      <div>
        {this.renderTriggerSelect()}
        {this.renderExistingActions()}
        <div> Add Action: </div>
        {this.renderAvailableActions()}
      </div>
    );
  }

  private updateTriggerMapping() {
    this.setState({ triggerToActionMap: this.getTriggerActionMapping() });
  }

  private getTriggerActionMapping() {
    const mapping: { [key: string]: Array<Action<any, any, any, any>> } = {};
    triggerRegistry.getTriggerIds().forEach((id: string) => {
      mapping[id] = triggerRegistry.getTrigger(id).getCompatibleActions({
        container: this.props.container,
        embeddable: this.props.embeddable,
      });
    });
    return mapping;
  }

  private removeTriggerMapping = (actionId: string) => {
    triggerRegistry.getTrigger(this.state.triggerValue).removeAction(actionId);
    this.updateTriggerMapping();
  };

  private addTriggerMapping = (action: Action<any, any, any, any>) => {
    triggerRegistry.getTrigger(this.state.triggerValue).addAction(action);
    this.updateTriggerMapping();
  };

  private renderExistingActions() {
    const actions = this.state.triggerToActionMap[this.state.triggerValue];

    return actions.map((action: Action<any, any, any, any>) => {
      return (
        <div>
          <EuiButton onClick={() => this.removeTriggerMapping(action.id)}>Delete</EuiButton>
          {action.displayName}
        </div>
      );
    });
  }

  private renderAvailableActions() {
    const actions = actionRegistry.getCompatibleActions({
      embeddable: this.props.embeddable,
      container: this.props.container,
    });

    const trigger = triggerRegistry.getTrigger(this.state.triggerValue);
    return actions
      .filter(action => !trigger.containsAction(action.id))
      .map((action: Action<any, any, any, any>) => {
        return (
          <div>
            <EuiButton onClick={() => this.addTriggerMapping(action)}>Attach</EuiButton>
            {action.displayName}
          </div>
        );
      });
  }

  private getTriggerOptions() {
    return triggerRegistry
      .getTriggerIds()
      .filter((id: string) => id !== SHOW_EDIT_MODE_ACTIONS)
      .map((id: string) => ({
        value: id,
        text: id,
      }));
  }

  private changeTrigger = (evt: any) => {
    this.setState({ triggerValue: evt.target.value });
  };

  private renderTriggerSelect() {
    return (
      <EuiSelect
        options={this.getTriggerOptions()}
        value={this.state.triggerValue}
        onChange={this.changeTrigger}
      />
    );
  }

  private getActionFactoryOptions() {
    return actionFactoryRegistry
      .getCompatibleFactories({
        embeddable: this.props.embeddable,
        container: this.props.container,
      })
      .map((actionFactory: ActionFactory) => ({
        value: actionFactory.id,
        text: actionFactory.id,
      }));
  }

  private changeFactory = (evt: any) => {
    this.setState({ actionFactoryId: evt.target.value });
  };

  private renderActionFactorySelect() {
    return (
      <EuiSelect
        options={this.getActionFactoryOptions()}
        value={this.state.actionFactoryId}
        onChange={this.changeFactory}
      />
    );
  }
}
