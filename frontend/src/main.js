import Vue from 'vue'
import App from './App'
import router from './router'

const error = error =>{
				alert( error);
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
				el: '#app',
				router,
				components: { App },
				template: '<App/>'
})
