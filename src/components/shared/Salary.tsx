import { Form } from "react-bootstrap";

function Salary() {
  return (
    <>
      <div className="col-lg-12 col-md-12">
        <div className="form-group">
          <label>Started Working From</label>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
              <Form.Control as="select">
                <option>2018</option>
                <option>2017</option>
                <option>2016</option>
                <option>2015</option>
                <option>2014</option>
                <option>2013</option>
                <option>2012</option>
                <option>2011</option>
                <option>2010</option>
                <option>2009</option>
                <option>2008</option>
                <option>2007</option>
                <option>2006</option>
                <option>2005</option>
                <option>2004</option>
                <option>2003</option>
                <option>2002</option>
                <option>2001</option>
              </Form.Control>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
              <Form.Control as="select">
                <option>january</option>
                <option>february</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>Jun</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </Form.Control>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-12">
        <div className="form-group">
          <label>Current Salary</label>
          <div className="row">
            <div className="col-lg-2 col-md-2 col-sm-2 col-2">
              <div className="form-group">
                <Form.Control as="select" placeholder="Currency" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Salary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Salary;
