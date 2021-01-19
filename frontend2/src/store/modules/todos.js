import Model from "@/services/TodoItemsService";
import axios from "axios";

const state = {
  todos: []
};

const getters = {
  allTodos: state => {
    return state.todos;
  }
};

const actions = {
  async getTodos({ commit }) {
    //const response = await axios.get('https:jsonplaceholder.typicode.com/todos');
    //const response = await Model.get('https:jsonplaceholder.typicode.com/todos');
    //commit('setTodos', response.data);
  },

  async deleteTodo({ commit }, id) {
    const response = await Model.delete(id);
    commit("removeTodo", id);
  },

  async updateTodo({ commit }, data) {
    const response = await Model.update(data);
    commit("updateTodo", response.data);
    return true;
  },

  async addTodo({ commit }, data) {
    const response = await Model.create(data);
    commit("addTodo", response.data);
  },

  async listTodos({ commit }) {
    const res = await Model.list();
    if (res && res.data) {
      commit("setTodos", res.data);
    }
  },

  async filterTodos({ commit }, params) {
    const response = await Model.list(...params);
    commit("setTodos", response.data);
  }
};

const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  removeTodo: (state, id) =>
    (state.todos = state.todos.filter(todo => todo.id !== id)),
  updateTodo: (state, item) => {
    console.warn(item);
    const index = state.todos.findIndex(todo => {
      console.log(todo);
      return todo._id == item._id;
    });
    if (index !== -1) {
      state.todos.splice(index, 1, item);
    }
  },
  addTodo: (state, newTodo) => state.todos.unshift(newTodo)
};

export default {
  state,
  getters,
  actions,
  mutations
};
