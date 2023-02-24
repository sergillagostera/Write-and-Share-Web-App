<template>
    <div class="container">

        <div class="row">
            <h5 class="col-sm-2">{{post.username}}</h5>
            <h5 class="col-sm-4">{{post.title}}</h5>
            <h5 class="col-sm-2">{{post.originalAuthor}}</h5>
            <h5 class="col-sm-4">{{post.originalTitle}}</h5>
        </div>

        <p></p>

        <div class="form-control">
            <tbody>
                <tr v-for="paragraph in contentTextPost">
                    <td>{{ paragraph }}</td>
                </tr>
            </tbody>
        </div>

        <p></p>

        <button type="button" class="btn btn-secondary" style="margin-right:16px" v-on:click="goBack()">{{ $t("Text.GoBack") }}</button>

        <button type="button" class="btn btn-primary" v-on:click="showContinuationMaker">{{ $t("Text.ContinueFromHere") }}</button>
        <!-- Button trigger modal Delete -->
        <button v-if="this.username == post.username" type="button" class="btn btn-danger" style="float: right;" data-bs-toggle="modal" data-bs-target="#DeleteModal">
            {{ $t("Text.DeletePost") }}
        </button>
        <!-- Modal Delete -->
        <div class="modal fade" id="DeleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{{ $t("Text.DeletePost") }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {{ $t("Text.AreYouSure") }}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("Text.No") }}</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" v-on:click="deletePost(post.text_id)">{{ $t("Text.Delete") }}</button>
            </div>
            </div>
        </div>
        </div>
        
        <p></p>

        <div class="container" v-show="startContinuation">
            <div class="card py-3 border-0">
                <div class="d-flex flex-start w-100">
                    <img class="rounded-circle shadow-1-strong me-3"
                        src="../assets/user.svg" alt="avatar" width="40"
                        height="40" />
                    <div class="form-outline w-100">
                        <textarea class="form-control" id="textContinuation" rows="4" required v-model="textContinuation"></textarea>
                        <label class="form-label" for="textContinuation">{{ $t("Text.PossibleCont") }}</label>
                    </div>
                </div>
                <div class="float-end mt-2 pt-1">
                    <button type="button" class="btn btn-primary btn-sm" style="margin-right:10px" v-on:click="createContinuation">{{ $t("Text.PostCont") }}</button>
                    <button type="button" class="btn btn-outline-primary btn-sm" v-on:click="cancelContinuationMaker">{{ $t("Text.Cancel") }}</button>
                </div>
            </div>
        </div>

        <p></p>

    </div>

    <div class="container">
        <div class="col-sm-3">
            <select class="form-select" id="order" v-model="order" @change="search">
                <option value="null">{{ $t("Text.OrderBy") }}</option>
                <option value="newest">{{ $t("Text.Newest") }}</option>
                <option value="oldest">{{ $t("Text.Oldest") }}</option>
                <option value="likes">{{ $t("Text.Likes") }}</option>
            </select>
        </div>

        <p></p>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td>{{ $t("Text.Username") }}</td>
                    <td>{{ $t("Text.Likes") }}</td>
                    <td>{{ $t("Text.Continuation") }}</td>
                </tr>
            </thead>

            <tbody>
                <tr v-for="continuation in continuations">
                    <td class="col-sm-1">{{ continuation.username }}</td>
                    <td class="col-sm-1">{{ continuation.Likes.length }}</td>
                    <td class="col-sm-8"><textarea class="form-control" rows="4" disabled>{{ continuation.textC }}</textarea></td>
                    
                    <td class="col-sm-2">
                        <button v-if="this.username != continuation.username && !continuation.Likes.map(a => a.username).includes(this.username)" type="button" class="btn btn-success col-sm-12" v-on:click="confirmLike(continuation.continuation_id)">{{ $t("Text.Like") }}</button>
                        <button v-if="this.username != continuation.username && continuation.Likes.map(a => a.username).includes(this.username)" type="button" class="btn btn-danger col-sm-12" v-on:click="confirmDislike(continuation.continuation_id)">{{ $t("Text.Dislike") }}</button>
                        <p></p>
                        <button type="button" class="btn btn-primary col-sm-12" v-on:click="continuationSelected(continuation.continuation_id)">{{ $t("Text.Continue") }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
import http from "./http-common.js";
import router from "../router.js";

export default {

    data(){
        return{
            post: "",
            contentTextPost: [],
            startContinuation: false,
            order: "null",
            continuations: [],
            textContinuation: "",
        }
    },

    created: function() {
        this.getPost();
        this.getContinuations();
    },

    methods: {
        
        getPost() {
            http.get("/text/" + this.text_id)
                .then(res => {
                
                    this.post = res.data;

                    this.contentTextPost = this.post.text.split("\n");

                }).catch(err => {
                    console.log(err);
                });

        },

        showContinuationMaker() {
            this.startContinuation = true;
        },

        cancelContinuationMaker() {
            this.startContinuation = false;
        },

        createContinuation() {
            if (this.textContinuation != "") {

                var data = {
                    text_id: this.post.text_id,
                    previousContinuation: null,
                    username: this.username,
                    text: this.textContinuation,
                    mergedText: this.mergeText()
                }

                this.cancelContinuationMaker();
                this.textContinuation = "";

                console.log("text continuation: " + data);

                http.post("/continuation", data)
                    .then(res => {
                        console.log(res.data);
                    
                        this.getContinuations();

                    }).catch(err => {
                        console.log(err);
                    });
            }

        },

        mergeText() {
            var mergedText = this.post.text;
            
            mergedText = mergedText + "\n[ " + this.username + " ]\n" + this.textContinuation;

            return(mergedText);
        },

        search() {
            console.log("New order: " + this.order);

            http.get("/continuations/" + this.order + "/" + this.text_id + "/" + "null")
                .then(res => {
                    
                    console.log("ORDER: " + res.data);
                    this.continuations = res.data;

                }).catch(err => {
                    console.log(err);
                });

        },

        continuationSelected(continuation_id) {
            console.log("continuationSelected: " + continuation_id);

            router.push({name: "continuation", params: {username: this.username, text_id: this.text_id, continuation_id: continuation_id}});
        },

        getContinuations() {
            http.get("/continuations/" + this.text_id + "/" + "null")
                .then(res => {
               
                    this.continuations = res.data;

                }).catch(err => {
                    console.log(err);
                });

        },

        deletePost(text_id) {
            console.log("delete post");

            http.delete("/text/" + text_id)
            .then(res => {

                console.log(res.data);
                
                router.push({name: "posts"});

            }).catch(err => {
                console.log(err);
            });

        },

        confirmLike(continuation_id) {

            var data = {
                username: this.username,
                continuation_id: continuation_id
            }

            http.post("/like", data)
                .then(res => {
                    console.log(res.data);
                    console.log("LIKE AFEGIT!");

                    this.search();

                }).catch(err => {
                    console.log(err);
                });

        },

        confirmDislike(continuation_id) {

            http.delete("/like/" + this.username + "/" + continuation_id)
                .then(res => {
                    console.log(res.data);
                    console.log("LIKE ESBORRAT!");

                    this.search();

                }).catch(err => {
                    console.log(err);
                });

        },

        goBack() {
            router.push({name: "posts"});
        }
        
    },

    props: ["username", "text_id"]

};

</script>