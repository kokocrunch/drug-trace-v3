<template>
  <div class="order">
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
            <v-list-item-avatar color="#98AFBA">
              <v-icon dark> mdi-account-circle </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ businessName }}</v-list-item-title>
              <v-list-item-subtitle>ID: {{ retailerId }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list>
          <v-list-item>
            <v-btn plain to="/"> Logout</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-row justify="center" class="pa-6">
      <v-col cols="12" sm="10" md="8" lg="6">
        <!-- Form -->
        <v-form ref="form" id="formOrder" @submit.prevent="placeOrder">
          <v-card class="pa-6">
            <v-card-text>
              <h2>Please fill up the form.</h2>

              <!-- Permanent fields -->
              <v-select
                :items="distributors"
                item-value="name"
                item-text="name"
                v-model="distributor"
                :rules="[() => !!distributor || 'This field is required']"
                label="Distributor"
                required
                color="teal darken-2"
              ></v-select>

              <v-row align="center">
                <v-col cols="12" sm="9">
                  <v-text-field
                    ref="description"
                    v-model="description"
                    :rules="[() => !!description || 'This field is required']"
                    label="Description"
                    hint="Enter drug description (ex. Ascorbic Acid 500mg)."
                    color="teal darken-2"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                    ref="quantity"
                    type="number"
                    v-model="quantity"
                    :rules="[() => !!quantity || 'This field is required']"
                    label="Quantity"
                    required
                    color="teal darken-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="teal darken-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="addItem"
                        >mdi-plus-circle</v-icon
                      >
                    </template>
                    <span>Add item</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <!-- Dynamic fields -->
              <div
                v-for="(textField, i) in textFields"
                :key="i"
                class="text-fields-row"
              >
                <v-row align="center">
                  <v-col cols="12" sm="9">
                    <v-text-field
                      :label="textField.label1"
                      v-model="textField.value1"
                      required
                      color="teal darken-2"
                      hint="Enter drug description (ex. Ascorbic Acid 500mg)."
                      :rules="[
                        () => !!textField.value1 || 'This field is required',
                      ]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-text-field
                      :label="textField.label2"
                      v-model="textField.value2"
                      type="number"
                      required
                      color="teal darken-2"
                      :rules="[
                        () => !!textField.value2 || 'This field is required',
                      ]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="1">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="red"
                          @click="removeItem"
                          v-bind="attrs"
                          v-on="on"
                          >mdi-minus-circle</v-icon
                        >
                      </template>
                      <span>Remove item</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
            <v-divider class="mt-6"></v-divider>

            <!-- Form buttons -->
            <v-card-actions>
              <v-btn text @click="resetForm"> Clear </v-btn>
              <v-spacer></v-spacer>
              <v-btn type="submit" form="formOrder" color="teal darken-2" text>
                Submit
              </v-btn>

              <!-- Snackbar -->
              <v-snackbar v-model="snackbar" :timeout="timeout">
                {{ text }}

                <template v-slot:action="{ attrs }">
                  <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    Close
                  </v-btn>
                </template>
              </v-snackbar>
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
export default {
  name: "BuyForm",
  data: () => ({
    distributor: "",
    description: "",
    quantity: "",
    distributors: [],
    snackbar: false,
    text: "Order has been placed.",
    timeout: 2000,
    textFields: [],
    try: "",
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

  methods: {
    resetForm() {
      this.$refs.form.resetValidation();
      this.distributor = "";
      this.description = "";
      this.quantity = "";
      this.textFields = [];
    },
    placeOrder() {
      if (this.$refs.form.validate()) {
        let orders = [];
        orders.push(this.description + " " + this.quantity + "pcs");
        this.textFields.forEach((i) => {
          orders.push(i.value1 + " " + i.value2 + "pcs");
        });
        const order = orders.join(", ");
        CouchService.placeOrder({
          description: order,
          distributor: this.distributor,
          retailerId: this.user._id,
          retailer: this.user.name,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          status: "Pending",
        }).then(
          () => {
            this.snackbar = true;
            this.resetForm();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    getDst() {
      CouchService.getDst().then(
        (data) => {
          this.distributors = Object.values(data);
        },
        (err) => {
          console.log(err);
        }
      );
    },
    addItem() {
      this.textFields.push({
        label1: "Description",
        value1: "",
        label2: "Quantity",
        value2: "",
      });
    },
    removeItem(index) {
      this.textFields.splice(index, 1);
    },
  },

  mounted() {
    this.getDst();
  },
};
</script>
