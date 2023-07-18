/* eslint-disable vue/prefer-import-from-vue */
import {
  getCurrentInstance,
  // getComponentName
} from 'vue' // "../component"
import { 
  cloneVNode,
  isVNode,
  // invokeVNodeHook,
  callWithAsyncErrorHandling,
  // isSameVNodeType
} from 'vue' // "../vnode"
import { warn } from 'vue' // "../warning"
import {
  onBeforeUnmount,
  onMounted,
  onUpdated
} from 'vue' // "../apiLifecycle"
import {
  isString,
  isArray,
  isRegExp,
  // ShapeFlags,
  invokeArrayFns,
  isFunction
} from '@vue/shared'
import { watch } from 'vue' // "../apiWatch"
import { 
  // queuePostRenderEffect, // queuePostFlushCb 필요
  queuePostFlushCb,
  // MoveType 
} from 'vue' // "../renderer"
import { setTransitionHooks } from 'vue' // "./BaseTransition"
// import { devtoolsComponentAdded } from 'vue' // "../devtools"
// import { isAsyncWrapper } from 'vue' // "../apiAsyncComponent"
// import { isSuspense } from 'vue' // "./Suspense"

function getComponentName(Component, includeInferred = true) {
  return isFunction(Component)
    ? Component.displayName || Component.name
    : Component.name || (includeInferred && Component.__name)
}

function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, ErrorCodes.VNODE_HOOK, [
    vnode,
    prevVNode
  ])
}

function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}

// const queuePostRenderEffect = __FEATURE_SUSPENSE__ ? queueEffectWithSuspense : queuePostFlushCb
// const queuePostRenderEffect = queueEffectWithSuspense
const queuePostRenderEffect = queuePostFlushCb

function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn)
    } else {
      suspense.effects.push(fn)
    }
  } else {
    queuePostFlushCb(fn)
  }
}

var MoveType
;(function(MoveType) {
  MoveType[(MoveType["ENTER"] = 0)] = "ENTER"
  MoveType[(MoveType["LEAVE"] = 1)] = "LEAVE"
  MoveType[(MoveType["REORDER"] = 2)] = "REORDER"
})(MoveType || (MoveType = {}))

const isAsyncWrapper = i => !!i.type.__asyncLoader

const isSuspense = type => type.__isSuspense

let ErrorCodes
;(function(ErrorCodes) {
  ErrorCodes[(ErrorCodes["SETUP_FUNCTION"] = 0)] = "SETUP_FUNCTION"
  ErrorCodes[(ErrorCodes["RENDER_FUNCTION"] = 1)] = "RENDER_FUNCTION"
  ErrorCodes[(ErrorCodes["WATCH_GETTER"] = 2)] = "WATCH_GETTER"
  ErrorCodes[(ErrorCodes["WATCH_CALLBACK"] = 3)] = "WATCH_CALLBACK"
  ErrorCodes[(ErrorCodes["WATCH_CLEANUP"] = 4)] = "WATCH_CLEANUP"
  ErrorCodes[(ErrorCodes["NATIVE_EVENT_HANDLER"] = 5)] = "NATIVE_EVENT_HANDLER"
  ErrorCodes[(ErrorCodes["COMPONENT_EVENT_HANDLER"] = 6)] =
    "COMPONENT_EVENT_HANDLER"
  ErrorCodes[(ErrorCodes["VNODE_HOOK"] = 7)] = "VNODE_HOOK"
  ErrorCodes[(ErrorCodes["DIRECTIVE_HOOK"] = 8)] = "DIRECTIVE_HOOK"
  ErrorCodes[(ErrorCodes["TRANSITION_HOOK"] = 9)] = "TRANSITION_HOOK"
  ErrorCodes[(ErrorCodes["APP_ERROR_HANDLER"] = 10)] = "APP_ERROR_HANDLER"
  ErrorCodes[(ErrorCodes["APP_WARN_HANDLER"] = 11)] = "APP_WARN_HANDLER"
  ErrorCodes[(ErrorCodes["FUNCTION_REF"] = 12)] = "FUNCTION_REF"
  ErrorCodes[(ErrorCodes["ASYNC_COMPONENT_LOADER"] = 13)] =
    "ASYNC_COMPONENT_LOADER"
  ErrorCodes[(ErrorCodes["SCHEDULER"] = 14)] = "SCHEDULER"
})(ErrorCodes || (ErrorCodes = {}))

