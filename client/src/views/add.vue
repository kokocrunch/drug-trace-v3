<template>
  <div class="addForm">
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
      </v-menu>
    </v-app-bar>

    <v-row justify="center" class="pa-6">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-form id="formAdd" @submit.prevent="addBatch">
          <v-card ref="form" class="pa-6">
            <v-card-text>
              <h2>Please fill up the form.</h2>
              <v-text-field
                ref="manufacturer"
                v-model="manufacturer"
                :rules="[() => !!manufacturer || 'This field is required']"
                required
                label="Manufacturer"
                color="teal darken-2"
              ></v-text-field>

              <v-text-field
                ref="description"
                v-model="description"
                :rules="[() => !!description || 'This field is required']"
                label="Drug Description"
                hint="Enter drug description (ex. Ascorbic acid 500mg)."
                color="teal darken-2"
              ></v-text-field>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    ref="quantity"
                    type="number"
                    v-model="quantity"
                    :rules="[
                      () => !!quantity || 'This field is required',
                      (v) => Number(v) >= 1 || 'Value should be greater than 0',
                    ]"
                    label="Quantity"
                    color="teal darken-2"
                    required
                    min="0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    ref="batchno"
                    v-model="batchno"
                    :rules="[() => !!batchno || 'This field is required']"
                    label="Batch Number"
                    color="teal darken-2"
                    required
                    class="batchno"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFormatted"
                        ref="date"
                        label="Expiry Date"
                        color="teal darken-2"
                        :rules="[() => !!date || 'This field is required']"
                        persistent-hint
                        v-bind="attrs"
                        @blur="date = parseDate(dateFormatted)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      :min="new Date(Date.now()).toISOString().substr(0, 10)"
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    ref="price"
                    type="number"
                    v-model="price"
                    :rules="[
                      () => !!price || 'This field is required',
                      (v) => Number(v) >= 1 || 'Value should be greater than 0',
                    ]"
                    label="Unit Price"
                    color="teal darken-2"
                    prefix="₱"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider class="mt-6"></v-divider>
            <v-card-actions>
              <v-btn text @click="resetForm"> Clear </v-btn>
              <v-spacer></v-spacer>
              <v-slide-x-reverse-transition>
                <v-tooltip v-if="formHasErrors" left> </v-tooltip>
              </v-slide-x-reverse-transition>
              <v-btn color="teal darken-2" text type="submit" form="formAdd">
                Submit
              </v-btn>

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
              <!-- Snackbar added -->
              <v-snackbar v-model="snackAdded" :timeout="timeout">
                {{ textAdded }}
              </v-snackbar>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BcService from "@/services/bc";
import { mapGetters } from "vuex";
export default {
  data: (vm) => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: null,
    menu1: false,
    errorMessages: "",
    manufacturer: null,
    description: null,
    quantity: null,
    batchno: null,
    date: null,
    price: null,
    formHasErrors: false,
    snackAdded: false,
    snackLoading: false,
    textAdded: "Drug batch has been added.",
    textLoading: "Adding drug batch...",
    timeout: 3000,
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    form() {
      return {
        manufacturer: this.manufacturer,
        description: this.description,
        quantity: this.quantity,
        batchno: this.batchno,
        date: this.date,
        price: this.price,
      };
    },
    ...mapGetters({
      user: "user",
    }),
    businessName() {
      return this.user.name;
    },
    distributorId() {
      return this.user._id;
    },
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    name() {
      this.errorMessages = "";
    },
  },

  methods: {
    logout() {
      console.log("Logout pressed.");
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    addressCheck() {
      this.errorMessages =
        this.address && !this.name ? `Hey! I'm required` : "";

      return true;
    },
    resetForm() {
      this.errorMessages = [];
      this.formHasErrors = false;

      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    addBatch() {
      this.formHasErrors = false;

      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true;

        this.$refs[f].validate(true);
      });

      if (this.formHasErrors == false) {
        this.snackLoading = true;
        
        BcService.add({
          manufacturer: this.manufacturer,
          distributor: this.user.name,
          distributorId: this.user._id,
          description: this.description,
          batchNum: this.batchno.toUpperCase(),
          quantity: this.quantity,
          expiry: this.date,
          unitPrice: this.price,
        }).then(() => {
          this.snackLoading = false;
          this.resetForm();
          this.snackAdded = true;
        });
      }
    },
  },
};
</script>

<style scoped lang="css">
.batchno input {
  text-transform: uppercase;
}
::v-deep .v-snack__wrapper {
  min-width: 0px;
}
</style>
