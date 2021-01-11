import Post from '@/services/PostsService'
import Filter from '@/mixins/Filter'

export default {
		name: 'PostList'
		, mixins: [Filter]
		, data() {
				return {
						filterName : "post"
						, items : []
				}
		}
		, methods: {
				onFilterChange(){
						this.fetch();	
				}
				, async fetch() {
						let model = Post.model();
						let request = this.requestFilter( model );
						const response = await Post.list( ...request );
						this.items = response.data.items;
				}
				, async deletePost(id) {
						await Post.delete(id);
						this.fetch();
				}
		}
}
