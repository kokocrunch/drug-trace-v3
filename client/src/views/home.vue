<template>
  <div class="Home">
    <v-app-bar app color="#FFFFFF" outlined prominent dark>
      <v-img max-height="120" max-width="200" src="../assets/logo.jpg"></v-img>
    </v-app-bar>

    <v-row class="pa-6">
      <v-col order="last">
        <center>
          <v-card
            elevation="15"
            class="pa-6"
            outlined
            rounded
            max-width="500"
            height="450"
          >
            <v-tabs fixed-tabs color="blue-grey darken-2" v-model="tab">
              <v-tabs-slider color="teal accent-4"></v-tabs-slider>

              <v-tab v-for="list in lists" :key="list">
                {{ list }}
              </v-tab>

              <!-- Sign In -->
              <v-tab-item>
                <v-form
                  ref="form2"
                  id="formLogin"
                  @submit.prevent="handleLogin"
                >
                  <v-container>
                    <v-row class="pt-16">
                      <v-col id="msgLogin" class="pb-0" align="start">{{
                        msgLogin
                      }}</v-col>

                      <v-col class="pt-0" cols="12" sm="12">
                        <v-text-field
                          v-model="emailLogin"
                          label="Email"
                          :rules="[(v) => !!v || 'This field is required']"
                          color="teal darken-2"
                        ></v-text-field>

                        <v-text-field
                          v-model="pwdLogin"
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show ? 'text' : 'password'"
                          label="Password"
                          :rules="[(v) => !!v || 'This field is required']"
                          name="input-10-1"
                          counter
                          @click:append="show = !show"
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>

                      <v-col align="center" justify="space-around">
                        <v-btn
                          :disabled="submittedLogin"
                          type="submit"
                          form="formLogin"
                          color="teal darken-2"
                          plain
                        >
                          LOGIN
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-tab-item>

              <!-- Sign Up -->
              <v-tab-item>
                <v-form
                  ref="form"
                  class="pt-4"
                  id="formSignUp"
                  @submit.prevent="handleSignUp"
                >
                  <v-container>
                    <v-row>
                      <v-col v-if="msgSignUp" id="msgSignUp">{{
                        msgSignUp
                      }}</v-col>
                      <v-col class="pb-0" cols="12" sm="12">
                        <v-text-field
                          class="pa-1"
                          :rules="[(v) => !!v || 'This field is required']"
                          v-model="nameSignUp"
                          for="nameSignUp"
                          label="Business Name"
                          color="teal darken-2"
                        ></v-text-field>

                        <v-text-field
                          class="pa-1"
                          :rules="[(v) => !!v || 'This field is required']"
                          v-model="addrSignUp"
                          for="addrSignUp"
                          label="Address"
                          color="teal darken-2"
                        ></v-text-field>

                        <v-text-field
                          class="pa-1"
                          :rules="[(v) => !!v || 'This field is required']"
                          v-model="emailSignUp"
                          for="emailSignUp"
                          label="Email"
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>

                      <v-col class="pt-0" cols="12" sm="6">
                        <v-text-field
                          class="pa-1"
                          :rules="[(v) => !!v || 'This field is required']"
                          color="teal darken-2"
                          v-model="pwdSignUp"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show2 ? 'text' : 'password'"
                          label="Password"
                          name="input-10-1"
                          counter
                          @click:append="show2 = !show2"
                        ></v-text-field>
                      </v-col>

                      <v-col class="pt-0" cols="12" sm="6">
                        <v-select
                          class="pa-1"
                          :rules="[(v) => !!v || 'This field is required']"
                          v-model="accountType"
                          for="accountType"
                          label="Account Type"
                          :items="items"
                          color="teal darken-2"
                        ></v-select>
                      </v-col>

                      <v-row class="pa-3" align="center" justify="space-around">
                        <v-btn
                          :disabled="submittedSignUp"
                          type="submit"
                          form="formSignUp"
                          color="teal darken-2"
                          plain
                        >
                          SIGN UP
                        </v-btn>
                      </v-row>

                      <!-- Snackbar loading -->
                      <v-snackbar
                        v-model="snackLoading"
                        :timeout="-1"
                        :multi-line="true"
                        min-width="50%"
                      >
                        {{ textLoading }}
                        <v-progress-linear
                          indeterminate
                          color="teal darken-2"
                        ></v-progress-linear>
                      </v-snackbar>

                      <!-- Snackbar -->
                      <v-snackbar v-model="snackbar" :timeout="-1">
                        {{ text }}

                        <template v-slot:action="{ attrs }">
                          <v-btn
                            color="teal darken-2"
                            text
                            v-bind="attrs"
                            @click="snackbar = false"
                          >
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-row>
                  </v-container>
                </v-form>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </center>
      </v-col>

      <!-- Moving pictures -->
      <v-col order="first">
        <v-card elevation="10" max-width="630" class="mx-auto" height="450">
          <v-carousel
            :continuous="true"
            cycle
            :show-arrows="false"
            hide-delimiter-background
            delimiter-icon="mdi-minus"
            height="280"
          >
            <v-carousel-item v-for="(pic, i) in pics" :key="i" :src="pic.src">
            </v-carousel-item>
          </v-carousel>

          <v-card-text>
            <h2 class="text--black" align="center">Why Drug Trace?</h2>
            <p class="pt-2 text--caption text--black" align="justify">
              Blockchain technology is paving the way to transmit data through
              drug supply chains. Its architecture consists of a set of
              immutable data blocks that are arranged in sequence and
              timestamped. Each block has a hash function, which is a digital
              fingerprint of data. Since all blockchain transactions are
              timestamped and immutable, blockchain technology can help preserve
              the integrity and reliability of drug data.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AuthService from "@/services/auth";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      pics: [
        {
          src: "https://cdn.pixabay.com/photo/2016/11/23/15/03/medications-1853400_960_720.jpg",
        },
        {
          src: "https://cdn.pixabay.com/photo/2017/10/14/11/30/blockchain-2850276_960_720.jpg",
        },
        {
          src: "https://media.istockphoto.com/photos/science-technology-concept-laboratory-examination-research-picture-id1180547358?k=20&m=1180547358&s=612x612&w=0&h=PeAmfbc6gLae6mbiR_PYhWefHitNIQ6srvsSXSiJAhM=",
        },
        {
          src: "https://media.istockphoto.com/photos/portrait-of-a-handsome-pharmacist-working-in-a-pharmacy-picture-id1355434702?k=20&m=1355434702&s=612x612&w=0&h=UUrMqh-AvG1S6hhqcsSmrZi0pFqvSxdqF4Cht-BXqEY=",
        },
      ],
      items: ["Distributor", "Retailer"],
      values: ["distributor", "retailer"],
      accountType: null,
      cycle: false,
      tab: null,
      lists: ["LOGIN", "SIGN UP"],
      show: false,
      show2: false,
      snackbar: false,
      snackLoading: false,
      text: "",
      textLoading: "Loading...",
      // danica
      submittedSignUp: false,
      submittedLogin: false,
      msgSignUp: "",
      nameSignUp: "",
      addrSignUp: "",
      emailSignUp: "",
      pwdSignUp: "",
      accountType: "",
      emailLogin: "",
      pwdLogin: "",
      msgLogin: "",
    };
  },

  computed: {
    ...mapGetters({
      user: "user",
    }),
  },

  methods: {
    handleSignUp() {
      if (this.$refs.form.validate()) {
        this.snackLoading = true;
        AuthService.signUp({
          email: this.emailSignUp,
          password: this.pwdSignUp,
          name: this.nameSignUp,
          address: this.addrSignUp,
          accountType: this.accountType,
        })
          .then(() => {
            this.snackLoading = false;
            this.$router.push("verify");
          })

          .catch((err) => {
            this.snackLoading = false;
            this.text = "Email already exists.";
            this.$refs.form.reset();
            this.snackbar = true;
          });
      }
    },

    handleLogin() {
      if (this.$refs.form2.validate()) {
        this.$store
          .dispatch("login", {
            email: this.emailLogin,
            password: this.pwdLogin,
          })
          .then(() => {
            // check verification
            if (this.user.verified == "no") {
              this.$router.push("verify");
              this.$store.commit("SET_TOKEN", null);
              this.$store.commit("SET_USER", null);
              this.$store.commit("SET_AUTH", false);
            } else {
              // check account type
              console.log("verified");
              if (this.user.accountType == "Retailer") {
                this.$router.push("retailer");
              } else if (this.user.accountType == "Distributor") {
                this.$router.push("distributor");
              }
            }
          })
          .catch((err) => {
            // console.log(err);
            this.msgLogin = "Invalid email or password.";
            this.submittedLogin = false;
          });
      }
    },
  },

  mounted() {
    if (this.user.accountType == "Retailer" && this.user.verified == "yes") {
      this.$router.push("retailer");
    } else if (this.user.accountType == "Distributor" && this.user.verified == "yes") {
      this.$router.push("distributor");
    }
  },
};
</script>
<style scoped>
::v-deep .v-snack__wrapper {
  min-width: 0px;
}
#msgLogin {
  color: red;
  font-size: 12px;
}
</style>
