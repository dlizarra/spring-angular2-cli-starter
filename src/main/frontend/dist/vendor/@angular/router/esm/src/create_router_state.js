/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, RouterState } from './router_state';
import { TreeNode } from './utils/tree';
export function createRouterState(curr, prevState) {
    const root = createNode(curr._root, prevState ? prevState._root : undefined);
    const queryParams = prevState ? prevState.queryParams : new BehaviorSubject(curr.queryParams);
    const fragment = prevState ? prevState.fragment : new BehaviorSubject(curr.fragment);
    return new RouterState(root, queryParams, fragment, curr);
}
function createNode(curr, prevState) {
    if (prevState && equalRouteSnapshots(prevState.value.snapshot, curr.value)) {
        const value = prevState.value;
        value._futureSnapshot = curr.value;
        const children = createOrReuseChildren(curr, prevState);
        return new TreeNode(value, children);
    }
    else {
        const value = createActivatedRoute(curr.value);
        const children = curr.children.map(c => createNode(c));
        return new TreeNode(value, children);
    }
}
function createOrReuseChildren(curr, prevState) {
    return curr.children.map(child => {
        const index = prevState.children.findIndex(p => equalRouteSnapshots(p.value.snapshot, child.value));
        if (index >= 0) {
            return createNode(child, prevState.children[index]);
        }
        else {
            return createNode(child);
        }
    });
}
function createActivatedRoute(c) {
    return new ActivatedRoute(new BehaviorSubject(c.url), new BehaviorSubject(c.params), c.outlet, c.component, c);
}
function equalRouteSnapshots(a, b) {
    return a._routeConfig === b._routeConfig;
}
//# sourceMappingURL=create_router_state.js.map