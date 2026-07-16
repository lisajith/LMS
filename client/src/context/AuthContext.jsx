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
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {

        if (!currentUser) {
          setUser(null);
          setUserData(null);
          setLoading(false);
          return;
        }

        await currentUser.reload();

        // Ignore unverified users
        if (!currentUser.emailVerified) {
          setUser(null);
          setUserData(null);
          setLoading(false);
          return;
        }

        setUser(currentUser);

        try {

          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {

            const data = snapshot.data();

            if (!data.emailVerified) {

              await updateDoc(userRef, {
                emailVerified: true,
              });

              data.emailVerified = true;
            }

            setUserData(data);

          }

        } catch (err) {
          console.error(err);
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