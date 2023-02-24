<template>
    <div class="container">
        <div class="py-5 text-center">
            <h2>{{ $t("Overview.Title") }}</h2>
            <p class="lead">{{ $t("Overview.Welcome") }} {{username}}!</p>
        </div>

        <div class="container">

          <h3>{{ $t("Overview.YourPosts") }}:</h3>

          <div v-if="this.havePosts">

            <table class="table table-hover">
              
              <thead>
              <tr>
                  <td>{{ $t("TextL.Title") }}</td>
                  <td>{{ $t("TextL.Genre") }}</td>
                  <td>{{ $t("TextL.Theme") }}</td>
                  <td>{{ $t("TextL.OriginalAuthor") }}</td>
                  <td>{{ $t("TextL.OriginalTitle") }}</td>
                  <td>{{ $t("TextL.Language") }}</td>
              </tr>
              </thead>

              <tbody>
                  <tr v-for="post in myPosts">
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

          <div v-else>

            <label class="lead px-2">{{ $t("Overview.FirstPost") }}:</label>
            <button type="button" class="btn btn-primary" v-on:click="createPostSelected">{{ $t("Overview.CreatePost") }}</button>

          </div>


          <p></p>
          <h3>{{ $t("Overview.YourContributions") }}:</h3>


          <div v-if="this.haveContinuations">

            <table class="table table-hover">

              <thead>
                  <tr>
                      <td>{{ $t("Overview.FromUser") }}</td>
                      <td>{{ $t("Overview.FromTitle") }}</td>
                      <td>{{ $t("Continuation.Likes") }}</td>
                      <td>{{ $t("Overview.YourContinuation") }}</td>
                  </tr>
              </thead>

              <tbody>
                  <tr v-for="continuation in myContinuations">
                      <td class="col-sm-1">{{ continuation.Text.username }}</td>
                      <td class="col-sm-1">{{ continuation.Text.title }}</td>
                      <td class="col-sm-1">{{ continuation.Likes.length }}</td>
                      <td class="col-sm-8"><textarea class="form-control" rows="4" disabled>{{ continuation.textC }}</textarea></td>
                      
                      <td class="col-sm-2">
                          <button type="button" class="btn btn-primary col-sm-12" v-on:click="continuationSelected(continuation)">{{ $t("Text.Continue") }}</button>
                      </td>
                  </tr>
              </tbody>

            </table>

          </div>

          <div v-else>

            <label class="lead px-2">{{ $t("Overview.FirstContribution") }}:</label>
            <button type="button" class="btn btn-primary" v-on:click="searchPostSelected">{{ $t("Overview.SearchPost") }}</button>

          </div>

          <p></p>

        </div>
    </div>
</template>

<script>
import http from "./http-common.js";
import router from "../router.js";

export default {

  data(){
      return{
          myPosts: [],
          myContinuations: [],
          havePosts: false,
          haveContinuations: false,
      }
  },

  created: function() {
      this.getPost();
      this.getContinuations();
  },

  methods: {

    getPost() {

        http.get("/texts/" + this.username)
            .then(res => {
            
                this.myPosts = res.data;

                if (this.myPosts.length != 0) {
                  this.havePosts = true;
                }

                console.log("has posts: " + this.havePosts);

            }).catch(err => {
                console.log(err);
            });

    },

    getContinuations() {

        http.get("/continuations/" + this.username)
            .then(res => {
            
                this.myContinuations = res.data;

                if (this.myContinuations.length != 0) {
                  this.haveContinuations = true;
                }

                console.log("has continuations: " + this.haveContinuations);

            }).catch(err => {
                console.log(err);
            });

    },

    postSelected(post_id) {

      console.log("post selected");
      router.push({name: "post", params: {username: this.username, text_id: post_id}});

    },

    continuationSelected(continuation) {

      console.log("continuationSelected: " + continuation.continuation_id);
      router.push({name: "continuation", params: {username: this.username, text_id: continuation.text_id, continuation_id: continuation.continuation_id}});
    
    },

    createPostSelected() {

      console.log("create post selected");
      router.push({name: "create", params: { username: this.username}});

    },

    searchPostSelected() {

      console.log("search post selected");
      router.push({name: "posts"});

    }

  },

  props: ['username']

};

</script>