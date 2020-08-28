import { useState, useEffect } from "react";
import { app } from "../config/firebase";

function useTransactions() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [transLoading, setTransLoading] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [successText, setSuccessText] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [status, setStatus] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(null);
  const [acctBal, setBal] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { db } = app;

  const hideDeposit = () => setDepositOpen(false);
  const openDeposit = () => setDepositOpen(true);
  const hideWithdrawal = () => setWithdrawalOpen(false);
  const openWithdrawal = () => setWithdrawalOpen(true);
  const hideUpdateModal = () => setUpdateOpen(false);
  const openUpdateModal = () => setUpdateOpen(true);
  const hideAlert = () => {
    setSuccessText(null);
    setErrorText(null);
  };

  const getAllTransactions = async function () {
    const transactions = lastVisible
      ? db
          .collection("transactions")
          .orderBy("date", "desc")
          .startAfter(lastVisible)
          .limit(10)
      : db.collection("transactions").orderBy("date", "desc").limit(10);
    return transactions.get().then(function (documentSnapshots) {
      if (!documentSnapshots.docs.length) setHasMore(false);
      var lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisible);
      const transactions = [];
      documentSnapshots.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });

      return transactions;
    });
  };

  const getUserTransactions = async (uid) => {
    return db
      .collection("transactions")
      .where("owner", "==", `${uid}`)
      .get()
      .then((result) => result.docs.map(e=>({id: e.id, ...e.data()})))
      .catch((error) => {
        console.log(error);
      });
  };

  const getSingleTransaction = async (id) => {
    console.log('helllo')
    return db
      .collection("transactions")
      .doc(id)
      .get()
      .then((res) => ({ id: res.id, ...res.data() }));
  };

  const UpdateTransactionStatus = (owner, details) => {
    const oldBalance = acctBal || owner.accountBalance || 0;
    const newBalance =
      details.type === "deposit"
        ? parseFloat(oldBalance) + parseFloat(details.amount)
        : parseFloat(oldBalance) - parseFloat(details.amount);
    if (newBalance < 0) return;
    setTransLoading(true);
    db.collection("transactions")
      .doc(details.id)
      .set(
        {
          status: "approved",
        },
        { merge: true }
      )
      .then(() => {
        db.collection("users")
          .doc(owner.uid)
          .set(
            {
              accountBalance: newBalance,
            },
            { merge: true }
          )
          .then(function () {
            setTransLoading(false);
            setStatus("approved");
            hideUpdateModal();
            setSuccessText(
              `Transaction successfully updated. Account balance for ${owner.phoneNumber} updated from ${oldBalance} to ${newBalance}`
            );
          });
      })
      .catch(function (error) {
        setTransLoading(false);
        hideUpdateModal();
        setErrorText("Error updating transaction: ");
        console.log(error);
      });
  };

  const postTransaction = async ({ details, owner }) => {
    const oldBalance = acctBal || owner.accountBalance || 0;
    const newBalance =
      details.type === "deposit"
        ? parseFloat(oldBalance) + parseFloat(details.amount)
        : parseFloat(oldBalance) - parseFloat(details.amount);
    if (newBalance < 0) return;
    setTransLoading(true);
    db.collection("transactions")
      .add({
        ...details,
        status: "approved",
        owner: owner.uid,
        date: new Date().toISOString(),
        ownerDetails: {
          name: owner.displayName,
          location: owner.city
        }
      })
      .then(() => {
        db.collection("users")
          .doc(owner.uid)
          .set(
            {
              accountBalance: newBalance,
            },
            { merge: true }
          )
          .then(function () {
            setBal(newBalance);
            setTransLoading(false);
            hideDeposit();
            hideWithdrawal();
            getUserTransactions(owner.uid);
            setSuccessText(
              `Transaction successful. Account balance for ${owner.phoneNumber} updated from ${oldBalance} to ${newBalance}`
            );
          });
      })
      .catch(function (error) {
        setTransLoading(false);
        setErrorText("Error adding transaction: ");
      });
  };

  return {
    postTransaction,
    depositOpen,
    hideDeposit,
    openDeposit,
    transLoading,
    withdrawalOpen,
    hideWithdrawal,
    openWithdrawal,
    getUserTransactions,
    UpdateTransactionStatus,
    hideAlert,
    successText,
    errorText,
    status,
    updateOpen,
    hideUpdateModal,
    openUpdateModal,
    acctBal,
    hasMore,
    getAllTransactions,
    getSingleTransaction,
  };
}

export default useTransactions;
