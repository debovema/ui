import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import {
  searchFields as containerSearchFields
} from 'shared/components/pod-dots/component';

export const headers = [
  {
    name: 'expand',
    sort: false,
    searchField: null,
    width: 30
  },
  {
    name: 'state',
    sort: ['sortState', 'displayName'],
    searchField: 'displayState',
    translationKey: 'generic.state',
    width: 120
  },
  {
    name: 'name',
    sort: ['sortName', 'id'],
    searchField: 'displayName',
    translationKey: 'generic.name',
  },
  {
    name: 'image',
    sort: ['image', 'displayName'],
    searchField: 'image',
    translationKey: 'generic.image',
  },
  {
    name: 'scale',
    sort: ['scale:desc', 'isGlobalScale:desc', 'displayName'],
    searchField: null,
    translationKey: 'stacksPage.table.scale',
    classNames: 'text-center',
    width: 100
  },
];

export default Controller.extend({
  projectController: controller('authenticated.project'),
  scope: service(),
  prefs: service(),

  queryParams: ['sortBy'],
  sortBy: 'name',

  actions: {
    toggleExpand() {
      this.get('projectController').send('toggleExpand', ...arguments);
    },
  },

  group: alias('projectController.group'),
  groupTableBy: alias('projectController.groupTableBy'),
  expandedInstances: alias('projectController.expandedInstances'),
  preSorts: alias('projectController.preSorts'),

  headers: headers,
  extraSearchFields: ['id:prefix', 'displayIp:ip'],
  extraSearchSubFields: containerSearchFields,

  rows: function () {
    const groupBy = this.get('group');
    let out = [];

    switch (groupBy) {
      case 'none':
      case 'node':
        out = this.get('model.pods');
        break;
      default:
        out = this.get('model.pods').filter(obj => !obj.get('workloadId'));
        out.pushObjects(this.get('model.workloads').slice());
        break
    }

    return out;
  }.property('group', 'model.workloads.@each.{namespaceId,isBalancer}', 'model.pods.@each.{workloadId,namespaceId}'),

  groupByRef: function() {
    const group = this.get('group');
    if(group === 'node') {
      return 'nodeId';
    } else {
      return group
    }
  }.property('group'),
});
