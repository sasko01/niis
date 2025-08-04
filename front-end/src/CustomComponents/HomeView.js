import { Component } from "react";
import axios from "axios";

class HomeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      reservedEvents: [],
      loggedIn: false
    };
  }

   QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; 

  componentDidMount() {
  axios.get("http://88.200.63.148:3947/event?accepted=1")
    .then(res => {
      this.setState({ events: res.data });

      const userId = localStorage.getItem("u_id");
      if (userId && userId !== "null" && userId !== "undefined") {
        this.setState({ loggedIn: true });
        axios.get(`http://88.200.63.148:3947/users/reservations/${userId}`)
          .then(res2 => {
            if (res2.data.success) {
              const reservedIds = res2.data.reservations.map(r => r.d_id);
              this.setState({ reservedEvents: reservedIds });
            }
          })
          .catch(err => {
            console.error("Failed to fetch reservations:", err);
          });
      } else {
        this.setState({ loggedIn: false, reservedEvents: [] });
      }
    });
}

  reserveTicket = (eventId) => {
  const userId = localStorage.getItem("u_id"); 
  if (!userId) {
    alert("You must be logged in to reserve a ticket.");
    return;
  }
  axios.post("http://88.200.63.148:3947/users/reserve", {
    d_id: eventId,
    u_id: userId
  })
  .then((res) => {
    alert("Ticket reserved successfully!");
     this.setState(prevState => ({
      reservedEvents: [...prevState.reservedEvents, eventId],
       loggedIn: true
    }));
  })
  .catch((err) => {
    console.error(err);
    alert("Failed to reserve ticket.");
  });
};

 

  render() {
    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">Welcome to the Never In site!</h5>
          <p className="card-text">

          </p>
        </div>

        <br />

        <div className="card border-secondary mb-3" 
        style={{ margin: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
          {this.state.events.map(d => (
            <div className="col" key={d.d_id}>
              <div className="card">
                <div className="card-body">
                    {d.Flyer && (
                      <img
                        src={`/images/${d.Flyer}`}
                        alt={`${d.Ime_dogodka} flyer`}
                        className="img-fluid d-block mx-auto mb-2"
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                    )}
                  <h5 className="card-title">{d.Ime_dogodka}</h5>
                  <p className="card-text">{d.Lokacija}</p>
                </div>
                <button
                    onClick={() =>
                      this.QSetViewInParent({ page: "singleEvent", id: d.d_id })
                    }
                    style={{ margin: "10px" }}
                    className="btn btn-outline-warning"
                  >
                    Read more
                  </button>
                  <br />
                  {this.state.loggedIn && this.state.reservedEvents.includes(d.d_id) ? (
                    <p style={{ color: "green", fontWeight: "bold", margin: "10px" }}>
                      You already reserved your ticket for this event! Can't wait to see you :)
                    </p>) : (
                    <button
                      onClick={() => this.reserveTicket(d.d_id)}
                      style={{ margin: "10px" }}
                      className="btn btn-outline-warning"
                    >
                      Reserve your ticket 
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

      </div>

       

    );
  }
}

export default HomeView;
