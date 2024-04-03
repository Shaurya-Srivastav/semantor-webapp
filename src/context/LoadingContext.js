import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // Track the action
  const [loadingResultId, setLoadingResultId] = useState(null); // Track the ID of the component

  const startLoading = (action, resultId) => {
    setIsLoading(true);
    setLoadingAction(action); // Set the current action
    setLoadingResultId(resultId); // Set the ID of the component that initiated the action
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingAction(null); // Reset the action
    setLoadingResultId(null); // Reset the component ID
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      startLoading,
      stopLoading,
      loadingAction,
      loadingResultId // Make sure to expose this in the value object
    }}>
      {children}
    </LoadingContext.Provider>
  );
};
