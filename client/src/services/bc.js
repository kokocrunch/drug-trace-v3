import axios from "axios";

class BcService {
  static add(batch) {
    return new Promise((resolve, reject) => {
      axios
        .post("/add", batch)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static distribute(batch) {
    return new Promise((resolve, reject) => {
      axios
        .post("/distribute", batch)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static recall(batchNum) {
    return new Promise((resolve, reject) => {
      axios
        .post("/recall", batchNum)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAll_RTL(id) {
    return new Promise((resolve, reject) => {
      axios
        .get("/rtl/drugs", id)
        .then((res) => {
          resolve(res.data.result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAll_DST(id) {
    return new Promise((resolve, reject) => {
      axios
        .get("/dst/drugs", id)
        .then((res) => {
          resolve(res.data.result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getHistory(batchNum) {
    return new Promise((resolve, reject) => {
      axios
        .get("/drugBatch", batchNum)
        .then((res) => {
          delete res.data.success;
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default BcService;
