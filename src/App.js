import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'

const apiKey='28cda9f510ac246b0d39278a022ea6c8';
const appKey='40507486bac0e7fde01b629877bd6050477ebf18';

const App = () => {
  const [data, setData] = useState([]);
  const [createMonitorFormVisible, setCreateMonitorFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    name: '',
    query: '',
    type: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/v1/monitor',{
        headers: {
          'DD-API-KEY': apiKey,
          'DD-APPLICATION-KEY': appKey,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createMonitor = async () => {
    try {
      const response = await axios.post('/api/v1/monitor', {
        message: formData.message,
        name: formData.name,
        query: formData.query,
        type: formData.type,
      },{
        headers: {
          'DD-API-KEY': apiKey,
          'DD-APPLICATION-KEY': appKey,
        },
      });
      const newMonitor = response.data;
      setData([...data, newMonitor]);
      setCreateMonitorFormVisible(false); // Hide the form after successful creation
    } catch (error) {
      console.error('Error creating monitor:', error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMonitor();
  };

  return (
    <div>
      <h1>React App with DataDog Integration</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Query</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((monitor) => (
            <tr key={monitor.id}>
              <td>{monitor.id}</td>
              <td>{monitor.name}</td>
              <td>{monitor.query}</td>
              <td>{monitor.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setCreateMonitorFormVisible(true)}>Create New Monitor</button>
      {createMonitorFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setCreateMonitorFormVisible(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
              <label>
                Message:
                <input type="text" name="message" value={formData.message} onChange={handleFormChange} />
              </label>
              <label>
                Name:

                <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
              </label>
              <label>
                Query:
                <input type="text" name="query" value={formData.query} onChange={handleFormChange} />
              </label>
              <label>
                Type:
                <input type="text" name="type" value={formData.type} onChange={handleFormChange} />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
