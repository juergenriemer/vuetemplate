import Model from '@/services/TodoItemsService'
import Filter from '@/mixins/Filter'
import { mapGetters, mapActions } from 'vuex';

export default {
		name: 'TodoItemList'
		, mixins: [Filter]
		, data() {
				return {
						filterName : "todoitem"
						, filter : {
								query : {}	
						}
						, items : []
						, idEdit : null
				}
		}
		, created() {
				this.fetch();
		}
		, computed: 
				mapGetters(["allTodos"])
		, methods: {
				...mapActions(["filterTodos","deleteTodo","updateTodo"])
				, onFilterChange(){
						this.fetch();	
				}
				, async fetch() {
						let model = Model.model();
						let request = this.requestFilter( model );
						this.filterTodos(request);
				}
				, remove( id ) {
						this.deleteTodo( id );
				}
				, async edit( data ) {
						let result = await this.updateTodo( data );
						result && ( this.idEdit = null );
				}
				, async done(item) {
						console.log( item.done );
						item.done = ! item.done;
						console.warn( item.done );
						let result = await this.updateTodo( item );
				}
		}
}
