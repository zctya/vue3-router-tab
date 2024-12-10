// Loading page components asynchronously
export const importPage = view => () => import(/* @vite-ignore */ '../views/' + view + '.vue')
