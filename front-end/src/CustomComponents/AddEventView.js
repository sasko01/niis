import { Component } from "react";
import axios from "axios";

class AddEventView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: {}
    };
  }

  QGetTextFromField = (e) => {
    this.setState(prevState => ({
      event: { ...prevState.event, [e.target.name]: e.target.value },
    }));
  };

  QPostEvent = () => {
    axios.post("http://88.200.63.148:3947/event", {
      Ime_dogodka: this.state.event.Ime_dogodka,
      Lokacija: this.state.event.Lokacija,
      Vrsta_dogodka: this.state.event.Vrsta_dogodka,
      Datum_in_ura: this.state.event.Datum_in_ura,
      Druge_info: this.state.event.Druge_info
    }).then(res => {
      console.log("Sent to server...")
    }).catch(err => {
      console.log(err)
    })
    this.props.QViewFromChild({page: "events"})
  }

  render() {
    console.log(this.state)
    return (
      <div className="card" style={{ margin: "10px" }}>
        <h3 style={{ margin: "10px" }}>Welcome Organizer!</h3>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Title</label>
          <input 
          name="Ime_dogodka"
          onChange={(e) => this.QGetTextFromField(e)} 
          type="text" class="form-control" placeholder="Title..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Location</label>
          <input 
          name="Lokacija"
          onChange={(e) => this.QGetTextFromField(e)} 
          type="text" class="form-control" placeholder="Location..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Type of event (e.g. concert)</label>
          <input 
          name="Vrsta_dogodka"
          onChange={(e) => this.QGetTextFromField(e)} 
          type="text" class="form-control" placeholder="Type..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Date of event (Note: use the year-month-day hour:min:sec format!)</label>
          <input 
          name="Datum_in_ura"
          onChange={(e) => this.QGetTextFromField(e)} 
          type="text" class="form-control" placeholder="yyyy-mm-dd hh:mm:ss" />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">About the event</label>
          <textarea 
          name="Druge_info"
          onChange={(e) => this.QGetTextFromField(e)} 
          className="form-control" rows="3"></textarea>
        </div>
        <button 
        onClick={() => this.QPostEvent()}
        className="btn btn-outline-warning" style={{ margin: "10px" }}>
          Submit
        </button>
      </div>
    );
  }
}

export default AddEventView;
