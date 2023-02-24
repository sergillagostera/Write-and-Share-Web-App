import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { createI18n } from "vue-i18n";
import messages from '@intlify/unplugin-vue-i18n/messages';

const i18n = new createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    availableLocales: ["en", "cat", "es"],
    messages: messages
})

createApp(App).use(router).use(i18n).mount("#app");