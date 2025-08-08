import { Component } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

class AboutView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pastEvents: []
    };
  }

  QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; 


  componentDidMount() {
   axios.get("http://88.200.63.148:3947/event/past")
    .then(res => {
      console.log("Received past events:", res.data); 
      this.setState({ pastEvents: res.data });
    })
    .catch(err => {
      console.error("Failed to fetch past events:", err);
    });
  }

  render() {
    const t = this.props.t;

    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">{t("about.aboutUs")} </h5>
          <p className="card-text">
            {t("about.niIs")}
            <br/>
            {t("about.pastEventsDesc")} 
            <br/>
            {t("about.contact")}  <strong>neverin.trieste@gmail.com</strong>
          </p>
        </div>
        
        <br/>

         <div className="card border-secondary mb-3" 
          style={{ margin: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
          <h5 className="card-header">{t("about.pastEvents")}</h5>
          {this.state.pastEvents.length > 0 ? (
            this.state.pastEvents.map(d => (
              <div className="col" key={d.d_id}>
                <div className="card" style={{ margin: "10px" }}>
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
                    {t("about.readMore")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="card-text" style={{ margin: "10px" }}>
              No past events found.
            </p>
          )}
        </div>        

      </div>
    );
  }
}


export default withTranslation()(AboutView);