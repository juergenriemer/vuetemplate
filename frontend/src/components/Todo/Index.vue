<template>
<div>
	<post-list></post-list>
		<hr>
	<post-filter></post-filter>

</div>
</template>

<script>
import PostList from '@/components/Post/List'
import PostFilter from '@/components/Post/Filter'
export default {
  name: 'PostIndex'
,components : { PostList, PostFilter}
}
</script>
