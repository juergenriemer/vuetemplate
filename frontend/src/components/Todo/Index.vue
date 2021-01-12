<template>
<div>
	<todo-list></todo-list>
		<hr>
	<todo-filter></todo-filter>

</div>
</template>

<script>
import TodoList from '@/components/Todo/List'
import TodoFilter from '@/components/Todo/Filter'
export default {
  name: 'TodoIndex'
,components : { TodoList, TodoFilter}
}
</script>