let ShapeFlags
;(function(ShapeFlags) {
  ShapeFlags[(ShapeFlags["ELEMENT"] = 1)] = "ELEMENT"
  ShapeFlags[(ShapeFlags["FUNCTIONAL_COMPONENT"] = 2)] = "FUNCTIONAL_COMPONENT"
  ShapeFlags[(ShapeFlags["STATEFUL_COMPONENT"] = 4)] = "STATEFUL_COMPONENT"
  ShapeFlags[(ShapeFlags["TEXT_CHILDREN"] = 8)] = "TEXT_CHILDREN"
  ShapeFlags[(ShapeFlags["ARRAY_CHILDREN"] = 16)] = "ARRAY_CHILDREN"
  ShapeFlags[(ShapeFlags["SLOTS_CHILDREN"] = 32)] = "SLOTS_CHILDREN"
  ShapeFlags[(ShapeFlags["TELEPORT"] = 64)] = "TELEPORT"
  ShapeFlags[(ShapeFlags["SUSPENSE"] = 128)] = "SUSPENSE"
  ShapeFlags[(ShapeFlags["COMPONENT_SHOULD_KEEP_ALIVE"] = 256)] =
    "COMPONENT_SHOULD_KEEP_ALIVE"
  ShapeFlags[(ShapeFlags["COMPONENT_KEPT_ALIVE"] = 512)] =
    "COMPONENT_KEPT_ALIVE"
  ShapeFlags[
    (ShapeFlags["COMPONENT"] =
      ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT)
  ] = "COMPONENT"
})(ShapeFlags || (ShapeFlags = {}))





const isKeepAlive = vnode => vnode.type.__isKeepAlive

