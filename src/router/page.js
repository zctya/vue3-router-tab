import { importPage } from '../utils'

// 页面路由
export default () => [
  {
    path: 'page/:id',
    component: importPage('Page'),
    meta: {
      title: route => `페이지${route.params.id}`,
      icon: 'rt-icon-doc',
      key: 'path'
    }
  },
  {
    path: 'no-cache',
    redirect: 'no-cache/1'
  },
  {
    path: 'no-cache/:id',
    component: importPage('Page'),
    meta: {
      title: route => `캐시 페이지 없음${route.params.id}`,
      keepAlive: false,
      icon: 'rt-icon-doc',
      key: 'path'
    }
  },
  {
    path: 'rule',
    redirect: 'rule/default/a/1'
  },
  {
    path: 'rule/default',
    redirect: 'rule/default/a/1'
  },
  {
    path: 'rule/default/:catalog/:type',
    component: importPage('Rule'),
    meta: {
      title: route => `규칙:기본값-${route.params.catalog}/${route.params.type}`,
      icon: 'rt-icon-log'
    }
  },
  {
    path: 'rule/path',
    redirect: 'rule/path/a/1'
  },
  {
    path: 'rule/path/:catalog/:type',
    component: importPage('Rule'),
    meta: {
      title: route => `규칙:path-${route.params.catalog}/${route.params.type}`,
      icon: 'rt-icon-log',
      key: 'path'
    }
  },
  {
    path: 'rule/fullPath',
    redirect: 'rule/fullPath/a/1'
  },
  {
    path: 'rule/fullPath/:catalog/:type',
    component: importPage('Rule'),
    meta: {
      title: route =>
        `규칙:fullPath-${route.params.catalog}/${route.params.type}`,
      icon: 'rt-icon-log',
      key: 'fullPath'
    }
  },
  {
    path: 'rule/custom',
    redirect: 'rule/custom/a/1'
  },
  {
    path: 'rule/custom/:catalog/:type',
    component: importPage('Rule'),
    meta: {
      title: route =>
        `규칙:맞춤화-${route.params.catalog}/${route.params.type}`,
      icon: 'rt-icon-log',
      key: route => '/rule/custom/' + route.params.catalog
    }
  },
  {
    path: 'tab-dynamic',
    component: importPage('TabDynamic'),
    meta: {
      title: '동적 탭',
      icon: 'rt-icon-log'
    }
  },
  {
    path: 'page-leave',
    component: importPage('PageLeave'),
    meta: {
      title: '페이지 떠나기 확인',
      icon: 'rt-icon-contact'
    }
  },
  {
    path: 'nest/:nestId',
    component: importPage('Nest'),
    redirect(route) {
      return route.fullPath + '/page1'
    },
    meta: {
      title: '중첩 경로',
      icon: 'rt-icon-doc'
    },
    children: [
      {
        path: 'page1',
        component: importPage('Page1')
      },
      {
        path: 'page2',
        component: importPage('Page2')
      }
    ]
  }
]
