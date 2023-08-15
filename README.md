<h2 align="center">Vue Router Tab for Vue 3.0+ and VueRouter 4.0+</h2>

Vue.js tab components for Vue 3.0+ and VueRouter 4.0+, based on Vue Router.

Migration to Vue 3 of https://bhuh12.github.io/vue-router-tab/


## Remain Issue: Different Routes with Same Component
If you define one component in another route, those routes will cache the same component.  
When one tab is closed, the route's component is removed from the cache and other routes are initialized.

This is an issue that occurred when the latest version of `Vue Router` strengthened access management for component caching,  
and is considered an issue that cannot be resolved at this point.

<u>**DO NOT define the same component in different routes!**</u>

## License

[MIT](http://opensource.org/licenses/MIT)
