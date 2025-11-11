import React from 'react';
import CreatePart from './CreatePart';
import PartList from './PartList';

const PartsContainer: React.FC = () => {
  return (
    <div>
      <h2>Parts Management</h2>
      <CreatePart />
      <PartList />
    </div>
  );
};

export default PartsContainer;
