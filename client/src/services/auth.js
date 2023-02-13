import axios from "axios";

class AuthService {
  static signUp(user) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          "/signUp",
          (user = {
            email: user.email,
            password: user.password,
            name: user.name,
            address: user.address,
            accountType: user.accountType,
          })
        )
        .then((res) => {
          console.log("Service return success.");
          console.log(res.data);
          resolve(res.data.user);
        })
        .catch((err) => {
          console.log("Service return failed.");
          reject(err);
        });
    });
  }

  static login(user) {
    return new Promise((resolve, reject) => {
      axios
        .post("/login", {
          email: user.email,
          password: user.password,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static verifyEmail(code) {
    return new Promise((resolve, reject) => {
      const url = "/verify/" + code;
      axios
        .get(url)
        .then((res) => {
          resolve(res.data.token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default AuthService;
