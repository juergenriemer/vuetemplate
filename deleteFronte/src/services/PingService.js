import Api from '@/services/Api'

export default {
  ping () {
    return Api().get('ping')
  }
}
