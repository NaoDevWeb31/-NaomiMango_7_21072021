import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Account from '../views/Account.vue'
import Profile from '../views/Profile.vue'
import Forum from '../views/Forum.vue'
import NewPost from '../views/NewPost.vue'
import OnePost from '../views/OnePost.vue'
import OneUserPosts from '../views/OneUserPosts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/account/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/account/forum',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/account/forum/create-post',
    name: 'NewPost',
    component: NewPost
  },
  {
    path: '/account/forum/posts/user',
    name: 'OneUserPosts',
    component: OneUserPosts
  },
  {
    path: '/account/forum/posts/:id',
    name: 'OnePost',
    component: OnePost
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
