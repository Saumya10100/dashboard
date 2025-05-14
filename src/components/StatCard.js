import React from 'react';

const StatCard = ({ icon, title, value }) => {
  return (
    <div
      style={{
        width: '22%',
        height: '150px',
        backgroundColor: '#262D47',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ marginLeft: '30px' }}>
        <img src={icon} alt={title} style={{ width: '60px', height: '60px' }} />
      </div>
      <div style={{ marginLeft: '30px' }}>
        <h3 style={{ textAlign: 'left', color: '#fff', margin: '10px 0' }}>{title}</h3>
        <p style={{ textAlign: 'left', color: '#fff', marginTop: '8px' }}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;