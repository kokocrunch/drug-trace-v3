<template>
  <v-app>
    <div class="Complaints">
      <v-app-bar app color="#FFFFFF" outlined prominent dark>
        <v-img max-height="120" max-width="200" src="../logo.jpg"></v-img>

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
                  >ID: {{ distributorId }}</v-list-item-subtitle
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

      <!-- Data table -->
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        sort-by="id"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <!-- Search, filter, and distribute -->
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
              <v-col class="text-right">
                <v-btn
                  depressed
                  class="mt-10"
                  @click="distribute"
                  color="teal darken-2"
                  :dark="true"
                  >Distribute</v-btn
                >
              </v-col>
            </v-row>

            <!-- Cancel dialog -->
            <v-dialog v-model="dialogCancel" max-width="500px" class="pa-6">
              <v-card>
                <v-card-title>Cancel order</v-card-title>
                <v-card-text
                  >Are you sure you want to cancel order ID
                  <span class="font-weight-bold">{{ selectedItem._id }}</span
                  >?</v-card-text
                >
                <v-divider></v-divider>
                <v-card-actions>
                  <v-col class="text-center pa-0"
                    ><v-btn color="red" text @click="close"
                      >No, don't cancel order</v-btn
                    ></v-col
                  >
                  <v-divider vertical></v-divider>
                  <v-col class="text-center pa-0">
                    <v-btn color="teal darken-2" text @click="confirmCancel">
                      Yes, cancel order</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Confirm dialog -->
            <v-dialog v-model="dialogConfirm" max-width="500px">
              <v-card>
                <v-card-title>Confirm order</v-card-title>
                <v-card-text
                  >Are you sure you want to confirm order ID
                  <span class="font-weight-bold">{{ selectedItem._id }}</span
                  >?</v-card-text
                >
                <v-divider></v-divider>
                <v-card-actions>
                  <v-col class="text-center pa-0"
                    ><v-btn color="red" text @click="close"
                      >No, don't confirm order</v-btn
                    ></v-col
                  >
                  <v-divider vertical></v-divider>
                  <v-col class="text-center pa-0">
                    <v-btn color="teal darken-2" text @click="confirmConfirm">
                      Yes, confirm order</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- View dialog -->
            <v-dialog v-model="dialogView" max-width="500px">
              <v-card>
                <v-card-title class="text-h5 pa-5 pl-9"
                  >View Details</v-card-title
                >
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          class="pa-0"
                          label="Order ID"
                          v-model="selectedItem._id"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          class="pa-0"
                          label="Datetime"
                          v-model="selectedItem.datetime"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          class="pa-0"
                          label="Retailer"
                          v-model="selectedItem.retailer"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          class="pa-0"
                          label="Order description"
                          v-model="selectedItem.description"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          class="pa-0"
                          label="Status"
                          v-model="selectedItem.status"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="teal darken-2" text @click="close">Close</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Distribute dialog -->
            <v-dialog v-model="dialogDistribute" max-width="500px">
              <v-form
                ref="form"
                id="formDistribute"
                @submit.prevent="confirmDistribute"
              >
                <v-card>
                  <v-card-title class="text-h5 pa-5 pl-7"
                    >Distribute drugs</v-card-title
                  >
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-select
                            class="pa-0"
                            :items="rtlId"
                            label="Retailer ID"
                            v-model="retailer"
                            :rules="[(v) => !!v || 'This field is required']"
                            color="teal darken-2"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select
                            class="pa-0"
                            :items="batchnos"
                            label="Batch Number"
                            v-model="batchno"
                            :rules="[(v) => !!v || 'This field is required']"
                            color="teal darken-2"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            class="pa-0"
                            label="Quantity"
                            v-model="quantity"
                            :rules="[
                              (v) => !!v || 'This field is required',
                              (v) =>
                                Number(v) >= 1 ||
                                'Value should be greater than 0',
                            ]"
                            type="number"
                            color="teal darken-2"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-col class="text-center pa-0"
                      ><v-btn color="red" text @click="close"
                        >Close</v-btn
                      ></v-col
                    >
                    <v-divider vertical></v-divider>
                    <v-col class="text-center pa-0">
                      <v-btn
                        color="teal darken-2"
                        text
                        type="submit"
                        form="formDistribute"
                      >
                        Distribute</v-btn
                      >
                    </v-col>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- Actions buttons -->
        <template v-slot:item.actions="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="item.status == 'Pending'"
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                color="red"
                @click="cancelOrder(item)"
              >
                mdi-close-thick
              </v-icon>
            </template>
            <span>Cancel</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="item.status == 'Pending'"
                small
                @click="confirmOrder(item)"
                v-bind="attrs"
                v-on="on"
                color="teal darken-2"
              >
                mdi-check-bold
              </v-icon>
            </template>
            <span>Confirm</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="ml-2"
                @click="viewItem(item)"
                v-bind="attrs"
                v-on="on"
                color="indigo darken-4"
              >
                mdi-eye
              </v-icon>
            </template>
            <span>View</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <!-- Confirm confirmed snackbar -->
      <v-snackbar v-model="snackConfirmed" :timeout="timeout">
        Order has been confirmed
      </v-snackbar>

      <!-- Cancel confirmed snackbar -->
      <v-snackbar v-model="snackCancelled" :timeout="timeout">
        Order has been cancelled
      </v-snackbar>

      <!-- Distribute confirmed snackbar -->
      <v-snackbar v-model="snackDistributed" :timeout="timeout">
        Drug batch has been distributed
      </v-snackbar>

      <!-- Distribute loading snackbar -->
      <v-snackbar
        v-model="snackLoading"
        :timeout="-1"
        :multi-line="true"
        min-width="50%"
      >
        Processing...
        <v-progress-linear
          indeterminate
          color="teal darken-2"
        ></v-progress-linear>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import CouchService from "@/services/couch";
