import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Markdown from "markdown-to-jsx";
import useAuth from "../../hooks/auth";
import useBlog from "../../hooks/blog";
import { NavBar } from "../../components/NavBar";

export default function Transactions() {
  const [posts, setPosts] = useState([]);
  const { signOut, data, error } = useAuth();
  const { getAllPosts, hasMore, deleteBlogPost, deleting } = useBlog();
  useEffect(() => {
    getAllPosts().then((res) => setPosts(res));
  }, []);

  const next = () => {
    getAllPosts().then((res) => setPosts([...posts, ...res]));
  };
  const uid = data && data.uid;

  const handleDelete = (id) => {
    deleteBlogPost(id).then(() => {
      const remPosts = posts.filter((e) => e.id !== id);
      setPosts(remPosts);
    });
  };
  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard / blog</title>
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
          <p className="description">All blog posts</p>

          <div style={{ padding: 10 }}>
            <Button style={{ float: "right" }}>
              <Link href="blog/addNew">
                <a>+ create new</a>
              </Link>
            </Button>
            <Button style={{ float: "left" }}>
              <Link href="blog/blogImages">
                <a> + Images</a>
              </Link>
            </Button>
          </div>
          <div className="blog-posts">
            <InfiniteScroll
              style={{ width: "100%", margin: "auto" }}
              dataLength={posts.length}
              next={next}
              hasMore={hasMore}
              loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>{posts.length ? "You have seen it all" : null}</b>
                </p>
              }
            >
              {posts.map((e, i) => (
                <div key={e.id}>
                  <div className="shadow-sm transaction-card">
                    <div className="details">
                      <div>{new Date(e.date).toDateString()}</div>
                      <div>
                        Author: <strong>{e.author}</strong>
                      </div>
                      <h3>{e.title}</h3>
                      <Markdown className="markdown">{e.body}</Markdown>
                      <div>
                        <Link href={`/blog/${e.id}`}>
                          <a className="edit-btn badge">
                            Edit <i className="material-icons">edit</i>
                          </a>
                        </Link>
                      </div>
                      <div>
                        {deleting === e.id ? (
                          <Button variant="secondary" disabled style={{float: 'right'}}>
                            <Spinner
                              as="span"
                              animation="border"
                              role="status"
                              aria-hidden="true"
                            />
                            deleting...
                          </Button>
                        ) : (
                          <span
                            className="delete-btn badge"
                            onClick={() => handleDelete(e.id)}
                          >
                            Delete <i className="material-icons">delete</i>
                          </span>
                        )}
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
          min-width: 100%;
          margin: 50px 0;
          padding: 20px 20px 60px 20px;
          position: relative;
        }

        .details div {
          margin: 10px 0;
          letter-spacing: 1px;
        }

        .logout {
          position: fixed;
          top: 15px;
          right: 15px;
        }
        .blog-posts {
          min-width: 100%;
          margin: auto !important;
        }
        .edit-btn {
          position: absolute;
          right: 10px;
          top: 10px;
          margin: 10px;
          cursor: pointer;
        }
        .delete-btn {
          position: absolute;
          right: 10px;
          margin: 10px;
          bottom: 10px;
          cursor: pointer;
        }
        .edit-btn:hover,
        .edit-btn:focus {
          color: #0070f3;
        }
        .delete-btn:hover,
        .delete-btn:focus {
          color: red;
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
