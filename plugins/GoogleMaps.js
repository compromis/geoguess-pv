import Vue from 'vue'
import * as GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  load: {
    key: process.env.NUXT_ENV_GOOGLE_MAPS_KEY,
    region: 'ES',
    language: 'ca'
  },
  installComponents: true
})
