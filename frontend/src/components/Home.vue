<template>
    <header class="p-3 mb-3 border-bottom">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <a class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                    <img center class="logo me-2" src="../assets/book.svg" alt="" width="40" height="32">
                </a>

                <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li><router-link class="nav-link px-2 link-dark" :to="{ name: 'overview', params: { username: this.username}}">{{ this.username }}</router-link></li>
                    <li><router-link class="nav-link px-2 link-dark" :to="{ name: 'posts', params: { username: this.username}}">{{ $t("Home.Posts") }}</router-link></li>
                    <li><router-link class="nav-link px-2 link-dark" :to="{ name: 'create', params: { username: this.username}}">{{ $t("Home.Create") }}</router-link></li>                 
                </ul>

                <div class="dropdown text-end">
                    <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="../assets/user.svg" alt="mdo" width="32" height="32" class="rounded-circle">
                        <i class="bi bi-person-circle"></i>
                    </a>
                    <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser">
                        <li><router-link class="dropdown-item" :to="{ name: 'create', params: { username: this.username}}">{{ $t("Home.NewPost") }}</router-link></li>
                        <li>
                            <div class="dropdown-item">
                                <label>{{ $t("Home.Language") }}:</label>
                                <select v-model="locale" @change="changeLanguage">
                                    <option value="en">en</option>
                                    <option value="cat">cat</option>
                                    <option value="es">es</option>
                                </select>     
                            </div>
                        </li>
                        <!--<li><a class="dropdown-item" href="#">Profile</a></li>-->
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" v-on:click=signOut style="cursor: pointer;">{{ $t("Home.SignOut") }}</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <!-- Button trigger modal Delete -->
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#DeleteUser" style="cursor: pointer;">{{ $t("Home.DeleteAccount") }}</a></li>
                    </ul>

                    <!-- Modal Delete -->
                    <div class="modal fade" id="DeleteUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-keyboard="false">
                        <div class="modal-dialog">
                        <div class="modal-content">
                            <notification v-bind:notifications="listNotifications"></notification>
                            <form v-on:submit.prevent="deleteUser">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">{{ $t("Home.DeleteAccount") }}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click=this.listNotifications.pop()></button>
                                </div>
                                <div class="modal-body">

                                    <p class="text-start">{{ $t("Home.ConfirmDelete") }}</p>

                                    <div class="form-floating">
                                        <input type="password" class="form-control" id="floatingCreatePassword" placeholder="Password" required v-model="password">
                                        <label for="floatingCreatePassword">{{ $t("Home.Password") }}</label>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click=this.listNotifications.pop()>{{ $t("Home.No") }}</button>
                                    <button class="btn btn-danger">{{ $t("Home.Delete") }}</button>
                                </div>
                            </form>
                        </div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <div>
        <router-view :key="$route.path"/>
    </div>
</template>

<script>
import http from "./http-common.js";
import router from "../router.js";
import Notification from "./Notifications.vue";
import { Modal } from 'bootstrap';
import { useI18n } from "vue-i18n";

export default {

    data() {
        return {
            password: "",
            listNotifications: [],
        };
    },
    
    setup() {
        const { locale } = useI18n()
        return { locale }
    },

    mounted() {
        this.locale = localStorage.language;
    },

    methods: {

        signOut() {
            localStorage.removeItem("authenticated");
            localStorage.removeItem("language");

            router.push({name: "signIn"});
        },

        changeLanguage() {
            localStorage.setItem("language", this.locale);
        },

        deleteUser() {

            this.listNotifications.pop();

            http.get("/user/signIn/" + this.username + "/" + this.password)
                .then(res => {

                    if (this.username == res.data) {

                        http.delete("/user/" + this.username )
                            .then(res => {
                                console.log(res.data);
                                console.log("USER ESBORRAT!");
                                    
                                var modalElement = document.getElementById("DeleteUser");
                                var modal = Modal.getInstance(modalElement);
                                modal.hide();

                                this.signOut();

                            }).catch(err => {
                                console.log(err);
                            });
                    
                    } else {

                        this.listNotifications.push({
                            type: "danger",
                            message: this.$t("Home.ErrorPassword")
                        });

                    }

                }).catch(err => {
                    console.log(err);
                });

        }

    },
    
    components: {
        'notification': Notification
    },

    props: ["username", "text_id", "continuation_id"],

};

</script>