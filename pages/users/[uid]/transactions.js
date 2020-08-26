import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import useAuth from "../../../hooks/auth";
import useTransactions from "../../../hooks/transactions";
import { NavBar } from "../../../components/NavBar";
import { app } from "../../../config/firebase";
import {
  Deposit,
  Withdrawal,
  WithDrawal,
} from "../../../components/transaction-request";
import { Button } from "react-bootstrap";

export default function Transactions() {
  const router = useRouter();
  const { signOut, data, error, transactions, users } = useAuth();
  const {
    userTransactions,
    getUserTransactions,
    depositOpen,
    hideDeposit,
    openDeposit,
    postTransaction,
    transLoading,
  } = useTransactions();
  const { db } = app;
  const { uid } = router.query;

  useEffect(() => {
    const { uid } = router.query;
    getUserTransactions(uid);
  }, [db, users]);
  console.log(userTransactions);
  //const userTransactions = transactions && transactions.filter(e=> e.owner === uid);
  const user = users && users.find((e) => e.uid == uid);

  const sortTransactions = (transactions) =>
    transactions.sort(function (a, b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });

  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard / transactions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar signOut={signOut} uid={uid} error={error} />

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
          {user && userTransactions && !!userTransactions.length && (
            <p className="description">
              Transactions for {user.displayName} <span>&#8680;</span>{" "}
              {user.phoneNumber}
            </p>
          )}
          {user && userTransactions && !userTransactions.length && (
            <div>{user.displayName} client has no transactions yet</div>
          )}

          <div className="add-new py-2">
            <Button size='sm' onClick={openDeposit}> + New Deposit</Button>
          </div>
          <div className="users">
            {userTransactions &&
              sortTransactions(userTransactions)
                .reverse()
                .map((e, i) => (
                  <Link href={`/transactions/${e.id}`} key={e.owner + i}>
                    <a className="row shadow-sm transaction-card">
                      <div className="col-sm-6 details">
                        <div>{new Date(e.date).toDateString()}</div>
                        <div>
                          Owner: <strong>{e.ownerDetails.name}</strong>
                        </div>
                        <div>
                          Location: <strong>{e.ownerDetails.city}</strong>
                        </div>
                      </div>
                      <div className="col-sm-6 details">
                        <div>
                          Type: <strong>{e.type}</strong>
                        </div>
                        <div>
                          Amount: <strong>&#8358;{e.amount}</strong>
                        </div>
                        <div>
                          status:{" "}
                          <span
                            className={`badge ${
                              e.status ? "badge-success" : "badge-secondary"
                            }`}
                          >
                            {e.status || "requested"}
                          </span>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
          </div>
        </div>
        <Deposit
          user={user}
          depositOpen={depositOpen}
          hideDeposit={hideDeposit}
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
          font-family: 'Roboto', sans-serif;
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

        .error a{
          background: #bbdefb;
          padding: 10px 20px;
          marging: 15px;
          margin-left: 25px;
          border-radius: 4px;
        }

        .error {
          line-height: 1.15;
          color: #ff5252 ;
          border: 1px solid #ff8a80;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 2.5em;
        }

        .error,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          padding: 5px 20px;
          border-radius: 10px;
          margin-top: 2.5em;
        }
        .description span{
          padding 0 10px;
        }

        .authorized{
          display: ${data && data.uid ? "block" : "none"}
        }

        .transaction-card {
           width: 100%;
           margin: 30px 0;
           padding: 20px;
           border: 1px solid #eaeaea;
        }
        
        .details div{
            margin: 10px 0;
            letter-spacing: 1px;
        }
        
        .transaction-card:hover,
        .transaction-card:focus,
        .transaction-card:active {
          color: #0070f3;
          border-color: #0070f3;
        }
        
        .logout{
          position: fixed;
          top:15px;
          right: 15px;
        }
        .add-new{
          float: right;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
          @media(max-width: 576px){
              .card-items{
                  padding-left: 20px;
              }
              .card{
                  width: 70vw;
              }
          }
        }
      `}</style>
    </div>
  );
}

/*export async function getStaticProps(context) {
  
    try {
      
      return {
        props: {result} 
      }
    } catch (error) {
      console.log('errresponse:',error.response.data)
      return {
        props: {result: error.response.data} 
      }
    }

}*/
