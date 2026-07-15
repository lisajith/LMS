import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let unsubscribeFirestore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);

      if (currentUser) {

        unsubscribeFirestore = onSnapshot(

          doc(db, "users", currentUser.uid),

          (snapshot) => {

            if (snapshot.exists()) {
              setUserData(snapshot.data());
            }

            setLoading(false);

          }

        );

      } else {

        setUser(null);
        setUserData(null);
        setLoading(false);

      }

    });

    return () => {

      unsubscribeAuth();

      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }

    };

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        setUserData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}