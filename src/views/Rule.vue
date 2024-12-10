<template>
  <div>
    <h2>Tab rules</h2>

    <p>By configuring routing meta information <code>meta.key</code> to set tab rules</p>

    <page-timer />

    <table class="demo-table">
      <thead>
        <tr>
          <th>rule</th>
          <th>configuration</th>
          <th>description</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in rules"
          :key="item.id"
          :class="{ on: curRole === item.id }"
          :style="{ cursor: curRole === item.id ? 'default' : 'pointer' }"
          title="Click to switch current rules"
          @click="curRole !== item.id && $tabs.reset(`../../${item.id}`)"
        >
          <td>{{ item.label }}</td>
          <td>
            <code v-if="item.value">{{ item.value }}</code>
          </td>
          <td>{{ item.desc }}</td>
        </tr>
      </tbody>
    </table>

    <h4>After selecting the rule, click the link below and observe the changes in the tab</h4>

    <ul class="btn-list">
      <li
        v-for="cat in catalogs"
        :key="cat"
      >
        <router-link
          v-for="t in types"
          :key="t"
          class="demo-btn link"
          :to="`../${cat}/${t}`"
        >
          {{ cat }}/{{ t }}
        </router-link>

        <router-link
          class="demo-btn link"
          :to="`../${cat}/1?q=abc`"
        >
          {{ cat }}/1?q=abc
        </router-link>

        <router-link
          class="demo-btn link"
          :to="`../${cat}/1?q=def`"
        >
          {{ cat }}/1?q=def
        </router-link>
      </li>
    </ul>

    <h3>Routing information</h3>

    <page-route-info />
  </div>
</template>

<script>
  import PageTimer from '../components/PageTimer.vue'
  import PageRouteInfo from '../components/PageRouteInfo.vue'

  export default {
    name: 'Rule',

    components: { PageTimer, PageRouteInfo },

    data() {
      let route = this.$route
      let { catalog, type } = route.params

      return {
        rules: [
          {
            id: 'default',
            label: 'default',
            value: '',
            desc: 'The same route shares the same tab'
          },
          {
            id: 'path',
            label: 'path',
            value: 'path',
            desc: 'Routes with the same route.params share tabs'
          },
          {
            id: 'fullPath',
            label: 'fullPath',
            value: 'fullPath',
            desc: 'Routes with the same route.params and route.query share tabs'
          },
          {
            id: 'custom',
            label: 'customize',
            value: "route => 'route-rule/' + route.params.catalog",
            desc: 'Routes with the same catalog parameters share tabs'
          }
        ],

        curRole: /\/rule\/([^/]+)\//.exec(route.path)[1],
        catalog,
        type,
        catalogs: ['a', 'b', 'c'],
        types: [1, 2],
        link: { catalog, type }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rule-fn {
    color: $color;
    font-size: 1rem;
    font-style: italic;
  }

  .btn-list {
    padding: 0;

    li {
      list-style: none;

      .demo-btn {
        margin-right: 0.5em;
      }
    }
  }
</style>
