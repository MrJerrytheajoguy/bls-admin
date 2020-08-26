import { useEffect } from "react";
import Head from "next/head";
import SignIn from "../components/SignIn";
import useAuth from "../hooks/auth";
import Router from "next/router";
import {NavBar} from '../components/NavBar'

export default function Home() {
  const { error, data, email, signOut } = useAuth();
  const uid = data && data.uid;
  const goToDashboard = () => Router.push('/dashboard');

  return (
    <div className="container">
      <Head>
        <title>Better Life Savings / Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NavBar signOut={signOut} uid={uid} error={error} />
        {!data ? (
          <div>Loading...</div>
        ) : error ? (
          <div>
            <p className="error">
              {`Permission denied! for ${email}`}
              <br />
              Try another account
            </p>
            <SignIn className="sign-in" />
          </div>
        ) : uid ? (
          <div className='text-center'>Welcome back {data.name} <br/><span className='btn btn-success' onClick={()=>goToDashboard()}>Go to Dashboard &rarr;</span></div>
        ) : (
          <SignIn className="sign-in" />
        )}
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
          padding: 5rem 0;
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

        footer img {
          margin-left: 0.5rem;
        }

        .error {
          color: #ff5252;
          font-size: 0.9em;
          text-align: center;
          margin-top: 10px;
        }
        .sign-in {
          display: ${uid ? "none" : "block"};
        }

        .btn.btn-success{
          padding: 2px 10px;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
