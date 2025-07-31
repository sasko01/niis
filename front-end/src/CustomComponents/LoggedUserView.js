import { Component } from "react";
import axios from "axios";

class LoggedUserView extends Component {

constructor(props) {
  super(props);
  this.state = {
    showMembershipMessage: false
  };
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
                        Cost: 5€/year <br />
                        You can pay online using PayPal or at our next event; 
                        you'll become a member once we confirm the payment.  
                    </p>
            </div>
            <button
                href="https://www.paypal.com/paypalme/YOUR_USERNAME/5"
                onClick={this.handlePayLaterClick}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary bt"
            >
                Pay now with PayPal
            </button>
            <button
                onClick={this.handlePayLaterClick}
                className="btn btn-primary bt"
            >
                Pay at our next event
            </button>
            {this.state.showMembershipMessage && (
                <div className="alert alert-success mt-3">
                    Your membership card will be waiting for you at our next event!
                </div>
            )}
        </div> 
    </div>
    );
  }
}

export default LoggedUserView;