export default [
  {
    text: 'RouterTab Configuration',
    children: [
      { text: 'Default configuration', to: '/default' },
      { text: 'Initial tabs', to: '/initial-tabs' },
      { text: 'Refresh the restore tab', to: '/restore' },
      { text: 'Iframe tab', to: '/iframe' }
    ]
  },
  {
    text: 'Personalization',
    children: [
      { text: 'Transition effect', to: '/transition' },
      { text: 'Slot', to: '/slot' },
      { text: 'Context menu', to: '/contextmenu' },
      { text: 'Drag Sort - disable', to: '/dragsort' },
      { text: 'Insertion position for new tab', to: '/append' },
      { text: 'Close last tab', to: '/close-last-tab' },
      { text: 'Scroll position', to: '/page-scroller/' }
    ]
  },
  {
    text: 'Cache control',
    children: [
      { text: 'Tab Rules', to: '/default/rule' },
      { text: 'Tab caching - disable', to: '/default/no-cache' },
      { text: 'Maximum number of caches', to: '/max-alive' },
      { text: 'Reuse components', to: '/reuse' }
    ]
  },
  {
    text: 'Page function',
    children: [
      { text: 'Dynamic tab configuration', to: '/default/tab-dynamic' },
      { text: 'Confirmation of leaving the page', to: '/initial-tabs/page-leave' },
      { text: 'Nested routes', to: '/default/nest/1' }
    ]
  },
  {
    text: 'Multilingual support',
    children: [
      { text: 'Tab internationalization', to: '/i18n' },
      { text: 'Component language', to: '/lang-en' },
      { text: 'Component custom language', to: '/lang-custom' }
    ]
  }
]
