import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Button } from "react-bootstrap";
import useAuth from "../../../hooks/auth";
import { NavBar } from "../../../components/NavBar";
import useTransactions from "../../../hooks/transactions";
import { WithDrawal } from "../../../components/transaction-request";
import {SuccessAlert, FailureAlert} from '../../../components/alerts'

export default function Transaction() {
  const { signOut, data, error, users } = useAuth();
  const {
    withdrawalOpen,
    hideWithdrawal,
    postTransaction,
    transLoading,
    openWithdrawal,
    acctBal,
    hideAlert,
    successText,
    errorText
  } = useTransactions();

  const router = useRouter();
  const { uid } = router.query;

  const admin = data && data.uid;
  const user = users && users.find((e) => e.uid == uid);

  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard / users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar signOut={signOut} uid={admin} error={error} />
        <div className='alert-box'>
        <SuccessAlert alertText={successText} hideAlert={hideAlert} />
        <FailureAlert alertText={errorText} hideAlert={hideAlert} />
        </div>

        {!data ? (
          <div>Loading...</div>
        ) : data && !data.uid ? (
          <div className="error">
            Unauthorized access{" "}
            <Link href="/">
              <a>Login</a>
            </Link>
          </div>
        ) : null}

        <div className="authorized">
          {user && (
            <div className="row profile shadow">
              <div className="col-sm-6">
                <img
                  src={user.url}
                  alt={user.displayName}
                  width="100%"
                  className="thumbnail"
                />
                <p className="p-2">{user.displayName}</p>
              </div>
              <div className="col-sm-6">
                <div className="p-2">
                  ACCOUNT NUMBER:{" "}
                  <span className="p-2 shadow-sm">{user.phoneNumber}</span>
                </div>
                <div className="p-2">
                  ACCOUNT BALANCE:{" "}
                  <span className="p-2 shadow-sm">
                    {acctBal || user.accountBalance || 0.0}
                  </span>
                </div>
                <div className="p-2">
                  ADDRESS: <span className="p-2">{user.address1}</span>
                </div>
                <div className="p-2">
                  LOCATION:{" "}
                  <span className="p-2">
                    {user.state} {user.city}
                  </span>
                </div>
                <div className="p-2">
                  <Button style={{width: '100%'}} variant='secondary'>
                    <Link href={`${uid}/transactions`}>
                      <a>view all user transactions</a>
                    </Link>
                  </Button>
                </div>
                <div className="p-2">
                  <Button variant='success' onClick={() => openWithdrawal()} style={{width: '100%'}}>Withdraw cash for user</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <WithDrawal
          user={user}
          withdrawalOpen={withdrawalOpen}
          hideWithdrawal={hideWithdrawal}
          postTransaction={postTransaction}
          transLoading={transLoading}
        />
      </main>

      <footer>
        <div>
          © BetterlifeSavings {new Date().getFullYear()}. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: "Roboto", sans-serif;
        }

        main {
          padding: 3rem 0 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .error a {
          background: #bbdefb;
          padding: 10px 20px;
          marging: 15px;
          margin-left: 25px;
          border-radius: 4px;
        }

        .error {
          line-height: 1.15;
          color: #ff5252;
          border: 1px solid #ff8a80;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 2.5em;
        }

        .error,
        .description {
          text-align: center;
        }

        .profile {
          margin: ${successText || errorText ? '0' : '80px 0'};
          padding: 20px !important;
        }
        .authorized {
          display: ${data && data.uid ? "block" : "none"};
          font-size: 0.9rem;
        }
        div.p-2,
        p.p-2 {
          font-weight: bold;
        }
        .alert-box{
          margin: 60px 0 15px 0;
          display: ${successText || errorText ? 'block' : 'none'};
        }
      `}</style>
    </div>
  );
}
