/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { resolve } from 'path';

export function embeddableActions(kibana: any) {
  return new kibana.Plugin({
    id: 'panel_actions',
    uiExports: {
      contextMenuActions: ['plugins/embeddable_actions/plugin'],
    },
    publicDir: resolve(__dirname, 'public'),
  });
}
