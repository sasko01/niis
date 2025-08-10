import { Component } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: "login",
      },
    };
  }

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
    }));
  };

  QSendUserToParent = (state) => {
    this.props.QUserFromChild(state.user);
  };

  QPostSignUp = () => {
    let user = this.state.user
    axios.post("/users/register", {
      Ime_in_priimek: user.Ime_in_priimek,
      Email: user.Email,
      Tel_st: user.Tel_st,
      Lokacija: user.Lokacija,
      Geslo: user.Geslo
    }).then (res => {
      console.log("Sent to the server")
    }).catch (err => {
      console.log(err)
    })
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
            <label className="form-label">{t("signup.name")}</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Ime_in_priimek"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("signup.email")}</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Email"
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">{t("signup.tel")}</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Tel_st"
              type="tel"
              className="form-control"
              id="Tel_st"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("signup.adress")}</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Lokacija"
              type="text"
              className="form-control"
              id="Lokacija"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("signup.password")}</label>
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
          onClick={() => this.QPostSignUp()}
          style={{ margin: "10px" }}
          className="btn btn-outline-warning"
        >
          {t("signup.submit")}
        </button>
      </div>
    );
  }
}


export default withTranslation()(SignUpView);