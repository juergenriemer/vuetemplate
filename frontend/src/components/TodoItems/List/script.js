import Model from '@/services/TodosService'
import Filter from '@/mixins/Filter'

export default {
		name: 'TodoItemList'
		, mixins: [Filter]
		, data() {
				return {
						filterName : "todo"
						, filter : {
							query : {}	
						}
						, items : []
				}
		}
		, methods: {
				onFilterChange(){
						this.fetch();	
				}
				, async fetch() {
						let model = Model.model();
						let request = this.requestFilter( model );
						const response = await Model.list( ...request );
						this.items = response.data.items;
				}
				, async remove(id) {
						await Model.delete(id);
						this.fetch();
				}
				, async edit(id) {
						await Model.delete(id);
						this.fetch();
				}
				, async done(id) {
						await Model.delete(id);
						this.fetch();
				}
		}
}
