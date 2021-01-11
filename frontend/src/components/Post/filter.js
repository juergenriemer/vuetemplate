import Post from '@/services/PostsService'
import Filter from '@/mixins/Filter'

export default {
		name: 'PostFilter'
		, mixins: [Filter]
		, data () {
				return {
						filterName : "post"
		, xxx: 'PostFilter'
						, xxfilter : {
								query : {
										title : "as"	
									}
								, sort : {
										field : "title" 
										, dir : 1
								} 
								, slice : {
										skip : 0
										, limit : 3
								}
						}
						, filter : {
								query : {
										title : "as"	
									}
								, slice : {
										skip : 0
										, limit : 3
								}
						}
				}
		}
		, methods : {
				submit(){
						this.updateFilter();
				}
		}
}
