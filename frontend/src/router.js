import { createWebHistory, createRouter } from "vue-router";
import SignIn from "./components/SignIn.vue";
import Home from "./components/Home.vue";
import Overview from "./components/Overview.vue";
import CreateText from "./components/CreateText.vue";
import TextsList from "./components/TextsList.vue";
import Text from "./components/Text.vue";
import Continuation from "./components/Continuation.vue"

const routes = [

    {
        name: "home",
        path: "/:username/", 
        component: Home,
        props: true,
        meta: {requiresAuth: true},
        children: [
            {
                name: "overview",
                path: "",
                component: Overview,
                props: true,
            },
            {
                name: "create",
                path: "create",
                component: CreateText,
                props: true,
            },
            {
                name: "posts",
                path: "posts",
                component: TextsList,
                props: true,
            },
            {
                name: "post",
                path: "posts/:text_id",
                component: Text,
                props: true,
            },
            {
                name: "continuation",
                path: "posts/:text_id/:continuation_id",
                component: Continuation,
                props: true,
            }
        ]
    },
    {
        name: "signIn",
        path: "/",
        component: SignIn,
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {

    if (to.meta.requiresAuth) {
        console.log("From path: " + from.path);
        console.log("To path: " + to.path);

        console.log("Authenticated: " + localStorage.authenticated);
        
        if ( (to.path == "/"+localStorage.authenticated) || (to.path.startsWith("/" + localStorage.authenticated + "/")) ) {
            next();
        } else {
            console.log("Wrong path!");

            localStorage.removeItem('authenticated');
            localStorage.removeItem('language');
    
            next({
                name: "signIn"
            });
        }
    } else {
        next();
    }
})

export default router;