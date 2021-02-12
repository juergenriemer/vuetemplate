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
						, filter : {
								query : {}
								, sort : {
										field : "title" 
										, dir : 1
								} 
								, slice : {
										skip : 0
										, limit : 6
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
