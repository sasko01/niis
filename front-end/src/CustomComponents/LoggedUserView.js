import { Component } from "react";
import axios from "axios";

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
    return (
    <div>
        <div className="card" style={{ margin: "10px" }}>
            <div className="card-body">
                <h2 className="card-title">
                    Welcome, {this.props.user?.Ime_priimek}!
                </h2>
            </div>
        </div>


        <div className="card" style={{ margin: "10px" }}>
            <div className="card-body">
                <h5 className="card-title">Become a Never In member</h5>
                    <p className="card-text">
                        By becoming a Never In member you can enjoy 
                        exclusive discounts for our events, get early access to 
                        tickets and sometimes also other surprises ;) <br />
                        <strong>Cost: 5€/year</strong> <br />
                        You can pay online using PayPal or at our next event; 
                        you'll become a member once we confirm the payment.  
                    </p>
            </div>

            {this.props.user?.Clan === 1 && this.props.user?.PLacana_clanarina === 1 && (
              <div className="alert alert-success">
                You're already a Never In member! Hope to see you at our next event :)
              </div>
            )}

            {this.props.user?.Clan === 1 && this.props.user?.PLacana_clanarina === 0 && (
              <>
              <div className="alert alert-success">
                We're just waiting for your payment: you can do it right now ;) 
              </div>
                <a
                  href="https://www.paypal.com/paypalme/gibmeurmanei/5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-warning"
                >
                  Complete Payment with PayPal
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
                  Pay now
                </a>

                <button
                  onClick={this.handlePayLaterClick}
                  className="btn btn-outline-warning"
                  disabled={this.state.showMembershipMessage}
                >
                  Pay at our next event
                </button>

                {this.state.showMembershipMessage && (
                  <div className="alert alert-success mt-3">
                    Your membership card will be waiting for you at our next event!
                  </div>
                )}
              </>
            )}
            
        </div> 
            
        <br />

        {!this.state.hasDrustvo && (
          <div className="card" style={{ margin: "10px" }} > 
            <div className="card-body">
                <h5 className="card-title">Are you part of an organization and want some help?</h5>
                  <p className="card-text">
                        Submit your info and you can suggest your own ideas to Never In, or you can connect with 
                        other realities and help each other out!
                  </p>
            </div>
          <form style={{ margin: "20px" }}>
            <div className="mb-3">
              <label className="form-label">Name</label>
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
              <label className="form-label">Type (e.g. no profit organization, mladinski klub...)</label>
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
              <label className="form-label">Other info (attach your links)</label>
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
            Submit
          </button>
        </div>
      )}

      {this.state.hasDrustvo && (
        <div className="card" style={{ margin: "10px" }}>
          <div className="card-body">
            <h5 className="card-title"> You’ve registered your organization: {this.state.orgName} </h5>
              <br />
                <p className="card-text">
                  Now you can suggest us your event or connect with others to create something unique! 
                </p>
                <button
                  onClick={() =>
                  this.QSetViewInParent({ page: "addEvent"})}
                  className="btn btn-outline-warning"
                >
                  Suggest Event
                </button>
                <br />
                <br />
                <button
                  onClick={() =>
                  this.QSetViewInParent({ page: "events"})}
                  className="btn btn-outline-warning"
                >
                  Connect with others
                </button>
        </div>
      </div>
      )}


    </div>
    );
  }
}

export default LoggedUserView;