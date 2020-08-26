import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Image } from "react-bootstrap";
import { useRouter } from "next/router";
import useAuth from "../../hooks/auth";
import useMessages from "../../hooks/messages";
import { NavBar } from "../../components/NavBar";
import ReplyForm from "../../components/messages/ReplyForm";
import { StatusModal } from "../../components/messages/StatusModal";
import { formatDate } from "../../utils";

export default function Transactions() {
  const router = useRouter();
  const [message, setMessage] = useState({});
  const { signOut, data, error } = useAuth();
  const {
    getSingleMessage,
    postReply,
    loading,
    updateOpen,
    updateLoading,
    hideUpdateModal,
    showUpdateModal,
    updateMessageStatus,
  } = useMessages();

  const { id } = router.query;
  useEffect(() => {
    (async function () {
      id &&
        data &&
        data.uid &&
        getSingleMessage(id).then((res) => setMessage(res));
    })();
  }, [id, data]);

  const uid = data && data.uid;

  const cb = () => getSingleMessage(id).then((res) => setMessage(res))
  const details = Object.keys(message).length && {
    id,
    cb,
    title: `RE: ${message.subject}`,
    client: message.senderInfo.uid,
    replies: message.replies || [],
  };

  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard / messages</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar signOut={signOut} uid={uid} error={error} />
        {Object.keys(message).length && (
          <StatusModal
            loading={updateLoading}
            updateOpen={updateOpen}
            hideUpdateModal={hideUpdateModal}
            update={() => updateMessageStatus(id, cb)}
          />
        )}

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
          <p className="description">Message Details</p>

          {Object.keys(message).length && (
            <div>
              <div className="message">
                <div className="row shadow-sm message-card">
                  <div className="col-sm-6 details">
                    <div>
                      {formatDate(message.date).date}{" "}
                      {formatDate(message.date).time}
                    </div>
                    <div>
                      Sender: <strong>{message.senderInfo.displayName}</strong>
                    </div>
                    <Image src={message.senderInfo.url} thumbnail width={100} />
                    <div>
                      Location: <strong>{message.senderInfo.city}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6 details">
                    <div>
                      Subject: <strong>{message.subject}</strong>
                    </div>
                    <div>
                      Message: <strong>{message.message}</strong>
                    </div>
                    <div>
                      status:{" "}
                      <span
                        className={`status badge ${
                          message.status ? "badge-success" : "badge-info"
                        }`}
                        onClick={() => showUpdateModal()}
                      >
                        {message.status || "Mark this ticket as resolved"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="reply-from">
                <ReplyForm
                  details={details}
                  postReply={postReply}
                  loading={loading}
                />
              </div>
              <div className="replies">
                {message.replies &&
                  message.replies.map((e) => {
                    const { date, time } = formatDate(e.date);
                    return (
                      <div className="reply" key={e.date}>
                        <h1 className="replier">{e.replier}</h1>
                        <h2 className="date">
                          {date} {time}{" "}
                        </h2>
                        <p className="reply-body">{e.body}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
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

        .message-card {
          width: 100%;
          margin: 30px 0;
          padding: 20px;
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
        }

        .reply {
          background: #fff;
          margin: 0 auto 2em auto;
          padding: 35px 30px;
        }
        .reply-body {
          font-size: 1em;
          border-left: 5px solid #8ee5ee;
          padding-left: 15px;
        }
        .date {
          font-size: 1em;
          font-weight: 400;
          color: #9c9c9c;
          margin-top: -10px;
          text-decoration: underline;
          text-decoration-color: currentColor;
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
