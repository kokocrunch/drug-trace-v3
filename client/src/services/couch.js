import axios from "axios";
import { mapActions } from "vuex";

class CouchService {
  static placeOrder(order) {
    return new Promise((resolve, reject) => {
      axios
        .post("/order", order)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateOrder(order) {
    return new Promise((resolve, reject) => {
      axios
        .post("/updateOrder", order)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getOrders_RTL(rtl) {
    return new Promise((resolve, reject) => {
      axios
        .get("/rtl/orders", {
          params: {
            retailerId: rtl,
          },
        })
        .then((res) => {
          delete res.data.sucess;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getOrders_DST(dst) {
    return new Promise((resolve, reject) => {
      axios
        .get("/dst/orders", {
          params: {
            distributor: dst,
          },
        })
        .then((res) => {
          delete res.data.sucess;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getDst() {
    return new Promise((resolve, reject) => {
      axios
        .get("/dst")
        .then((res) => {
          delete res.data.sucess;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getRtl() {
    return new Promise((resolve, reject) => {
      axios
        .get("/rtl")
        .then((res) => {
          delete res.data.sucess;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getBatch_DST(dst) {
    return new Promise((resolve, reject) => {
      axios
        .get("/dst/getBatch", {
          params: {
            distributor: dst,
          },
        })
        .then((res) => {
          delete res.data.success;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static submitComplaint() {}

  static updateComplaint(complaint) {
    return new Promise((resolve, reject) => {
      axios
        .post("/updateComplaint", complaint)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getComplaints_DST(dst) {
    return new Promise((resolve, reject) => {
      axios
        .get("/dst/complaints", {
          params: {
            distributor: dst,
          },
        })
        .then((res) => {
          delete res.data.sucess;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getComplaints_RTL(rtl) {
    return new Promise((resolve, reject) => {
      axios
        .get("/rtl/complaints", {
          params: {
            retailerId: rtl,
          },
        })
        .then((res) => {
          delete res.data.sucess;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default CouchService;
