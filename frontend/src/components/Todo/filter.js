import Todo from '@/services/TodosService'
import Filter from '@/mixins/Filter'

export default {
		name: 'TodoFilter'
		, mixins: [Filter]
		, created() {
		}
		, data () {
				return {
						filterName : "todo"
						, xxx : "TodoFilter"
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
						}
				}
		}
		, methods : {
				submit(){
						this.updateFilter();
				}
		}
}
