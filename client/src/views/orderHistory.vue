<template>
  <v-app>
    <div class="order-history">
      <v-app-bar app color="#FFFFFF" outlined prominent dark>
        <v-img max-height="120" max-width="200" src="../assets/logo.jpg"></v-img>

        <v-spacer></v-spacer>

        <v-btn class="ma-2" color="teal darken-2" plain to="/">
          <v-icon dark left> mdi-chevron-left </v-icon>Go Back
        </v-btn>

        <v-menu open-on-hover top offset>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="teal light-2" dense class="pr-3 pt-1">
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
                  >ID: {{ retailerId }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list>
            <v-list-item>
              <!-- pa lipat na lang ng logout button sa profile nav -->
              <v-btn @click="logout" color="teal accent-4" plain> Logout</v-btn>
            </v-list-item>
          </v-list>
          <v-spacer></v-spacer>
        </v-menu>
      </v-app-bar>

      <!-- Table -->
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        sort-by="_id"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-row>
              <v-col cols="8" sm="4">
                <v-text-field
                  v-model="search"
                  color="teal darken-2"
                  append-icon="mdi-magnify"
                  label="Search"
                  hide-details
                  class="mt-10"
                ></v-text-field>
              </v-col>
              <v-col cols="2" sm="2">
                <v-select
                  v-model="status"
                  :items="filters"
                  label="Filter by Status"
                  class="mt-10"
                  color="teal darken-2"
                ></v-select>
              </v-col>
              <v-col cols="2" sm="2">
                <v-btn depressed class="mt-10" @click="clear"> Clear </v-btn>
              </v-col>
            </v-row>

            <!-- Cancel dialog -->
            <v-dialog v-model="dialog" max-width="500px" class="pa-6">
              <v-card>
                <v-card-title> Cancel order</v-card-title>
                <v-card-text
                  >Are you sure you want to cancel order
                  <span class="font-weight-bold">{{ cancelId }}</span
                  >?
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-col class="text-center pa-0"
                    ><v-btn color="red" text @click="close"
                      >No, don't cancel</v-btn
                    ></v-col
                  >
                  <v-divider vertical></v-divider>
                  <v-col class="text-center pa-0">
                    <v-btn color="teal darken-2" text @click="confirm">
                      Yes, cancel</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="item.status == 'Pending'"
                small
                class="ml-2"
                @click="cancel(item)"
                v-bind="attrs"
                v-on="on"
                color="red"
              >
                mdi-close-thick
              </v-icon>
            </template>
            <span>Cancel</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <!-- Snackbar -->
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import CouchService from "@/services/couch";
export default {
  data: () => ({
    filters: ["Pending", "Confirmed", "Cancelled"],
    status: null,
    search: "",
    dialog: false,
    headers: [
      {
        text: "Order ID",
        value: "_id",
        align: "start",
      },
      { text: "Datetime", value: "datetime", width: "18%" },
      { text: "Distributor", value: "distributor", width: "25%" },
      { text: "Description", value: "description", width: "20%" },
      { text: "Status", value: "status" },
      { text: "Actions", sortable: false, value: "actions" },
    ],
    items: [],
    cancelOrder: "",
    cancelId: "",
    snackbar: false,
    timeout: 3000,
    text: "Order has been cancelled",
  }),

  computed: {
    ...mapGetters({
      user: "user",
    }),
    businessName() {
      return this.user.name;
    },
    retailerId() {
      return this.user._id;
    },
    filteredItems() {
      return this.items.filter((i) => {
        return !this.status || i.status === this.status;
      });
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    logout() {
      console.log("Logout pressed.");
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
    initialize() {
      CouchService.getOrders_RTL(this.user._id).then((data) => {
        const orders = Object.values(data);
        orders.forEach((order) => {
          this.items.push({
            _id: order._id,
            _rev: order._rev,
            description: order.description,
            distributor: order.distributor,
            retailerId: order.retailerId,
            retailer: order.retailer,
            date: order.date,
            time: order.time,
            datetime: order.date + " " + order.time,
            orderId: order.orderId,
            status: order.status,
          });
        });
      });
    },
    cancel(item) {
      this.dialog = true;
      this.cancelOrder = item;
      this.cancelId = item._id;
    },
    clear() {
      this.search = "";
      this.status = "";
    },
    close() {
      this.dialog = false;
    },
    confirm() {
      this.dialog = false;
      CouchService.updateOrder({
        _id: this.cancelOrder._id,
        _rev: this.cancelOrder._rev,
        description: this.cancelOrder.description,
        distributor: this.cancelOrder.distributor,
        retailerId: this.cancelOrder.retailerId,
        retailer: this.cancelOrder.retailer,
        date: this.cancelOrder.date,
        time: this.cancelOrder.time,
        orderId: this.cancelOrder.orderId,
        status: "Cancelled",
      }).then(() => {
        this.items = [];
        this.initialize();
        this.snackbar = true;
      });
    },
  },
};
</script>
<style scoped>
::v-deep .v-snack__wrapper {
  min-width: 0px;
}
</style>
