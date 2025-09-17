import React, { createContext, useState, useContext } from 'react';

const FarmContext = createContext();

export const useFarms = () => useContext(FarmContext);

export const FarmProvider = ({ children }) => {
  const [farms, setFarms] = useState([]);

  const addFarm = (farm) => {
    setFarms((prevFarms) => [...prevFarms, { ...farm, id: Date.now() }]);
  };

  const value = {
    farms,
    addFarm,
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};
