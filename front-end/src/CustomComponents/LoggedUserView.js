import { Component } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

class LoggedUserView extends Component {

constructor(props) {
  super(props);
  this.state = {
    showMembershipMessage: false
  };
  this.state = {
  org: {}
  };
  hasDrustvo: false
  orgName: ""
}

handlePayLaterClick = () => {
  axios.post("http://88.200.63.148:3947/users/become-member", {
    Email: this.props.user.Email
  }, { withCredentials: true })
  .then(res => {
    if (res.data.success) {
      this.setState({ showMembershipMessage: true });
    } else {
      alert("Failed to update membership: " + res.data.message);
    }
  })
  .catch(err => {
    console.error("Membership error:", err);
  });
};

QGetTextFromField = (e) => {
    this.setState(prevState => ({
      org: { ...prevState.org, [e.target.name]: e.target.value },
    }));
  };

QPostSignUp = () => {
  const { Ime, Tip, Druge_info } = this.state.org;
  const u_id = this.props.user?.u_id;

  axios.post("http://88.200.63.148:3947/users/create-organization", {
    u_id,
    Ime,
    Tip,
    Druge_info
  }, { withCredentials: true })
  .then(res => {
    if (res.data.success) {
      alert("Organization created successfully!");
    } else {
      alert("Failed: " + res.data.message);
    }
  })
  .catch(err => {
    console.error("Org creation error:", err);
    alert("Something went wrong.");
  });
};

  componentDidMount() {
    if (this.props.user?.u_id) {
      axios
        .get(`http://88.200.63.148:3947/users/has-organization/${this.props.user.u_id}`)
        .then((res) => {
          this.setState({ 
            hasDrustvo: res.data.hasDrustvo,
            orgName: res.data.orgName || ""
          });
        })
        .catch((err) => console.error("Org check error:", err));
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; 


  render() {
    const t = this.props.t;
    
    return (
    <div>
        <div className="card" style={{ margin: "10px" }}>
            <div className="card-body">
                <h2 className="card-title">
                    {t("loggedUser.welcome")} , {this.props.user?.Ime_priimek}!
                </h2>
            </div>
        </div>


        <div className="card" style={{ margin: "10px" }}>
            <div className="card-body">
                <h5 className="card-title">{t("loggedUser.title")}</h5>
                    <p className="card-text">
                        {t("loggedUser.becomeMem")} 
                        <br />
                        <strong>{t("loggedUser.cost")}</strong> 
                        <br />
                        {t("loggedUser.payMem")} 
                    </p>
            </div>

            {this.props.user?.Clan === 1 && this.props.user?.PLacana_clanarina === 1 && (
              <div className="alert alert-success">
                {t("loggedUser.alreadyMem")}
              </div>
            )}

            {this.props.user?.Clan === 1 && this.props.user?.PLacana_clanarina === 0 && (
              <>
              <div className="alert alert-success">
                {t("loggedUser.waitingPayment")}
              </div>
                <a
                  href="https://www.paypal.com/paypalme/gibmeurmanei/5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-warning"
                >
                  {t("loggedUser.payPal")}
                </a>
              </>
            )}

            {this.props.user?.Clan === 0 && this.props.user?.PLacana_clanarina === 0 && (
              <>
                <a
                  href="https://www.paypal.com/paypalme/gibmeurmanei/5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-warning"
                >
                  {t("loggedUser.payNow")}
                </a>

                <button
                  onClick={this.handlePayLaterClick}
                  className="btn btn-outline-warning"
                  disabled={this.state.showMembershipMessage}
                >
                  {t("loggedUser.payAtEvent")}
                </button>

                {this.state.showMembershipMessage && (
                  <div className="alert alert-success mt-3">
                    {t("loggedUser.memCard")}
                  </div>
                )}
              </>
            )}
            
        </div> 
            
        <br />

        {!this.state.hasDrustvo && (
          <div className="card" style={{ margin: "10px" }} > 
            <div className="card-body">
                <h5 className="card-title">{t("loggedUser.partOfOrg")}</h5>
                  <p className="card-text">
                        {t("loggedUser.submitOrgInfo")}
                  </p>
            </div>
          <form style={{ margin: "20px" }}>
            <div className="mb-3">
              <label className="form-label">{t("loggedUser.name")}</label>
              <input
                onChange={(e) => this.QGetTextFromField(e)}
                name="Ime"
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t("loggedUser.email")}</label>
              <input
                onChange={(e) => this.QGetTextFromField(e)}
                name="Tip"
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t("loggedUser.info")}</label>
              <textarea 
                name="Druge_info"
                onChange={(e) => this.QGetTextFromField(e)} 
                className="form-control" rows="3"></textarea>
            </div>
          </form>

          <button
            onClick={() => this.QPostSignUp()}
            style={{ margin: "10px" }}
            className="btn btn-outline-warning"
          >
            {t("loggedUser.submit")}
          </button>
        </div>
      )}

      {this.state.hasDrustvo && (
        <div className="card" style={{ margin: "10px" }}>
          <div className="card-body">
            <h5 className="card-title"> {t("loggedUser.orgRegistered")} {this.state.orgName} </h5>
              <br />
                <p className="card-text">
                  {t("loggedUser.suggestYourEvent")} 
                </p>
                <button
                  onClick={() =>
                  this.QSetViewInParent({ page: "addEvent"})}
                  className="btn btn-outline-warning"
                >
                  {t("loggedUser.suggestEvent")}
                </button>
                <br />
                <br />
                <button
                  onClick={() =>
                  this.QSetViewInParent({ page: "events"})}
                  className="btn btn-outline-warning"
                >
                  {t("loggedUser.connect")}
                </button>
        </div>
      </div>
      )}


    </div>
    );
  }
}

export default withTranslation()(LoggedUserView);