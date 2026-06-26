function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded">
            <div className="card-body">
              <h6 className="text-muted">Today's Weather</h6>
              <h3>28°C</h3>
              <p className="text-success">Good farming conditions</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded">
            <div className="card-body">
              <h6 className="text-muted">Recommended Crop</h6>
              <h3>Rice</h3>
              <p className="text-success">High suitability</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded">
            <div className="card-body">
              <h6 className="text-muted">Predicted Yield</h6>
              <h3>4.5 Tons</h3>
              <p className="text-success">Expected good harvest</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded">
            <div className="card-body">
              <h6 className="text-muted">Soil Health</h6>
              <h3>82%</h3>
              <p className="text-success">Healthy soil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;