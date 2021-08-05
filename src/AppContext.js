import "firebase/firestore";

import app from "firebase/app";
import { createContext, useState } from "react";

import config from "./config.json";

const AppContext = createContext();

export const useAppContext = () => {
  if (!app.apps.length) {
    app.initializeApp(config.firebase);
  }

  const [firestore] = useState(app.firestore());

  return {
    firestore,
  };
};

export default AppContext;
