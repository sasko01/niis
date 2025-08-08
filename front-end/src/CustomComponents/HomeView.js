import { Component } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

class HomeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      reservedEvents: [],
      paidEvents: [],
      loggedIn: false,
      paidMembership: 0
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
          axios.get(`http://88.200.63.148:3947/users/paid-tickets/${userId}`)
          .then(res3 => {
            if (res3.data.success) {
              const paidIds = res3.data.paid.map(r => r.d_id);
              this.setState({ paidEvents: paidIds });
            }
          })
          .catch(err => {
            console.error("Failed to fetch paid tickets:", err);
          })
          .catch(err => {
            console.error("Failed to fetch reservations:", err);
          });
          axios.get(`http://88.200.63.148:3947/users/${userId}`)
          .then(res4 => {
            if (res4.data.success && res4.data.user) {
              this.setState({ paidMembership: res4.data.user.PLacana_clanarina });
            }
          })
          .catch(err => {
            console.error("Failed to fetch user info:", err);
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
    const t = this.props.t;

    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">{t("home.welcome")}</h5>
            <a
            href="https://www.instagram.com/neverin.trieste/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-danger"
            style={{ margin: "10px" }}
            >
              {t("home.followIg")}
            </a>
            <a
            href="https://www.facebook.com/neverin.trieste?locale=it_IT"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
            style={{ margin: "10px" }}
            >
              {t("home.followFb")}
            </a>
            <p className="card-text">
              {t("home.upcomingEvents")}
            </p>
        </div>

        <br />

        <div className="card" 
        style={{ margin: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
          {this.state.events.map(d => {
            const isMember = this.state.paidMembership === 1;
            const price = isMember ? d.Cena_clan : d.Cena;
            const paypalLink = `https://www.paypal.com/paypalme/gibmeurmanei/${price}`;
            const ticketsLeft = d.St_vseh_vstopnic - d.Stevilo_ostalih_vstopnic;

            return (
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
                    <p className="card-text">{t("home.price")} €{d.Cena}</p>
                    <p className="card-text">{t("home.priceForMem")} €{d.Cena_clan}</p>
                    <p className="card-text">{t("home.tixLeft")} {d.Stevilo_ostalih_vstopnic}</p>
                  </div>

                  <button
                    onClick={() =>
                      this.QSetViewInParent({ page: "singleEvent", id: d.d_id })
                    }
                    style={{ margin: "10px" }}
                    className="btn btn-outline-warning"
                  >
                    {t("home.readMore")}
                  </button>
                  <br />

                  
                  {this.state.loggedIn ? (
                    ticketsLeft <= 0 ? (
                      <p style={{ color: "red", fontWeight: "bold", margin: "10px" }}>
                        {t("home.soldOut")}
                      </p>
                    ) : this.state.reservedEvents.includes(d.d_id) ? (
                      <p style={{ color: "green", fontWeight: "bold", margin: "10px" }}>
                        {t("home.alreadyReserved")}
                      </p>
                    ) : (
                      <button
                        onClick={() => this.reserveTicket(d.d_id)}
                        style={{ margin: "10px" }}
                        className="btn btn-outline-warning"
                      >
                        {t("home.reserveTicket")}
                      </button>
                    )
                  ) : (
                    <p style={{ color: "orange", fontWeight: "bold", margin: "10px" }}>
                      {t("home.mustLoginReserve")}
                    </p>
                  )}

                  <br />

                  {this.state.loggedIn ? (
                    ticketsLeft <= 0 ? (
                      <p style={{ color: "red", fontWeight: "bold", margin: "10px" }}>
                        {t("home.soldOut")}
                      </p>
                    ) : this.state.paidEvents.includes(d.d_id) ? (
                      <p style={{ color: "green", fontWeight: "bold", margin: "10px" }}>
                        {t("home.alreadyPaid")} {d.Ime_dogodka} :)
                      </p>
                    ) : (
                      <a
                        href={paypalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-warning"
                        style={{ margin: "10px" }}
                      >
                        {t("home.payNow")}
                      </a>
                    )
                  ) : (
                    <p style={{ color: "orange", fontWeight: "bold", margin: "10px" }}>
                      {t("home.mustLoginPay")}
                    </p>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>

       

    );
  }
}

export default withTranslation()(HomeView);