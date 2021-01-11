import REST from '@/services/RESTService'
class Post extends REST {
  create( params ){
    params.title += "";
    super.create( params )
  }
}
export default new Post( "Post");
