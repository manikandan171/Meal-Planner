import React, { useEffect } from 'react';

const User = () => {
  const user = { name: 'xabi', age: 40, dep: 'IT' };

  useEffect(() => {
    console.log('User component has mounted.');
    return () => {
      console.log('User component will unmount.');
    };
  }, []); 
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>User Information</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Department:</strong> {user.dep}</p>
      </div>
    </div>
  );
};

export default User; 