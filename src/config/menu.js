export default [
  {
    text: 'RouterTab 구성',
    children: [
      { text: '기본 할당', to: '/default' },
      { text: '초기 표시 탭', to: '/initial-tabs' },
      { text: '복원 탭 새로 고침', to: '/restore' },
      { text: 'Iframe 탭', to: '/iframe' }
    ]
  },
  {
    text: '개인화',
    children: [
      { text: '전환 효과', to: '/transition' },
      { text: '슬롯', to: '/slot' },
      { text: '우클릭 메뉴', to: '/contextmenu' },
      { text: '드래그 앤 드롭 정렬 - 비활성화됨', to: '/dragsort' },
      { text: '새 탭 삽입 위치', to: '/append' },
      { text: '마지막 탭 닫기', to: '/close-last-tab' },
      { text: '스크롤 위치', to: '/page-scroller/' }
    ]
  },
  {
    text: '캐시 제어',
    children: [
      { text: '탭 규칙', to: '/default/rule' },
      { text: '탭 캐시 - 비활성화됨', to: '/default/no-cache' },
      { text: '최대 캐시 수', to: '/max-alive' },
      { text: '재사용 가능한 구성 요소', to: '/reuse' }
    ]
  },
  {
    text: '페이지 기능',
    children: [
      { text: '동적 탭 구성', to: '/default/tab-dynamic' },
      { text: '페이지 떠나기 확인', to: '/initial-tabs/page-leave' },
      { text: '중첩 경로', to: '/default/nest/1' }
    ]
  },
  {
    text: '다국어 지원',
    children: [
      { text: '탭 국제화', to: '/i18n' },
      { text: '컴포넌트 언어', to: '/lang-en' },
      { text: '구성 요소 사용자 정의 언어', to: '/lang-custom' }
    ]
  }
]
