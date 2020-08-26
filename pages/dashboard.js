import {useEffect} from 'react'
import Head from 'next/head'
import cookies from 'next-cookies'
import axios from 'axios'
import Link from 'next/link'
import useAuth from '../hooks/auth'
import {NavBar} from '../components/NavBar'

export default function Dashboard() {
  const {signOut, data, error} = useAuth();

  useEffect(() => {
    console.log('data')
  }, [])
  const uid = data && data.uid;

  const emojis = ['😂','😃']
  
  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <NavBar signOut={signOut} uid={uid} error={error} />

        { !data ? <div>Loading...</div> : (data && !data.uid) ? <div className="error">
          Unauthorized access <Link href='/'><a>Login</a></Link>
        </div> : null}

        <div className='authorized'>
        <p className="description">
          {data && `Welcome ${data.name}`}
        </p>
       

        <div className="grid">
          <Link href='/users'>
          <a className="card shadow-sm">
            <h3>Clients &rarr;</h3>
            <p>Manage all client accounts for Betterlife Saving</p>
          </a>
          </Link>

          <Link href='/transactions'>
          <a className="card shadow-sm">
            <h3>Transactions &rarr;</h3>
            <p>Manage all user transactions for Betterlife Savings</p>
          </a>
          </Link>
          <Link href='/notifications'>
          <a className="card shadow-sm">
            <h3>Messages &rarr;</h3>
            <p>Manage and reply messages sent by registered users</p>
          </a>
          </Link>
          <Link href='/blog'>
          <a className="card shadow-sm">
            <h3>Blog &rarr;</h3>
            <p>Manage blog page. Post or delete blog articles</p>
          </a>
          </Link>
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
        .authorized{
          display: ${uid ? 'block' : 'none'};
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

        footer a {
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

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }
        .logout{
          position: fixed;
          top:15px;
          right: 15px;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
