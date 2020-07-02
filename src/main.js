import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

if (!localStorage.seed) {
    localStorage.seed = `${+new Date()}.${Math.random() * 313370666 ^ 0}6`
}

if (!localStorage.offline) {
    localStorage.offline = '{}'
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js');
}


createApp(App).mount('#app')
