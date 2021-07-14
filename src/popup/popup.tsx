import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import { fetchTimeAndDistance } from '../utils/api';
const App: React.FC<{}> = () => {
  useEffect(() => {
    fetchTimeAndDistance('porirua', 'pipitea')
      .then((data) => console.log(data.rows[0].elements[0].distance.text))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <p>PropMate</p>
    </div>
  );
};
const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
