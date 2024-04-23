import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Main from "./main";


function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/data')
      .then(response => {
        setData(response.data.message);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      {/* <h1>React and Node.js Integration</h1>
      <p>Message from the server: {data}</p> */}
      <Main/>
    </div>
  );
}

export default App;