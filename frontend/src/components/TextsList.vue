<template>

    <div class="container">
        
        <header class="p-3 mb-3 border-bottom">
            <div class="row">

                <div class="col-sm-3">
                    <h3>{{ $t("TextL.Posts") }}:</h3>
                </div>

                <div class="col-sm-2">
                    <select class="form-select" id="categorya" v-model="language" @change="searchPosts">
                        <option value="null">{{ $t("TextL.AllLanguages") }}</option>
                        <option value="english">{{ $t("TextL.english") }}</option>
                        <option value="catalan">{{ $t("TextL.catalan") }}</option>
                        <option value="spanish">{{ $t("TextL.spanish") }}</option>
                    </select>
                </div>

                <div class="col-sm-2">
                    <select class="form-select" id="category" v-model="genre" @change="searchPosts">
                        <option value="null">{{ $t("TextL.AllGenres") }}</option>
                        <option value="prose">{{ $t("TextL.prose") }}</option>
                        <option value="poetry">{{ $t("TextL.poetry") }}</option>
                        <option value="drama">{{ $t("TextL.drama") }}</option>
                    </select>
                </div>

                <div class="col-sm-2">
                    <select class="form-select" id="genre" v-model="order" @change="searchPosts">
                        <option value="null">{{ $t("TextL.OrderBy") }}</option>
                        <option value="newest">{{ $t("TextL.Newest") }}</option>
                        <option value="oldest">{{ $t("TextL.Oldest") }}</option>
                        <option value="contributions">{{ $t("TextL.Contributions") }}</option>
                    </select>
                </div>

                <div class="col-sm-3">
                    <form class="form">    
                        <input class="form-control" type="search" v-model="search" v-on:keyup="searchPosts" @keydown.enter.prevent :placeholder="$t('TextL.Search')">    
                    </form>
                </div>

            </div>
    
        </header>
        
        <main>
            <div id="all-products">
                
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <td>{{ $t("TextL.Username") }}</td>
                        <td>{{ $t("TextL.Title") }}</td>
                        <td>{{ $t("TextL.Genre") }}</td>
                        <td>{{ $t("TextL.Theme") }}</td>
                        <td>{{ $t("TextL.OriginalAuthor") }}</td>
                        <td>{{ $t("TextL.OriginalTitle") }}</td>
                        <td>{{ $t("TextL.Language") }}</td>
                    </tr>
                    </thead>

                    <tbody>
                        <tr v-for="post in posts">
                            <td>{{ post.username }}</td>
                            <td>{{ post.title }}</td>
                            <td>{{ $t("TextL." + post.genre) }}</td>
                            <td>{{ post.theme }}</td>
                            <td>{{ post.originalAuthor }}</td>
                            <td>{{ post.originalTitle }}</td>
                            <td>{{ $t("TextL." + post.language) }}</td>
                            <td><button type="button" class="btn btn-primary col-sm-12" v-on:click="postSelected(post.text_id)">{{ $t("TextL.Read") }}</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>        
        </main>

    </div>

</template>

<script>
import http from "./http-common.js";
import router from "../router.js";

export default {

    data(){
        return{
            posts: [],
            genre: "null",
            order: "null",
            language: "null",
            search: ""
        }
    },

    created: function() {
        this.getPosts();
    },

    methods: {

        getPosts() {

            http.get("/texts")
                .then(res => {
                
                    this.posts = res.data;

                }).catch(err => {
                    console.log(err);
                });

        },

        postSelected(post_id) {

            console.log("post selected");
            router.push({name: "post", params: {username: this.username, text_id: post_id}});

        },

        searchPosts() {

            var search = "@null";

            if (this.search != "") {
                search = this.search
            }

            http.get("/texts/" + this.language + "/" + this.order + "/" + this.genre + "/" + search)
                .then(res => {
                    
                    console.log("SEARCH: " + JSON.stringify(res.data));
                    this.posts = res.data;

                }).catch(err => {
                    console.log(err);
                });

        },

    },

    props: ["username"],

};

</script>