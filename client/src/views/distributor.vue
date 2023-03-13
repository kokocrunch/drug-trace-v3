<template>
  <div class="Distributor">
    <v-app-bar app color="#FFFFFF" outlined prominent dark>
      <v-img max-height="120" max-width="200" src="../assets/logo.jpg"></v-img>

      <v-spacer></v-spacer>

      <v-menu open-on-hover top offset>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="teal accent-4" dense class="pr-3 pt-1">
              mdi-account-outline
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-avatar color="blue-grey darken-1">
              <v-icon dark> mdi-account </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ businessName }}</v-list-item-title>
              <v-list-item-subtitle
                >ID: {{ distributorId }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list>
          <v-list-item>
            <v-btn color="teal accent-4" plain @click.stop="drawer = !drawer">
              Profile</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
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

      <v-list subheader three-line>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Business Name</v-list-item-title>
            <v-list-item-subtitle>{{ businessName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-map-marker-radius</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Business Address</v-list-item-title>
            <v-list-item-subtitle>{{ address }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Email</v-list-item-title>
            <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" color="teal accent-4" plain> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-container class="py-16 my-1">
      <v-row justify="space-around">
        <v-col>
          <v-hover v-slot="{ hover }">
            <v-card
              :to="'/add'"
              :elevation="hover ? 12 : 6"
              :class="['pa-16 mt-16', { 'on-hover': hover }]"
              rounded
            >
              <v-card-title style="word-break: break-word">
                Add Drug Batch
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-icon> mdi-package-variant-closed-plus </v-icon>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>

        <v-col>
          <v-hover v-slot="{ hover }">
            <v-card
              :to="'/order-list'"
              :elevation="hover ? 12 : 6"
              :class="['pa-16 mt-16', { 'on-hover': hover }]"
              rounded
            >
              <v-card-title style="word-break: break-word">
                Orders <br />
                <br />
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-icon> mdi-pill </v-icon>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
        <v-col>
          <v-hover v-slot="{ hover }">
            <v-card
              :to="'/complaints'"
              :elevation="hover ? 12 : 6"
              :class="['pa-16 mt-16', { 'on-hover': hover }]"
              rounded
            >
              <v-card-title style="word-break: break-word">
                Complaints <br />
                <br />
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-icon> mdi-file-document-alert </v-icon>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>

        <v-col>
          <v-hover v-slot="{ hover }">
            <v-card
              :to="'/inventory-dst'"
              :elevation="hover ? 12 : 6"
              :class="['pa-16 mt-16', { 'on-hover': hover }]"
              rounded
            >
              <v-card-title style="word-break: break-word">
                Owned Drug Batch List
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-icon> mdi-clipboard-list </v-icon>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.v-card:on-hover {
  opacity: 0.6;
}
</style>

<style scoped>
.v-card:on-hover {
  opacity: 0.6;
}
</style>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: "Business Name", icon: "mdi-view-dashboard" },
        { title: "Business Address", icon: "mdi-map-marker-radius" },
        { title: "distributorr@email.com", icon: "mdi-email" },
      ],
    };
  },
  methods: {
    logout() {
      console.log("Logout pressed.");
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
    businessName() {
      return this.user.name;
    },
    distributorId() {
      return this.user._id;
    },
    address() {
      return this.user.address;
    },
    email() {
      return this.user.email;
    },
  },
};
</script>
