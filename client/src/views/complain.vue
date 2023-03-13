<template>
  <div class="Complain">
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
              <v-list-item-subtitle>ID: {{ retailerId }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list>
          <v-list-item>
            <!-- pa lipat na lang ng logout button sa profile nav -->
            <v-btn @click="logout" color="teal accent-4" plain> Logout</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Form complain -->
    <v-row justify="center" class="pa-6">
      <v-col cols="12" sm="10">
        <v-form ref="form" id="formComplain" @submit.prevent="submitComplain">
          <v-card class="pa-6">
            <v-card-text>
              <h2>Please fill up the form to submit a complaint.</h2>

              <v-select
                :items="distributors"
                v-model="distributor"
                :rules="[(v) => !!v || 'This field is required']"
                label="Distributor"
                required
                color="teal darken-2"
              ></v-select>

              <v-autocomplete
                label="Batch Number"
                v-model="batchno"
                :items="batch"
                :rules="[(v) => !!v || 'This field is required']"
                required
                color="teal darken-2"
              ></v-autocomplete>

              <v-textarea
                v-model="reason"
                :rules="[(v) => !!v || 'This field is required']"
                label="Reason"
                hint="Enter Reason."
                color="teal darken-2"
              ></v-textarea>
            </v-card-text>

            <!-- Complaints table -->
            <v-data-table
              :headers="headers"
              :items="items"
              sort-by="id"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="search"
                        color="teal darken-2"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                        class="mt-10"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- View dialog -->
                  <v-dialog v-model="dialogView" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5 pa-5 pl-9"
                        >View Details</v-card-title
                      >
                      <v-card-text class="pb-0">
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                class="pa-0"
                                label="Complaint ID"
                                v-model="detailedit.id"
                                readonly
                                hide-details
                                color="teal darken-2"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                class="pa-0"
                                label="Datetime"
                                v-model="detailedit.datetime"
                                readonly
                                hide-details
                                color="teal darken-2"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                class="pa-0"
                                label="Batch Number"
                                v-model="detailedit.batchNum"
                                readonly
                                color="teal darken-2"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                class="pa-0"
                                label="Status"
                                v-model="detailedit.status"
                                readonly
                                color="teal darken-2"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <v-text-field
                            class="pa-0"
                            label="Distributor"
                            v-model="detailedit.distributor"
                            readonly
                            color="teal darken-2"
                          ></v-text-field>
                          <v-text-field
                            class="pa-0"
                            label="Reason"
                            v-model="detailedit.reason"
                            readonly
                            color="teal darken-2"
                          ></v-text-field>
                          <v-text-field
                            class="pa-0"
                            label="Response"
                            v-model="detailedit.response"
                            readonly
                            color="teal darken-2"
                          ></v-text-field>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="teal darken-2" text @click="close"
                          >Close</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      small
                      class="ml-2"
                      @click="viewItem(item)"
                      v-bind="attrs"
                      v-on="on"
                      color="teal darken-2"
                    >
                      mdi-eye
                    </v-icon>
                  </template>
                  <span>View</span>
                </v-tooltip>
              </template>
            </v-data-table>

            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
              <v-btn text @click="resetForm"> Clear </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="teal darken-2"
                text
                type="submit"
                form="formComplain"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CouchService from "@/services/couch";
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  data: () => ({
    distributors: [],
    distributor: "",
    batch: [],
    batchno: "",
    reason: "",
    dialogView: false,
    search: "",
    headers: [
      {
        text: "ID",
        align: "start",
        value: "id",
        sortable: false,
      },
      { text: "Datetime", sortable: false, value: "datetime" },
      { text: "Batch Number", value: "batchNum" },
      { text: "Reason", sortable: false, value: "reason" },
      { text: "Status", sortable: false, value: "status" },
      { text: "Response", value: "response", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    items: [],
    detailedit: {},
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
  },

  watch: {
    dialogView(val) {
      val || this.close();
    },
    distributor(newDst, oldDst) {
      this.getBatch(newDst);
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
      CouchService.getComplaints_RTL(this.user._id).then((data) => {
        const complaints = Object.values(data);
        complaints.forEach((complaint) => {
          this.items.push({
            id: complaint._id,
            datetime: complaint.date + " " + complaint.time,
            batchNum: complaint.batchNum,
            reason: complaint.reason,
            status: complaint.status,
            response: complaint.response,
            distributor: complaint.distributor,
          });
        });
      });
    },
    submitComplain() {
      if (this.$refs.form.validate()) {
        axios
          .post("/complain", {
            batchNum: this.batchno,
            reason: this.reason,
            distributor: this.distributor,
            retailer: this.user.name,
            retailerId: this.user._id,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            response: "None",
            status: "Open",
          })
          .then(
            () => {
              this.snackbar = true;
              this.resetForm();
              location.reload();
            },
            (err) => {
              console.log("Error submitting complaint.");
              console.log(err);
            }
          );
      }
    },
    getDst() {
      CouchService.getDst().then((data) => {
        this.distributors = Object.values(data);
      });
    },
    getBatch(newDst) {
      CouchService.getBatch_DST(newDst).then((data) => {
        this.batch = Object.values(data);
      });
    },

    resetForm() {
      this.$refs.form.resetValidation();
      this.distributor = "";
      this.batchno = "";
      this.reason = "";
    },

    viewItem(item) {
      this.dialogView = true;
      this.detailedit = item;
    },

    close() {
      this.dialogView = false;
    },
  },

  mounted() {
    this.getDst();
  },
};
</script>
<style lang="css">
.batchno input {
  text-transform: uppercase;
}
</style>
