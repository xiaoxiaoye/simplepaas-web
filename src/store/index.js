import Vue from 'vue'
import Vuex from 'vuex'
import {getToken, setToken} from "@/utils/auth";
import {postRequest} from "@/utils/apis";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: getToken()
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        }
    },
    actions: {
        Login({commit}, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            return new Promise((resolve, reject) => {
                postRequest('/token?username=' + username + '&password=' + password, null)
                    .then((response) => {
                        console.log("get token "+response)
                        const tokenStr = response
                        setToken(tokenStr)
                        commit('SET_TOKEN', tokenStr)
                        resolve()
                    }).catch(error => {
                    reject(error)
                })
            })
        }
    },
    getters: {
        token: state => {
            return state.token
        }
    },
    modules: {}
})
