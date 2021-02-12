import REST from '@/services/RESTService'
class Todo extends REST {
  create( params ){
    params.title += "";
    super.create( params )
  }
}
export default new Todo( "Todo");
