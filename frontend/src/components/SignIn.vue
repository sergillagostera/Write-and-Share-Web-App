<template>
  <div class="text-center">
    <main class="form-signin w-100 m-auto" style="max-width: 330px; padding: 15px;">
        <form v-on:submit.prevent="signIn">

            <img center class="logo mb-4" src="../assets/book.svg" alt="" width="72" height="57">
            <h1 class="h3 mb-3 fw-normal">{{ $t("SignInVue.SignInMessage") }}</h1>

            <notification v-bind:notifications="listNotifications"></notification>

            <div class="form-floating">
                <input type="username" class="form-control" id="floatingInput" placeholder="Username" required v-model="user.username">
                <label for="floatingInput">{{ $t("SignInVue.Username") }}</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" required v-model="user.password">
                <label for="floatingPassword">{{ $t("SignInVue.Password") }}</label>
            </div>
            
            <button class="w-100 btn btn-lg btn-primary">{{ $t("SignInVue.SignIn") }}</button>
            <p></p>

            <!-- Button trigger modal Register -->
            <button type="button" class="w-100 btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#modalRegister" v-on:click=clearInfo>
                {{ $t("SignInVue.Register") }}
            </button>
            <!-- Modal Register -->
            <div class="modal fade" id="modalRegister" tabindex="-1" aria-labelledby="modalRegisterLabel" aria-hidden="true" data-bs-keyboard="false">
                <div class="modal-dialog">
                <div class="modal-content">
                    <notification v-bind:notifications="listNotifications"></notification>
                    <form v-on:submit.prevent="confirmRegistration">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">{{ $t("SignInVue.Registration") }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click=clearInfo></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating">
                                <input type="username" class="form-control" id="floatingUsername" placeholder="Username" v-model="user.username">
                                <label for="floatingUsername">{{ $t("SignInVue.Username") }}</label>
                            </div>
                            <div class="form-floating">
                                <input type="password" class="form-control" id="floatingCreatePassword" placeholder="Password" v-model="user.password">
                                <label for="floatingCreatePassword">{{ $t("SignInVue.Password") }}</label>
                            </div>
                            <div class="form-floating">
                                <input type="password" class="form-control" id="floatingConfirmPassword" placeholder="Password" v-model="user.confirmPassword">
                                <label for="floatingPassword">{{ $t("SignInVue.ConfirmPassword") }}</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click=clearInfo>{{ $t("SignInVue.Close") }}</button>
                            <button class="btn btn-primary">{{ $t("SignInVue.Register") }}</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </form>

        <p></p>
        <label>{{ $t("SignInVue.Language") }}:</label>
        <select v-model="locale">
          <option value="en">en</option>
          <option value="cat">cat</option>
          <option value="es">es</option>
        </select>

    </main>
  </div>
</template>

<script>
import router from "../router.js";
import http from "./http-common.js";
import Notification from "./Notifications.vue";
import { useI18n } from "vue-i18n";

export default {

  data() {
      return {
        user: {
            username: "",
            password: "",
            confirmPassword: ""
        },
        listNotifications: [],
      };
  },

  setup() {
    const { locale } = useI18n()
    return { locale }
  },

  mounted() {
    if (localStorage.authenticated != null) {
      router.push({path: "/" + localStorage.authenticated});
    }
  },

  methods: {

    signIn() {

      this.popNotifications();

      http.get("/user/signIn/" + this.user.username + "/" + this.user.password)
        .then(res => {
          
          if (this.user.username == res.data) {

            localStorage.setItem("authenticated", res.data);
            localStorage.setItem("language", this.locale);

            router.push({path: "/" + res.data});
          
          } else {

            this.listNotifications.push({
              type: "danger",
              message: this.$t("SignInVue.ErrorSignIn")
            });

          }

        }).catch(err => {
          console.log(err);
        });

    },

    registerUser() {

      var data = {
        username: this.user.username,
        password: this.user.password
      }

      http.post("/user", data)
        .then(res => {
          
          console.log(res.data);

          this.listNotifications.push({
            type: "info",
            message: this.$t("SignInVue.InfoUserCreated")
          });
        
        }).catch(err => {
          console.log(err);
        });

    },

    confirmRegistration() {

      this.popNotifications();
      
      var correctPassword = this.confirmPasswords();
      var avoidSpecialChars = this.avoidSpecialChars();
      var correctLengthUsername = this.confirmLength(this.user.username, 3, 15, this.$t("SignInVue.Username"));
      var correctLengthPassword = this.confirmLength(this.user.password, 8, 64, this.$t("SignInVue.Password"));
      var userFound = "";

      if (correctPassword && avoidSpecialChars && 
        correctLengthUsername && correctLengthPassword) {

        http.get("/user/username/" + this.user.username)
          .then(res => {
            
            userFound = res.data;

            if (userFound == "") {
              this.registerUser();

            } else {
              this.listNotifications.push({
                type: "warning",
                message: this.$t("SignInVue.WarningUsernameTaken")
              });  
            }

          }).catch(err => {
            console.log(err);
          });
      }

    },

    confirmPasswords() {

      if (this.user.password == this.user.confirmPassword) {
        return true;

      } else {
        this.listNotifications.push({
          type: "danger",
          message: this.$t("SignInVue.ErrorPasswordNotMatch")
        });
        return false;
      }
    
    },

    avoidSpecialChars() {
      
      const specialChars = /[`´ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

      if (!specialChars.test(this.user.username) && !specialChars.test(this.user.password) && !specialChars.test(this.user.confirmPassword)) {  
        return true;

      } else {
        this.listNotifications.push({
          type: "danger",
          message: this.$t("SignInVue.ErrorSpecialChar")
        });
        return false;
      }

    },

    confirmLength(x, min, max, nameX) {

      if (x.length < min || x.length > max) {
        this.listNotifications.push({
          type: "danger",
          message: nameX + this.$t("SignInVue.ErrorLength") + min + "-" + max + this.$t("SignInVue.ErrorCharacters")
        });
        return false;

      } else {
        return true;
      }

    },

    clearInfo() {
      this.popNotifications();
      this.user.username="";
      this.user.password="";
      this.user.confirmPassword="";
    },

    popNotifications() {

      while(this.listNotifications.length > 0) {
        this.listNotifications.pop();
      }

    },

  },

  components: {
    'notification': Notification
  }

};

</script>