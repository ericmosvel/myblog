// import axios from 'axios';
import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      // los datos de la API son cargados aquí
      loadedPosts: [],
      token: null,
      tokenExpiration: null
    },
    mutations: {
      // cargo los datos de la API a 'state' a través de 'mutations'
      setPosts (state, posts) {
        state.loadedPosts = posts
      },
      addPost (state, post) {
        state.loadedPosts.push(post)
      },
      editPost (state, editedPost) {
        // necesito un id para poder apuntar al post correcto a remplazar
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        )
        state.loadedPosts[postIndex] = editedPost
      },
      setToken (state, token) {
        state.token = token
      },
      clearToken (state) {
        state.token = null
      }
    },
    actions: {
      // en 'actions' hago el API request asincronico
      nuxtServerInit (vuexContext, context) {
        // usando variables de entorno 'process.env.baseURL'
        return context.app.$axios.$get('/posts.json')
          .then(data => {
            // convertirmos el obj recibido de firebase a una matriz 'array'
            // nuestro modelo solo recibe arrays
            const postsArray = []
            for (const key in data) {
              postsArray.push({ ...data[key], id: key })
            }
            vuexContext.commit('setPosts', postsArray)
          })
          .catch(e => context.error(e))
      },
      addPost (vuexContext, post) {
        // recibimos el contenido de nu nuevo post de new-post y agregamos manualmente la fecha
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        // apuntamos al servidor y posteamos el contenido del post creado recientemente
        return this.$axios.$post('https://nuxtjs-54a9b.firebaseio.com/posts.json?auth=' + vuexContext.state.token, createdPost)
          .then(data => {
          // apuntamos a la mutacion 'addpost' y adjuntamos el contenido del nuevo post y id manual
            vuexContext.commit('addPost', { ...createdPost, id: data.name })
          })
          .catch(error => console.log(error))
      },
      editPost (vuexContext, editedPost) {
        // apuntamos al servidor usando la id dinamica de cada post y enviamos el contenido editado
        return this.$axios.$put('https://nuxtjs-54a9b.firebaseio.com/posts/' +
        editedPost.id + '.json?auth=' + vuexContext.state.token, editedPost)
          .then(res => {
          // apuntamos a la mutacion 'editPost' y enviamos el contenido
            vuexContext.commit('editPost', editedPost)
          })
          .catch(e => console.log(e))
      },
      setPosts (vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      authenticateUser (vuexContext, authData) {
        // inicia sesion como usuario previamente registrado
        let authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        process.env.fbAPIKey
        if (!authData.isLogin) {
          // registra como nuevo usuario
          authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          process.env.fbAPIKey
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            // una vez obtengamos una respuesta exitosa
            // llamo a la mutacion 'setToken' a través del commit y le paso el resultado
            // de la solicitud, la cual envia 'idToken' como respuesta a la autenticacion.
            // de esta forma guardo el token en el store.
            vuexContext.commit('setToken', result.idToken)
            // con la funcion setItem asignamos en el localstore el resultado de idToken
            localStorage.setItem('token', result.idToken)
            // guardamos en el localstore el tiempo restante en el futuro q falta para expirar el idtoken
            localStorage.setItem(
              'tokenExpiration',
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000)

            // almacenamos valores tambien en las cookies
            Cookie.set('jwt', result.idToken)
            Cookie.set(
              'expirationDate',
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000)

            // Dispatch llama funciones dentro de actions, al action 'setLogoutTimer'
            // alarga el tiempo de expiracion multiplicandolo por '1000'
            vuexContext.dispatch('setLogoutTimer', result.expiresIn * 1000)
            return this.$axios.$post('http://localhost:3000/api/track-data', {data: 'Authenticated!'})
          })
          .catch(e => console.log(e))
      },
      setLogoutTimer (vuexContext, duration) {
        setTimeout(() => {
          // el commit llama funciones q están dentro de 'mutation'
          vuexContext.commit('clearToken')
        }, duration)
      },
      initAuth (vuexContext, req) {
        let token 
        let expirationDate
        let jwtCookie

        // implementacion de cookies para recordar usuario administrador
        if (req) {
          if (!req.headers.cookie) {
            return
          }
          jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='))

          if (!jwtCookie) {
            return
          }
          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1]
        } else {
          // la funcion getitem permite obtener un valor dentro del localstore.
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')          
        }
        // console.log(new Date().getTime(), +expirationDate)
        if (new Date().getTime() > +expirationDate || !token) {
          console.log('No token or valid token')
          // llama al metodo logout para validar si el token ha sido borrado
          vuexContext.dispatch('logout')
          // vuexContext.commit('clearToken')
          return
        }
        // ----------------------------------------------
        // el + en expirationDate, convierte esta constante en un numero
        // vuexContext.dispatch('setLogutTimer', +expirationDate - new Date().getTime())
        vuexContext.commit('setToken', token)
      },
      logout (vuexContext) {
        vuexContext.commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('expirationDate')
        // verifica la variable de entorno del cliente
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }
      }
    },
    getters: {
      // el getter ayuda a comunicarme con los componentes para q hagan uso de la API REST
      loadedPosts (state) {
        return state.loadedPosts
      },
      isAuthenticated (state) {
        return state.token != null
      }
    }
  })
}

export default createStore
