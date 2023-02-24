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
                <tr v-for="paragraph in mergedText">
                    <td>{{ paragraph }}</td>
                </tr>
            </tbody>
        </div>

        <p></p>

        <button type="button" class="btn btn-secondary" style="margin-right:16px" v-on:click="goBack(parentContinuation.previousContinuation)">{{ $t("Continuation.GoBack") }}</button>

        <button type="button" class="btn btn-primary" v-on:click="showContinuationMaker">{{ $t("Continuation.ContinueFromHere") }}</button>
        
        <!-- Button trigger modal Delete -->
        <button v-if="this.username == parentContinuation.username" type="button" class="btn btn-danger" style="float: right;" data-bs-toggle="modal" data-bs-target="#DeleteModal">
            {{ $t("Continuation.DeleteContinuation") }}
        </button>
        <!-- Modal Delete -->
        <div class="modal fade" id="DeleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{{ $t("Continuation.DeleteContinuation") }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {{ $t("Continuation.AreYouSure") }}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("Continuation.No") }}</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" v-on:click="deleteContinuation(parentContinuation.continuation_id, parentContinuation.previousContinuation)">{{ $t("Continuation.Delete") }}</button>
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
                        <label class="form-label" for="textContinuation"></label>
                    </div>
                </div>
                <div class="float-end mt-2 pt-1">
                    <button type="button" class="btn btn-primary btn-sm" style="margin-right:10px" v-on:click="createContinuation">{{ $t("Continuation.PostCont") }}</button>
                    <button type="button" class="btn btn-outline-primary btn-sm" v-on:click="cancelContinuationMaker">{{ $t("Continuation.Cancel") }}</button>
                </div>
            </div>
        </div>

        <p></p>

    </div>

    <div class="container">
        <div class="col-sm-3">
            <select class="form-select" id="order" v-model="order" @change="search">
                <option value="null">{{ $t("Continuation.OrderBy") }}</option>
                <option value="newest">{{ $t("Continuation.Newest") }}</option>
                <option value="oldest">{{ $t("Continuation.Oldest") }}</option>
                <option value="likes">{{ $t("Continuation.Likes") }}</option>
            </select>
        </div>

        <p></p>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td>{{ $t("Continuation.Username") }}</td>
                    <td>{{ $t("Continuation.Likes") }}</td>
                    <td>{{ $t("Continuation.Continuation") }}</td>
                </tr>
            </thead>

            <tbody>
                <tr v-for="continuation in this.childContinuations">
                    <td class="col-sm-1">{{ continuation.username }}</td>
                    <td class="col-sm-1">{{ continuation.Likes.length }}</td>
                    <td class="col-sm-8"><textarea class="form-control" rows="4" disabled>{{ continuation.textC }}</textarea></td>
                    
                    <td class="col-sm-2">
                        <button v-if="this.username != continuation.username && !continuation.Likes.map(a => a.username).includes(this.username)" type="button" class="btn btn-success col-sm-12" v-on:click="confirmLike(continuation.continuation_id)">{{ $t("Continuation.Like") }}</button>
                        <button v-if="this.username != continuation.username && continuation.Likes.map(a => a.username).includes(this.username)" type="button" class="btn btn-danger col-sm-12" v-on:click="confirmDislike(continuation.continuation_id)">{{ $t("Continuation.Dislike") }}</button>
                        <p></p>
                        <button type="button" class="btn btn-primary col-sm-12" v-on:click="continuationSelected(continuation.continuation_id)">{{ $t("Continuation.Continue") }}</button>
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
            parentContinuation: "",
            mergedText: [],
            startContinuation: false,
            order: "null",
            childContinuations: [],
            textContinuation: "",
        }
    },

    created: function() {          
        this.getPost();
        this.getParentContinuation();
        this.getChildContinuations();
    },

    methods: {

        getPost() {
            http.get("/text/" + this.text_id)
                .then(res => {
                
                    this.post = res.data;

                }).catch(err => {
                    console.log(err);
                });
        },

        getParentContinuation() {
            http.get("/continuation/" + this.continuation_id)
                .then(res => {
                
                    this.parentContinuation = res.data;

                    this.mergedText = this.parentContinuation.mergedText.split("\n");

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
            var data = {
                text_id: this.text_id,
                previousContinuation: this.continuation_id,
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

                    this.getChildContinuations();

                }).catch(err => {
                    console.log(err);
                });
        },

        mergeText() {
            var mergedText = this.parentContinuation.mergedText;
            
            mergedText = mergedText + "\n[ " + this.username + " ]\n" + this.textContinuation;

            return(mergedText);
        },

        search() {
            console.log("New order: " + this.order);

            http.get("/continuations/" + this.order + "/" + "null" + "/" + this.continuation_id)
                .then(res => {
                    
                    console.log("ORDER: " + res.data);
                    this.childContinuations = res.data;

                }).catch(err => {
                    console.log(err);
                });
        },

        continuationSelected(continuation_id) {
            console.log("continuationSelected: " + continuation_id);

            router.push({name: "continuation", params: {username: this.username, text_id: this.text_id, continuation_id: continuation_id}});
        },

        getChildContinuations() {
            
            http.get("/continuations/" + "null" + "/" + this.continuation_id)
                .then(res => {
                
                    this.childContinuations = res.data;

                }).catch(err => {
                    console.log(err);
                });
        },

        deleteContinuation(continuation_id, previousContinuation) {

            http.delete("/continuation/" + continuation_id)
            .then(res => {

                console.log(res.data);

                this.goBack(previousContinuation);

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

        goBack(previousContinuation) {
                if (previousContinuation == null) {
                    router.push({name: "post", params: {username: this.username, text_id: this.text_id}});
                } else {
                    router.push({name: "continuation", params: {username: this.username, text_id: this.text_id, continuation_id: previousContinuation}});
                }
        }

    },

    props: ["username", "text_id", "continuation_id"],
    
};

</script>