import BcService from "@/services/bc";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    filters: ["Cancelled", "Confirmed", "Pending"],
    dialogCancel: false,
    dialogConfirm: false,
    dialogView: false,
    dialogDistribute: false,
    search: "",
    status: null,
    headers: [
      {
        text: "Order ID",
        align: "start",
        value: "_id",
      },
      { text: "Datetime", value: "datetime" },
      { text: "[ID] Retailer", sortable: false, value: "retailerFull" },
      { text: "Order Description", sortable: false, value: "description" },
      { text: "Status", sortable: false, value: "status" },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    items: [],
    selectedItem: {},
    snackLoading: false,
    snackCancelled: false,
    snackConfirmed: false,
    snackDistributed: false,
    timeout: 3000,
    retailer: "",
    batchno: "",
    quantity: null,
    rtlId: [],
    rtlName: [],
    batchnos: [],
  }),

  watch: {
    dialogCancel(val) {
      val || this.close();
    },
    dialogConfirm(val) {
      val || this.close();
    },
    dialogView(val) {
      val || this.close();
    },
    dialogDistribute(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.getRtl();
    this.getBatch();
  },

  methods: {
    logout() {
      console.log("Logout pressed.");
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
    initialize() {
      CouchService.getOrders_DST(this.user.name).then((data) => {
        const orders = Object.values(data);
        orders.forEach((order) => {
          this.items.push({
            _id: order._id,
            _rev: order._rev,
            batchNum: order.batchNum,
            description: order.description,
            distributor: order.distributor,
            retailerId: order.retailerId,
            retailer: order.retailer,
            retailerFull: "[" + order.retailerId + "]" + " " + order.retailer,
            date: order.date,
            time: order.time,
            datetime: order.date + " " + order.time,
            complainId: order.complainId,
            status: order.status,
          });
        });
      });
    },
    getRtl() {
      CouchService.getRtl().then((data) => {
        this.rtlId = Object.values(data.id);
        this.rtlName = Object.values(data.name);
      });
    },
    getBatch() {
      CouchService.getBatch_DST(this.user.name).then((data) => {
        const id = Object.values(data);
        this.batchnos = id;
      });
    },
    viewItem(item) {
      this.selectedItem = item;
      this.dialogView = true;
    },
    confirmOrder(item) {
      this.selectedItem = item;
      this.dialogConfirm = true;
    },
    cancelOrder(item) {
      this.selectedItem = item;
      this.dialogCancel = true;
    },
    confirmConfirm() {
      this.dialogConfirm = false;
      CouchService.updateOrder({
        _id: this.selectedItem._id,
        _rev: this.selectedItem._rev,
        description: this.selectedItem.description,
        distributor: this.selectedItem.distributor,
        retailerId: this.selectedItem.retailerId,
        retailer: this.selectedItem.retailer,
        date: this.selectedItem.date,
        time: this.selectedItem.time,
        orderId: this.selectedItem.orderId,
        status: "Confirmed",
      }).then(() => {
        this.items = [];
        this.initialize();
        this.snackConfirmed = true;
      });
    },
    confirmCancel() {
      this.dialogCancel = false;
      CouchService.updateComplaint({
        _id: this.selectedItem._id,
        _rev: this.selectedItem._rev,
        description: this.selectedItem.description,
        distributor: this.selectedItem.distributor,
        retailerId: this.selectedItem.retailerId,
        retailer: this.selectedItem.retailer,
        date: this.selectedItem.date,
        time: this.selectedItem.time,
        orderId: this.selectedItem.orderId,
        status: "Cancelled",
      }).then(() => {
        this.items = [];
        this.initialize();
        this.snackCancelled = true;
      });
    },
    confirmDistribute() {
      const i = this.rtlId.findIndex((data) => {
        return data == this.retailer;
      });
      let nm = this.rtlName[i];

      this.snackLoading = true;

      BcService.distribute({
        batchNum: this.batchno,
        quantity: this.quantity,
        retailerId: this.retailer,
        retailer: nm,
      }).then(() => {
        this.snackLoading = false;
        this.$refs.form.reset();
        this.snackDistributed = true;
      });
    },
    close() {
      this.dialogCancel = false;
      this.dialogConfirm = false;
      this.dialogView = false;
      this.dialogDistribute = false;
      this.$refs.form.reset();
    },
    clear() {
      this.search = "";
      this.status = "";
    },
    distribute() {
      this.dialogDistribute = true;
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
    filteredItems() {
      return this.items.filter((i) => {
        return !this.status || i.status === this.status;
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