const KeepAliveImpl = {
  name: `KeepAlive`,

  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  setup(props, { slots }) {
    const instance = getCurrentInstance()
    // KeepAlive communicates with the instantiated renderer via the
    // ctx where the renderer passes in its internals,
    // and the KeepAlive instance exposes activate/deactivate implementations.
    // The whole point of this is to avoid importing KeepAlive directly in the
    // renderer to facilitate tree-shaking.
    const sharedContext = instance.ctx

    // if the internal renderer is not registered, it indicates that this is server-side rendering,
    // for KeepAlive, we just need to render its children
    // if (__SSR__ && !sharedContext.renderer) {
    //   return () => {
    //     const children = slots.default && slots.default()
    //     return children && children.length === 1 ? children[0] : children
    //   }
    // }

    const cache = new Map()
    const keys = new Set()
    let current = null

    // if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
    //   instance.__v_cache = cache
    // }

    const parentSuspense = instance.suspense

    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement }
      }
    } = sharedContext
    const storageContainer = createElement("div")

    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance = vnode.component
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense)
      // in case props have changed
      patch(
        instance.vnode,
        vnode,
        container,
        anchor,
        instance,
        parentSuspense,
        isSVG,
        vnode.slotScopeIds,
        optimized
      )
      queuePostRenderEffect(() => {
        instance.isDeactivated = false
        if (instance.a) {
          invokeArrayFns(instance.a)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
      }, parentSuspense)

      // if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      //   // Update components tree
      //   devtoolsComponentAdded(instance)
      // }
    }

    sharedContext.deactivate = vnode => {
      const instance = vnode.component
      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense)
      queuePostRenderEffect(() => {
        if (instance.da) {
          invokeArrayFns(instance.da)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
        instance.isDeactivated = true
      }, parentSuspense)

      // if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      //   // Update components tree
      //   devtoolsComponentAdded(instance)
      // }
    }

    function unmount(vnode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode)
      _unmount(vnode, instance, parentSuspense, true)
    }

    function pruneCache(filter) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type)
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key)
        }
      })
    }

    function pruneCacheEntry(key) {
      const cached = cache.get(key)
      if (!current || !isSameVNodeType(cached, current)) {
        unmount(cached)
      } else if (current) {
        // current active instance should no longer be kept-alive.
        // we can't unmount it now but it might be later, so reset its flag now.
        resetShapeFlag(current)
      }
      cache.delete(key)
      keys.delete(key)
    }

    // prune cache on include/exclude prop change
    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache(name => matches(include, name))
        exclude && pruneCache(name => !matches(exclude, name))
      }, // prune post-render after `current` has been updated
      { flush: "post", deep: true }
    )

    // cache sub tree after render
    let pendingCacheKey = null
    const cacheSubtree = () => {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree))
      }
    }
    onMounted(cacheSubtree)
    onUpdated(cacheSubtree)

    onBeforeUnmount(() => {
      cache.forEach(cached => {
        const { subTree, suspense } = instance
        const vnode = getInnerChild(subTree)
        if (cached.type === vnode.type && cached.key === vnode.key) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode)
          // but invoke its deactivated hook here
          const da = vnode.component.da
          da && queuePostRenderEffect(da, suspense)
          return
        }
        unmount(cached)
      })
    })

    return () => {
      pendingCacheKey = null

      if (!slots.default) {
        return null
      }

      const children = slots.default()
      const rawVNode = children[0]
      if (children.length > 1) {
        // if (__DEV__) {
        //   warn(`KeepAlive should contain exactly one component child.`)
        // }
        current = null
        return children
      } else if (
        !isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) &&
          !(rawVNode.shapeFlag & ShapeFlags.SUSPENSE))
      ) {
        current = null
        return rawVNode
      }

      let vnode = getInnerChild(rawVNode)
      const comp = vnode.type

      // for async components, name check should be based in its loaded
      // inner component if available
      const name = getComponentName(
        isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
      )

      const { include, exclude, max } = props

      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        current = vnode
        return rawVNode
      }

      const key = vnode.key == null ? comp : vnode.key
      const cachedVNode = cache.get(key)

      // clone vnode if it's reused because we are going to mutate it
      if (vnode.el) {
        vnode = cloneVNode(vnode)
        if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
          rawVNode.ssContent = vnode
        }
      }
      // #1513 it's possible for the returned vnode to be cloned due to attr
      // fallthrough or scopeId, so the vnode here may not be the final vnode
      // that is mounted. Instead of caching it directly, we store the pending
      // key and cache `instance.subTree` (the normalized vnode) in
      // beforeMount/beforeUpdate hooks.
      pendingCacheKey = key

      if (cachedVNode) {
        // copy over mounted state
        vnode.el = cachedVNode.el
        vnode.component = cachedVNode.component
        if (vnode.transition) {
          // recursively update transition hooks on subTree
          setTransitionHooks(vnode, vnode.transition)
        }
        // avoid vnode being mounted as fresh
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
        // make this key the freshest
        keys.delete(key)
        keys.add(key)
      } else {
        keys.add(key)
        // prune oldest entry
        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value)
        }
      }
      // avoid vnode being unmounted
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

      current = vnode
      return isSuspense(rawVNode.type) ? rawVNode : vnode
    }
  }
}

// if (__COMPAT__) {
//   KeepAliveImpl.__isBuildIn = true
// }

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const KeepAlive = KeepAliveImpl

function matches(pattern, name) {
  if (isArray(pattern)) {
    return pattern.some(p => matches(p, name))
  } else if (isString(pattern)) {
    return pattern.split(",").includes(name)
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function resetShapeFlag(vnode) {
  // bitwise operations to remove keep alive flags
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE
}

function getInnerChild(vnode) {
  return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent : vnode
}
