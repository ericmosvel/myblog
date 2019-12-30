/*
Los archivos de injeccion llamados plugins sirven para injectar
codigo con ciertas funcionalidades a lo largo de todos los componentes
De esta manera se evita escribir tanto código y usar de manera
centralizada las instrucciones
*ejemplo; los botones de 'save' o 'cancel'
*/


import Vue from 'vue'

// componentes q controlan pequeñas funcionalidades
import AppButton from '@/components/UI/AppButton'
import AppControlInput from '@/components/UI/AppControlInput'
import PostList from '@/components/Posts/PostList'

// llamo a los componentes q previamente importé
Vue.component('AppButton', AppButton)
Vue.component('AppControlInput', AppControlInput)
Vue.component('PostList', PostList)