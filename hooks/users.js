import { useState, useEffect } from "react";
import { app } from "../config/firebase";
import useAuth from './auth'

function useGetUsers() {
  const [users, setUsers] = useState(null);
  const {data} = useAuth()
  const { auth, db } = app;
  const user = auth.currentUser;

  useEffect(() => {
   const unsubscribe = db
      .collection("users")
      .where("role", "==", 0)
      .onSnapshot(function (querySnapshot) {
        const users = [];
        querySnapshot.forEach(function (doc) {
          users.push({ id: doc.id, ...doc.data() });
        });
        setUsers(users);
      })
    return () => unsubscribe();
  }, [db]);

 
  return {
    users
  };
}

export default useGetUsers;
