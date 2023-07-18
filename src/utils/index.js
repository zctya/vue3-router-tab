// 异步加载页面组件
export const importPage = view => () => import(/* @vite-ignore */'../views/' + view + '.vue')
