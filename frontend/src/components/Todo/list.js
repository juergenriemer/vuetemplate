import Todo from '@/services/TodosService'
import Filter from '@/mixins/Filter'

export default {
		name: 'TodoList'
		, mixins: [Filter]
		, data() {
				return {
						filterName : "todo"
						, items : []
				}
		}
		, methods: {
				onFilterChange(){
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
