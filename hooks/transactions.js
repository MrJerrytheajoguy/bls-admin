import { useState, useEffect } from "react";
import { app } from "../config/firebase";

function useTransactions() {
  const [userTransactions, setUserTransactions] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [transLoading, setTransLoading] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [successText, setSuccessText] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [status, setStatus] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(null);
  const [acctBal, setBal] = useState(null);

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

  const getUserTransactions = async (uid) => {
    console.log("uid", uid);
    setTransLoading(true);
    try {
      const tr = await db
        .collection("transactions")
        .where("owner", "==", `${uid}`)
        .get()
        .then((result) => {
          var transactions = [];
          result.forEach(function (doc) {
            transactions.push({ id: doc.id, ...doc.data() });
          });
          return transactions;
        });
      setUserTransactions(tr);
      setTransLoading(false);
      console.log("user-trans:", tr);
    } catch (err) {
      setTransLoading(false);
      console.log(err);
    }
  };

  const UpdateTransactionStatus = (owner, details) => {
    const oldBalance = acctBal || owner.accountBalance || 0;
    const newBalance =
      details.type === "deposit"
        ? parseFloat(oldBalance) + parseFloat(details.amount)
        : parseFloat(oldBalance) - parseFloat(details.amount);
    if(newBalance < 0) return;
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
    if(newBalance < 0) return;
    setTransLoading(true);
    db.collection("transactions")
      .add({
        ...details,
        status: "approved",
        owner: owner.uid,
        date: new Date().toISOString(),
        ownerDetails: {
          name: owner.displayName,
          address: owner.address1,
          city: owner.city,
          state: owner.state,
        },
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
    userTransactions,
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
    acctBal
  };
}

export default useTransactions;
