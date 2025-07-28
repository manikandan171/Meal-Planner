import React, { useEffect, useState } from 'react';
import { getGroceryList } from '../api';
import './GroceryList.css';

const GroceryList = () => {
  const [grocery, setGrocery] = useState([]);
  const [checked, setChecked] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrocery();
  }, []);

  const fetchGrocery = async () => {
    setError('');
    try {
      const res = await getGroceryList();
      setGrocery(res.data);
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    }
  };

  const handleCheck = name => {
    setChecked(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="grocerylist-main">
      <h2>Grocery List</h2>
      {error && <div className="error-msg">{error}</div>}
      <ul className="grocery-list">
        {grocery.map(item => (
          <li key={item.name} className={checked[item.name] ? 'checked' : ''}>
            <label>
              <input type="checkbox" checked={!!checked[item.name]} onChange={() => handleCheck(item.name)} />
              <strong>{item.name}</strong>: {item.quantities.join(', ')}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList; 