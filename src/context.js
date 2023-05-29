import React, { useState, useContext, useEffect } from "react";
import { firestore } from "./firebase";
import { updateDoc, doc, collection } from "firebase/firestore";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [township, setTownship] = useState("");

  useEffect(() => {
    // Update the address in the Firestore document when it changes locally
    if (address !== "") {
      const db = firestore;
      const usersCollectionRef = collection(db, "users");
      const documentRef = doc(usersCollectionRef, email);
      updateAddressInFirestore(documentRef, address);
    }
  }, [address, email]);

  useEffect(() => {
    // Update the address in the Firestore document when it changes locally
    if (township !== "") {
      const db = firestore;
      const usersCollectionRef = collection(db, "users");
      const documentRef = doc(usersCollectionRef, email);
      updateTownshipInFirestore(documentRef, township);
    }
  }, [township, email]);

  const updateAddressInFirestore = async (documentRef, newAddress) => {
    try {
      await updateDoc(documentRef, { address: newAddress });
      console.log("Address updated in Firestore");
    } catch (error) {
      console.log("Error updating address:", error);
    }
  };

  const updateTownshipInFirestore = async (documentRef, newTownship) => {
    try {
      await updateDoc(documentRef, { township: newTownship });
      console.log("Township updated in Firestore");
    } catch (error) {
      console.log("Error updating township:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{ email, setEmail, address, setAddress, township, setTownship }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
