import { useState } from "react";
import { app } from "../config/firebase";

function useMessages() {
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUPdateOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { db } = app;

  const getAllMessages = async function () {
    const messages = lastVisible
      ? db
          .collection("messages")
          .orderBy("date", "desc")
          .startAfter(lastVisible)
          .limit(10)
      : db.collection("messages").orderBy("date", "desc").limit(10);
    return messages.get().then(function (documentSnapshots) {
      if (!documentSnapshots.docs.length) setHasMore(false);
      var lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisible);
      console.log("last", lastVisible);
      const messages = [];
      documentSnapshots.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      console.log(messages);
      return messages;
    });
  };

  const getSingleMessage = async (id) => {
    return db
      .collection("messages")
      .doc(id)
      .get()
      .then((res) => ({ id: res.id, ...res.data() }));
  };

  const postReply = async ({ details, replies }) => {
    setLoading(true);
    return db
      .collection("messages")
      .doc(details.id)
      .set({ replies }, { merge: true })
      .then(() => {
        db.collection("notifications")
          .add({
            title: details.title,
            body: "New message from Admin",
            date: new Date().toISOString(),
            to: details.client,
            for: details.id,
          })
          .then(() => {
            details.cb().then(() => setLoading(false));
          });
      })
      .catch((error) => console.log(error));
  };

  const updateMessageStatus = async (id, cb) => {
    setUpdateLoading(true);
    return db
      .collection("messages")
      .doc(id)
      .set({ status: "resolved" }, { merge: true })
      .then(() => {
        cb().then(() => {
          setUpdateLoading(false)
          hideUpdateModal();
        });
      });
  };

  const hideUpdateModal = () => setUPdateOpen(false);
  const showUpdateModal = () => setUPdateOpen(true);
  return {
    getAllMessages,
    hasMore,
    getSingleMessage,
    postReply,
    loading,
    updateOpen,
    updateLoading,
    hideUpdateModal,
    showUpdateModal,
    updateMessageStatus
  };
}

export default useMessages;
