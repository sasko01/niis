import { Component } from "react";

class AddEventView extends Component {
  render() {
    return (
      <div className="card" style={{ margin: "10px" }}>
        <h3 style={{ margin: "10px" }}>Welcome Artist/Organizer</h3>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Title</label>
          <input type="text" class="form-control" placeholder="Title..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Slug</label>
          <input type="text" class="form-control" placeholder="Slug..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Text</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>
        <button className="btn btn-primary bt" style={{ margin: "10px" }}>
          Send
        </button>
      </div>
    );
  }
}

export default AddEventView;
