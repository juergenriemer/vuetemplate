import Todo from '@/services/TodosService'
import Filter from '@/mixins/Filter'

export default {
		name: 'TodoList'
		, mixins: [Filter]
		, data() {
				return {
						filterName : "todo"
		,xxx: 'TodoList'
						, items : []
				}
		}
		, methods: {
				onFilterChange(){
						console.log( this.filter );
						this.fetch();	
				}
				, async fetch() {
						let model = Todo.model();
						let request = this.requestFilter( model );
						const response = await Todo.list( ...request );
						this.items = response.data.items;
				}
				, async deleteTodo(id) {
						await Todo.delete(id);
						this.fetch();
				}
		}
}
