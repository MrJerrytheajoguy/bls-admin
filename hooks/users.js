import { useState } from "react";
import { app } from "../config/firebase";

function useUsers() {
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { db } = app;

  const getAllUsers = async function () {
    const users = lastVisible
      ? db
          .collection("users")
          .orderBy("displayName", "desc")
          .startAfter(lastVisible)
          .limit(10)
      : db.collection("users").orderBy("displayName", "desc").limit(10);
    return users.get().then(function (documentSnapshots) {
      if (!documentSnapshots.docs.length) setHasMore(false);
      var lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisible);
      const users = [];
      documentSnapshots.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    });
  };

  const getSingleUser = async (uid) => {
    return db
      .collection("users")
      .doc(uid)
      .get()
      .then((res) => ({ id: res.id, ...res.data() }));
  };


  return {
    getAllUsers,
    hasMore,
    getSingleUser
  };
}

export default useUsers;
