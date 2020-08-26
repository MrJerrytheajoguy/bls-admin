import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Image, Button } from "react-bootstrap";
import {useRouter} from 'next/router'
import useAuth from "../../hooks/auth";
import useBlog from "../../hooks/blog";
import { NavBar } from "../../components/NavBar";
import {CreatePost} from '../../components/blog/createNew'
import { app } from "../../config/firebase";

const {db} = app;

export default function EditPost({post}) {
  
  const { signOut, data, error } = useAuth();
  const { updateBlogPost, loading } = useBlog();
  const router = useRouter()

  const uid = data && data.uid;
  const {id} = router.query

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
          <p className="description">Update Blog Post</p>

          <div className="users">
            <CreatePost createPost={updateBlogPost} post={post} loading={loading} id={id} />
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

export const getServerSideProps = async ({ query }) => {
  const post = await db
  .collection("blog")
  .doc(query.id)
  .get()
  .then((res) => ({ id: res.id, ...res.data() }));
return {
    props: {
      post
    }
  }
}
