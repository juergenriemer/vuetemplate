import Model from '@/services/TodoItemsService'
import axios from 'axios';

const state = {
		todos: []
};

const getters = {
		allTodos: (state) => {
				return state.todos.items;
		}
};

const actions = {
		async getTodos({ commit }) {
				//const response = await axios.get('https:jsonplaceholder.typicode.com/todos');
				//const response = await Model.get('https:jsonplaceholder.typicode.com/todos');
				//commit('setTodos', response.data);
		},

		async deleteTodo({ commit }, id) {
				const response = await Model.delete( id );
				commit('removeTodo', id);
		},

		async updateTodo({ commit }, data) {
				const response = await Model.update( data );
				commit('updateTodo', response.data.item);
				return true;
				
		},

		async addTodo({commit}, data ){
				const response = await Model.create( data );
				commit('addTodo',response.data)
		},

		async filterTodos({ commit }, params ) {
				const response = await Model.list( ...params );
				commit('setTodos', response.data );
		}
}

const mutations = {
		setTodos: (state, todos) => (state.todos = todos),
		removeTodo:(state,id) => state.todos.items = state.todos.items.filter((todo) => todo.id !== id),
		updateTodo: (state, item) => {
				const index = state.todos.items.findIndex(todo => todo.id == item._id);
				if (index !== -1) {
						state.todos.items.splice(index, 1, item);
				}
		},
		addTodo:(state,newTodo) => state.todos.items.unshift(newTodo)
};


export default {
		state,
		getters,
		actions,
		mutations
};
