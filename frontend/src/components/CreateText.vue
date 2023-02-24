<template>
    <div class="container">
        <main>
            <div class="py-5 text-center">
                <h2>{{ $t("Create.PageTitle") }}</h2>
                <p class="lead">{{ $t("Create.PageSubtitle") }}</p>
            </div>

            <div class="row g-5">
                <h4 class="mb-3">{{ $t("Create.YourPost") }}:</h4>
                <form v-on:submit.prevent="confirmPublication">
                <div class="row g-3">

                    <div class="col-sm-6">
                        <label for="username" class="form-label">{{ $t("Create.Username") }}</label>
                        <input type="text" class="form-control" id="username" :value=username disabled>
                    </div>

                    <div class="col-sm-6">
                        <label for="title" class="form-label">{{ $t("Create.Title") }}</label>
                        <input type="text" class="form-control" id="title" :placeholder="$t('Create.AddTitle')" required v-model="text.title">
                    </div>

                    <div class="col-sm-5">
                        <label for="genre" class="form-label">{{ $t("Create.Genre") }}</label>
                        <select class="form-select" id="genre" required v-model="text.genre">
                            <option value="">{{ $t("Create.Choose") }}</option>
                            <option value="prose">{{ $t("Create.Prose") }}</option>
                            <option value="poetry">{{ $t("Create.Poetry") }}</option>
                            <option value="drama">{{ $t("Create.Drama") }}</option>
                        </select>
                    </div>


                    <div class="col-sm-4">
                        <label for="theme" class="form-label">{{ $t("Create.Theme") }}</label>
                        <input type="text" class="form-control" id="theme" :placeholder="$t('Create.AddTheme')" required v-model="text.theme">
                    </div>

                    <div class="col-sm-3">
                        <label for="language" class="form-label">{{ $t("Create.Language") }}</label>
                        <select class="form-select" id="language" required v-model="text.language">
                            <option value="">{{ $t("Create.Choose") }}</option>
                            <option value="catalan">{{ $t("Create.Catalan") }}</option>
                            <option value="spanish">{{ $t("Create.Spanish") }}</option>
                            <option value="english">{{ $t("Create.English") }}</option>
                        </select>
                    </div>

                    <hr>

                    <div>
                        <input type="checkbox" class="form-check-input" id="original-work" v-on:click=checkOriginalWork>
                        <label class="form-check-label" for="original-work">{{ $t("Create.OriginalWork") }}</label>
                    </div>

                    <div class="col-sm-6">
                        <label for="original-author" class="form-label">{{ $t("Create.OriginalAuthor") }}</label>
                        <input type="text" class="form-control" id="original-author" :placeholder="$t('Create.AddOriginalAuthor')" disabled required v-model="text.originalAuthor">
                    </div>

                    <div class="col-sm-6">
                        <label for="original-title" class="form-label">{{ $t("Create.OriginalTitle") }}</label>
                        <input type="text" class="form-control" id="original-title" :placeholder="$t('Create.AddOriginalTitle')" disabled required v-model="text.originalTitle">
                    </div>

                    <hr>

                    <div class="input-group">
                        <textarea class="form-control" rows="30" required v-model="text.text"></textarea>
                    </div>
                    
                    <hr class="my-4">

                </div>

                <button class="w-100 btn btn-primary btn-lg">{{ $t("Create.Publish") }}</button>
                <notification v-bind:notifications="listNotifications"></notification>

                </form>

            </div>
        </main>
    </div>
</template>

<script>
import http from "./http-common.js";
import Notification from "./Notifications.vue";

export default {
    
    data() {
        return {
            text: {
                username: this.username,
                title: "",
                originalAuthor: "",
                originalTitle: "",
                genre: "",
                theme: "",
                language: "",
                text: ""
            },
            listNotifications: []
        };
    },

    methods: {

        createPublication() {

            var data = {
                username: this.text.username,
                title: this.text.title,
                originalAuthor: this.text.originalAuthor,
                originalTitle: this.text.originalTitle,
                genre: this.text.genre,
                theme: this.text.theme,
                language: this.text.language,
                text: this.text.text
            }

            http.post("/text", data)
                .then(res => {
                    console.log(res.data);

                    this.listNotifications.push({
                        type: "info",
                        message: this.$t("Create.InfoPublished")
                    });
                
                }).catch(err => {
                    console.log(err);
                });

        },

        confirmPublication() {

            this.listNotifications.pop();

            http.get("/text/" + this.text.username + "/" + this.text.title)
            .then(res => {
                
                if (typeof res.data.title != "undefined") {
                    this.listNotifications.push({
                        type: "warning",
                        message: this.$t("Create.WarningSameTitle")
                    });

                } else {
                    this.createPublication();
                }

            }).catch(err => {
                console.log(err);
            });

        },

        checkOriginalWork() {
            var checker = document.getElementById("original-work");
            var inputAuthor = document.getElementById("original-author");
            var inputTitle = document.getElementById("original-title");

            if (checker.checked) {
                console.log("checker seleccionat");
                
                inputAuthor.disabled = false;
                inputTitle.disabled = false;

            } else {
                console.log("checker desactivat");

                inputAuthor.disabled = true;
                inputTitle.disabled = true;
            }

        }

    },

    components: {
        'notification': Notification
    },

    props: ['username']

};

</script>