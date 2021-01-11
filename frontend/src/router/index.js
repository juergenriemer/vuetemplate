import Vue from 'vue'
import Router from 'vue-router'
import PostIndex from '@/components/Post/Index'
import PostSearch from '@/components/Post/Search'
import PostNew from '@/components/Post/New'
import PostEdit from '@/components/Post/Edit'
import TodoNew from '@/components/Todo/New'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
		// NB: browser back/forward not triggering when console is open!
		routes: [
				{ path: '/', redirect: '/post_search' },
				{
						path: '/post_index',
						name: 'PostIndex',
						component: PostIndex
				},
				{
						path: '/post_search',
						name: 'PostSearch',
						component: PostSearch
				},
				{
						path: '/todo_new',
						name: 'TodoNew',
						component: TodoNew
				},
				{
						path: '/post_new',
						name: 'PostNew',
						component: PostNew
				},
				{
						path: '/post/:id',
						name: 'PostEdit',
						component: PostEdit
				}
				,{
						path: '/xxx',
						name: 'xxx',
						component:HelloWorld
				}
		]
})
