import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (currentUser?.emailVerified) {
            setUser(currentUser);
          } else {
            setUser(null);
          }

          if (currentUser) {

            try {

              const snapshot =
                await getDoc(
                  doc(
                    db,
                    "users",
                    currentUser.uid
                  )
                );

              if (snapshot.exists()) {
                setUserData(snapshot.data());
              } else {
                setUserData(null);
              }

            } catch (err) {
              console.error(err);
            }

          } else {

            setUserData(null);

          }

          setLoading(false);

        }
      );

    return unsubscribe;

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