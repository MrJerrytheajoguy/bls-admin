import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Image, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import useAuth from "../../hooks/auth";
import useMessages from "../../hooks/messages";
import { NavBar } from "../../components/NavBar";

export default function Transactions() {
  const [messages, setMessages] = useState([]);
  const { signOut, data, error } = useAuth();
  const { getAllMessages, hasMore } = useMessages();
  useEffect(() => {
    data && data.uid && getAllMessages().then((res) => setMessages(res));
  }, [data]);

  console.log("message-update:", messages);
  console.log(hasMore);
  const next = () => {
    getAllMessages().then((res) => setMessages([...messages, ...res]));
  };
  const uid = data && data.uid;

  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard / messages</title>
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
          <p className="description">Messages from clients</p>

          <div className="users">
            <InfiniteScroll
              dataLength={messages.length}
              next={next}
              hasMore={hasMore}
              loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>You have seen it all</b>
                </p>
              }
            >
              {messages.map((e, i) => (
                <div key={e.id}>
                  <div className="row shadow-sm transaction-card">
                    <div className="col-sm-6 details">
                      <div>{new Date(e.date).toDateString()}</div>
                      <div>
                        Sender: <strong>{e.senderInfo.displayName}</strong>
                      </div>
                      <Image src={e.senderInfo.url} thumbnail width={60} />
                      <div>
                        Location: <strong>{e.senderInfo.city}</strong>
                      </div>
                    </div>
                    <div className="col-sm-6 details">
                      <div>
                        Subject: <strong>{e.subject}</strong>
                      </div>
                      <div>
                        Message: <strong>{e.message}</strong>
                      </div>
                      <div>
                        status:{" "}
                        <Link href={`/notifications/${e.id}`}>
                          <a
                            className={`status badge ${
                              e.status ? "badge-success" : "badge-secondary"
                            }`}
                          >
                            {e.status || "unresolved"}
                          </a>
                        </Link>
                      </div>
                      <div>
                        <Link href={`/notifications/${e.id}`}>
                          <a className="badge badge-info">
                            {e.replies && e.replies.length}
                            <i className="material-icons">reply</i>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
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

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          padding: 5px 20px;
          border-radius: 10px;
          margin-top: 2.5em;
        }

        .authorized {
          display: ${data && data.uid ? "block" : "none"};
        }

        .transaction-card {
          width: 100%;
          margin: 30px 0;
          padding: 20px;
          border: 1px solid #eaeaea;
        }

        .details div {
          margin: 10px 0;
          letter-spacing: 1px;
        }

        .transaction-card:hover,
        .transaction-card:focus,
        .transaction-card:active {
          color: #0070f3;
        }

        .logout {
          position: fixed;
          top: 15px;
          right: 15px;
        }
        .badge.badge-info {
          color: white;
        }
        .status.badge {
          cursor: pointer;
          color: white;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
          @media (max-width: 576px) {
            .card-items {
              padding-left: 20px;
            }
            .card {
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
