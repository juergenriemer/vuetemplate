import Todo from '@/services/TodosService'

export default {
  name: 'TodoNew',
  data () {
    return {
      model : Todo.empty()
    }
  },
  methods: {
    async add() {
      await Todo.create({...this.model} )
      this.$router.push({ name: 'TodoIndex' })
    }
  }
}
