import {useEffect} from 'react'
import Head from 'next/head'
import cookies from 'next-cookies'
import axios from 'axios'
import Link from 'next/link'
import useAuth from '../../hooks/auth'
// import useGetUsers from '../hooks/users'
import {NavBar} from '../../components/NavBar'

export default function Users() {
  const {signOut, data, error, users} = useAuth();
  //const {users} = useGetUsers();
  console.log('users:',users)

  const uid = data && data.uid;

  
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
          Users
        </p>
       

        <div className="users">
          {users && users.filter(e=>e.city).map(user=>(
              <Link href={`/users/${user.uid}`} key={user.uid}>
              <a className="card shadow-sm">
                  <div className='user-image'>
                      <img src={user.url} alt={user.displayName} className='rounded-circle' height={50}/>
                  </div>
                 <div className='card-items row'>
                 <div className='card-item col-sm-4'>{user.displayName}</div>
                 <div className='card-item col-sm-4'>{user.phoneNumber}</div>
                 <div className='card-item col-sm-4'>{`${user.city} ${user.state}`}</div>
                 </div>
              </a>
              </Link>
          ))}
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
          display: block;
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

        .authorized{
          display: ${data && data.uid ? 'block' : 'none'}
        }

        .card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
            flex-wrap: wrap;
            width: 90vw;
            margin-top: 3rem;
          padding: 1rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .user-image{
            flex-basis: 10%;
        }
        .card-items{
          flex-basis: 90%;
          text-align: left;
          color: inherit;
        }
        .card-item{
            padding: 10px;
            text-transform: capitalize;
        }
        
        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
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
  )
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

