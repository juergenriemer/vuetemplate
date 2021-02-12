<template>
<div>
	<todo-list></todo-list>
		<hr>
	<todo-filter></todo-filter>
<hr>
	<post-list></post-list>
		<hr>
	<post-filter></post-filter>

</div>
</template>

<script>
import TodoList from '@/components/Todo/List'
import TodoFilter from '@/components/Todo/Filter'
import PostList from '@/components/Post/List'
import PostFilter from '@/components/Post/Filter'
export default {
  name: 'PostIndex'
,components : { PostList, PostFilter, TodoList, TodoFilter }
}
</script>
