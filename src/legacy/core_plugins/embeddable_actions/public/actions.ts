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

import { actionRegistry } from 'ui/embeddable';
import { actionFactoryRegistry } from 'ui/embeddable/actions/action_factory_registry';
import {
  FILTER_ACTION,
  SHOW_EDIT_MODE_ACTIONS,
  SHOW_VIEW_MODE_ACTIONS,
  triggerRegistry,
} from 'ui/embeddable/actions/trigger_registry';
import { ApplyFilterAction } from './apply_filter';
import { CustomizeEventsAction } from './customize_events_action';
import { CustomizePanelTitleAction } from './customize_panel_action';
import { ExpressionActionFactory } from './expression_action_factory';
import { HelloFilterAction } from './hello_filter_action';
import { CustomizeTimeRangeAction } from './time_picker_action';

actionRegistry.registerAction(new HelloFilterAction());
actionRegistry.registerAction(new ApplyFilterAction());
actionRegistry.registerAction(new CustomizePanelTitleAction());

triggerRegistry.getTrigger(SHOW_EDIT_MODE_ACTIONS).addAction(new CustomizePanelTitleAction());
triggerRegistry.getTrigger(SHOW_EDIT_MODE_ACTIONS).addAction(new CustomizeTimeRangeAction());
triggerRegistry.getTrigger(SHOW_VIEW_MODE_ACTIONS).addAction(new CustomizeTimeRangeAction());

triggerRegistry.getTrigger(SHOW_EDIT_MODE_ACTIONS).addAction(new CustomizeEventsAction());

triggerRegistry.getTrigger(FILTER_ACTION).addAction(new ApplyFilterAction());
actionFactoryRegistry.registerActionFactory(new ExpressionActionFactory());
