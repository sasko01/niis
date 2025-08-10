import { Component } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: "login",
      },
    };
  }

  QGetTextFromField = (e) => {
  this.setState(prevState => ({
    user: {
      ...prevState.user,
      [e.target.name]: e.target.value
    }
  }));
};

  QSendUser2Parent = (obj) => {
    this.props.QUserFromChild(obj);
  };//Prej je blo QSendUserToParent; spremenu v QSendUser2Parent
  
  QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; //dodal

  
  QPostLogin = () => {
  let user = this.state.user;
  axios.post("/users/login", {
    Email: user.Email,
    Geslo: user.Geslo
  }, { withCredentials: true })
  .then(res => {
    console.log("Sent to the server");
    console.log(res.data);
    if (res.data.success) {
      localStorage.setItem("u_id", res.data.user.u_id); //hrani u_id na celotni strani: dela z logout?
      this.QSendUser2Parent(res.data.user);
      this.QSetViewInParent({ page: "loggedUserView" });
    } else {
      alert("Login failed: " + (res.data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("Login error:", err);
    alert("Login error: Check console");
  });
} //updated za loggedUserView 

  componentDidMount() {
  axios.get("/users/login", { withCredentials: true })
    .then(res => {
      console.log("Checked login status:", res.data);
      if (res.data.logged) {
        this.QSendUser2Parent(res.data); // Send session user to parent
      }
    });
}


  render() {
    const t = this.props.t;

    return (
      <div
        className="card"
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <form style={{ margin: "20px" }}>
          <div className="mb-3">
            <label className="form-label">{t("login.email")}</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Email"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("login.password")}</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Geslo"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>
        </form>
        <button
          onClick={ this.QPostLogin} // updated za loggedUserView
          style={{ margin: "10px" }}
          className="btn btn-outline-warning"
        >
          {t("login.login")} 
        </button>
      </div>
    );
  }
}

export default withTranslation()(LoginView);
