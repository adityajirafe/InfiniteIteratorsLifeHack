import { firestore } from "./firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { TOWNSHIPS } from "./geometry";

export const uploadTownships = async () => {
  const db = firestore;
  try {
    for (const township in TOWNSHIPS) {
      const { latitude, longitude } = TOWNSHIPS[township];
      const townshipRef = doc(collection(db, township), "info");
      await setDoc(townshipRef, {
        latitude,
        longitude,
      });
      console.log(`Uploaded ${township} township successfully.`);
    }
  } catch (error) {
    console.error("Error uploading townships:", error);
  }
};

// Call the function to upload the townships
// uploadTownships();
