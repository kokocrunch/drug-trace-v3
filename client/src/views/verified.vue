<template>
  <div class="Verified">
    <v-app-bar app color="#FFFFFF" outlined prominent dark>
      <v-img max-height="120" max-width="200" src="../logo.jpg"></v-img>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Distributor</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title> {{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" color="teal accent-4" plain to="/">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <div class="pa-16">
      <v-row align="center" justify="center">
        <v-card class="pa-16 ma-10" max-width="500" max-height="500">
          <v-card-text class="pa-6">
            <p class="text-h4 text--primary">Congratulations!</p>

            <div class="text--primary">
              Your DrugTrace account is now verified.
            </div>
          </v-card-text>
          <v-card-actions>
            <div class="pa-2">
              <v-btn @click="logout" color="teal accent-4" plain to="/">
                Go back to login
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-row>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth";
export default {
  name: "Verified",
  data() {
    return {};
  },
  beforeMount() {
    console.log(this.$route.params.verifyCode);
    AuthService.verifyEmail(this.$route.params.verifyCode)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  created() {
    // setTimeout(() => this.$router.push("/"), 5000);
  },
};
</script>
