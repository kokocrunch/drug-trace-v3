<template>
  <v-app>
    <div class="Complaints">
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

      <v-data-table
        :headers="headers"
        :items="filteredItems"
        sort-by="id"
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

            <!-- Ignore dialog -->
            <v-dialog v-model="dialogIgnore" max-width="500px" class="pa-6">
              <v-card>
                <v-card-title>Ignore complaint</v-card-title>
                <v-card-text
                  >Are you sure you want to ignore complaint ID
                  <span class="font-weight-bold">{{ selectedItem._id }}</span
                  >?</v-card-text
                >
                <v-divider></v-divider>
                <v-card-actions>
                  <v-col class="text-center pa-0"
                    ><v-btn color="red" text @click="close">No</v-btn></v-col
                  >
                  <v-divider vertical></v-divider>
                  <v-col class="text-center pa-0">
                    <v-btn color="teal darken-2" text @click="confirmIgnore">
                      Yes</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Recall dialog -->
            <v-dialog v-model="dialogRecall" max-width="500px">
              <v-card>
                <v-card-title>Recall drug</v-card-title>
                <v-card-text
                  >Are you sure you want to recall drug batch
                  <span class="font-weight-bold">{{
                    selectedItem.batchNum
                  }}</span
                  >?</v-card-text
                >
                <v-divider></v-divider>
                <v-card-actions>
                  <v-col class="text-center pa-0"
                    ><v-btn color="red" text @click="close"
                      >No, don't recall</v-btn
                    ></v-col
                  >
                  <v-divider vertical></v-divider>
                  <v-col class="text-center pa-0">
                    <v-btn color="teal darken-2" text @click="confirmRecall">
                      Yes, confirm recall</v-btn
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
                          label="Complaint ID"
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
                      <v-col cols="12" sm="6">
                        <v-text-field
                          class="pa-0"
                          label="Batch Number"
                          v-model="selectedItem.batchNum"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          class="pa-0"
                          label="Status"
                          v-model="selectedItem.status"
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
                        <v-text-field
                          class="pa-0"
                          label="Reason"
                          v-model="selectedItem.reason"
                          readonly
                          hide-details
                          color="teal darken-2"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          class="pa-0"
                          label="Response"
                          v-model="selectedItem.response"
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
          </v-toolbar>
        </template>

        <!-- Actions buttons -->
        <template v-slot:item.actions="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="item.status == 'Open'"
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                color="red"
                @click="ignoreItem(item)"
              >
                mdi-close-thick
              </v-icon>
            </template>
            <span>Ignore</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="item.status == 'Open'"
                small
                @click="recallItem(item)"
                v-bind="attrs"
                v-on="on"
                color="orange"
              >
                mdi-arrow-u-left-top-bold
              </v-icon>
            </template>
            <span>Recall</span>
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

      <!-- Ignore confirmed snackbar -->
      <v-snackbar v-model="snackIgnored" :timeout="timeout">
        Request updated
      </v-snackbar>

      <!-- Recall loading snackbar -->
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

      <!-- Recall confirmed snackbar -->
      <v-snackbar v-model="snackRecalled" :timeout="timeout">
        Drug batch recalled
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
    filters: ["Open", "Closed"],
    dialogIgnore: false,
    dialogRecall: false,
    dialogView: false,
    search: "",
    status: null,
    headers: [
      {
        text: "Complaint ID",
        align: "start",
        value: "_id",
      },
      { text: "Datetime", value: "datetime" },
      { text: "Complainant", sortable: false, value: "retailer" },
      { text: "Batch Number", sortable: false, value: "batchNum" },
      { text: "Reason", sortable: false, value: "reason" },
      { text: "Status", sortable: false, value: "status" },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    items: [],
    selectedItem: {},
    snackLoading: false,
    snackRecalled: false,
    snackIgnored: false,
    timeout: 3000,
  }),

  watch: {
    dialogIgnore(val) {
      val || this.close();
    },
    dialogRecall(val) {
      val || this.close();
    },
    dialogView(val) {
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
      CouchService.getComplaints_DST(this.user.name).then((data) => {
        const complaints = Object.values(data);
        complaints.forEach((complaint) => {
          this.items.push({
            _id: complaint._id,
            _rev: complaint._rev,
            batchNum: complaint.batchNum,
            reason: complaint.reason,
            distributor: complaint.distributor,
            retailerId: complaint.retailerId,
            retailer: complaint.retailer,
            date: complaint.date,
            time: complaint.time,
            datetime: complaint.date + " " + complaint.time,
            complainId: complaint.complainId,
            status: complaint.status,
            response: complaint.response,
          });
        });
      });
    },
    recallItem(item) {
      this.dialogRecall = true;
      this.selectedItem = item;
    },
    viewItem(item) {
      this.selectedItem = item;
      this.dialogView = true;
    },
    ignoreItem(item) {
      this.selectedItem = item;
      this.dialogIgnore = true;
    },
    confirmRecall() {
      this.dialogRecall = false;
      this.snackLoading = true;
      BcService.recall({
        batchNum: this.selectedItem.batchNum,
      }).then(
        () => {
          CouchService.updateComplaint({
            _id: this.selectedItem._id,
            _rev: this.selectedItem._rev,
            batchNum: this.selectedItem.batchNum,
            reason: this.selectedItem.reason,
            distributor: this.selectedItem.distributor,
            retailerId: this.selectedItem.retailerId,
            retailer: this.selectedItem.retailer,
            date: this.selectedItem.date,
            time: this.selectedItem.time,
            complainId: this.selectedItem.complainId,
            status: "Closed",
            response: "Recalled",
          }).then(
            () => {
              this.snackLoading = false;
              this.items = [];
              this.initialize();
              this.snackRecalled = true;
            },
            (err) => {
              console.log("Error updating complaint. ", err);
            }
          );
        },
        (err) => {
          console.log("Error in recall. ", err);
        }
      );
    },
    confirmIgnore() {
      this.dialogIgnore = false;
      CouchService.updateComplaint({
        _id: this.selectedItem._id,
        _rev: this.selectedItem._rev,
        batchNum: this.selectedItem.batchNum,
        reason: this.selectedItem.reason,
        distributor: this.selectedItem.distributor,
        retailerId: this.selectedItem.retailerId,
        retailer: this.selectedItem.retailer,
        date: this.selectedItem.date,
        time: this.selectedItem.time,
        complainId: this.selectedItem.complainId,
        status: "Closed",
        response: "Ignored",
      }).then(() => {
        this.items = [];
        this.initialize();
        this.snackIgnored = true;
      });
    },
    close() {
      this.dialogIgnore = false;
      this.dialogRecall = false;
      this.dialogView = false;
    },
    clear() {
      this.search = "";
      this.status = "";
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
