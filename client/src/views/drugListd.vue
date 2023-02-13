<template>
  <v-app>
    <div class="Owned">
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
        sort-by="_id"
        :search="search"
        class="elevation-1"
      >
        <!-- Search and filter -->
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
                  v-model="state"
                  :items="filters"
                  label="Filter by State"
                  class="mt-10"
                  color="teal darken-2"
                ></v-select>
              </v-col>
              <v-col cols="2" sm="2">
                <v-btn depressed class="mt-10" @click="clear"> Clear </v-btn>
              </v-col>
            </v-row>

            <!-- View dialog -->
            <v-dialog v-model="dialogView" width="unset">
              <v-card>
                <v-card-title class="text-h5">Transaction history</v-card-title>
                <v-card-text>
                  <div v-for="(item, i) in history.slice(0, 1)" class="pa-2">
                    <div>
                      Batch Number:
                      <span class="text--primary">{{
                        item.Value.batchNum
                      }}</span>
                    </div>
                    <div>
                      Description:
                      <span class="text--primary">{{
                        item.Value.description
                      }}</span>
                    </div>
                    <div>
                      Manufacturer:
                      <span class="text--primary">{{
                        item.Value.manufacturer
                      }}</span>
                    </div>
                    <div>
                      Expiry:
                      <span class="text--primary">{{ item.Value.expiry }}</span>
                    </div>
                    <div>
                      Quantity:
                      <span class="text--primary">{{
                        item.Value.quantity
                      }}</span>
                    </div>
                    <div>
                      Stock:
                      <span class="text--primary">{{
                        item.Value.availableStock
                      }}</span>
                    </div>
                    <div>
                      Unit Price:
                      <span class="text--primary">{{ item.Value.peso }}</span>
                    </div>
                  </div>
                  <v-divider></v-divider>
                  <div v-for="item in history" class="pa-2">
                    <div>
                      Timestamp:
                      <span class="text--primary">{{ item.Timestamp }}</span>
                    </div>
                    <div>
                      Transaction ID:
                      <span class="text-caption black--text">{{
                        item.TxId
                      }}</span>
                    </div>
                    <div>
                      State:
                      <span class="text--primary">{{ item.Value.state }}</span>
                    </div>
                    <div>Owner/s:</div>
                    <div v-for="rtl in item.Value.owners">
                      <li class="text--primary pl-2">
                        {{ rtl.name }}, {{ rtl.qty }}pcs
                      </li>
                    </div>
                    <v-divider></v-divider>
                  </div>
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
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import BcService from "@/services/bc";
export default {
  data: () => ({
    filters: ["Distribution", "Recalled"],
    dialog: false,
    dialogRecall: false,
    dialogView: false,
    search: "",
    state: "",
    headers: [
      {
        text: "Batch No.",
        align: "start",
        value: "batchNum",
        sortable: false,
      },
      {
        text: "Description",
        sortable: false,
        value: "description",
      },
      { text: "Manufacturer", value: "manufacturer" },
      { text: "Expiry", sortable: false, value: "expiry" },
      { text: "Stock", value: "availableStock" },
      { text: "Unit Price", value: "peso" },
      { text: "State", sortable: false, value: "state" },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    items: [],
    history: [],
  }),

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
        return !this.state || i.state === this.state;
      });
    },
  },

  watch: {
    dialogView(val) {
      val || this.close(), (this.history = []);
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
      BcService.getAll_DST({
        params: {
          distributorId: this.user._id,
        },
      }).then((data) => {
        const drugs = Object.values(data);
        drugs.forEach((drug) => {
          this.items.push({
            batchNum: drug.batchNum,
            manufacturer: drug.manufacturer,
            description: drug.description,
            distributorId: drug.distributorId,
            expiry: drug.expiry,
            state: drug.state,
            unitPrice: drug.unitPrice,
            availableStock: drug.availableStock,
            peso: "₱" + drug.unitPrice + ".00",
          });
        });
      });
    },
    viewItem(item) {
      console.log(item.batchNum);
      BcService.getHistory({
        params: {
          batchNum: item.batchNum,
        },
      }).then((data) => {
        const txs = Object.values(data);
        txs.forEach((tx) => {
          this.history.push(tx);
        });
      });
      this.dialogView = true;
    },
    close() {
      this.history = [];
      this.dialogView = false;
    },
    clear() {
      this.search = "";
      this.state = "";
    },
  },
};
</script>
