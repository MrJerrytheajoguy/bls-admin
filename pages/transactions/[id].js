import {useEffect, useState} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {Modal, Button} from 'react-bootstrap'
import useAuth from '../../hooks/auth'
import {NavBar} from '../../components/NavBar'
import useTransactions from '../../hooks/transactions'
import {SuccessAlert, FailureAlert} from '../../components/alerts'
import {SendBtn} from '../../components/SendBtn'

export default function Transaction() {
  const {signOut, data, error, transactions, users} = useAuth();
  const {UpdateTransactionStatus, successText, errorText, hideAlert, transLoading, status, updateOpen, hideUpdateModal, openUpdateModal } = useTransactions();
  const router = useRouter()

  
  const uid = data && data.uid;
  const { id } = router.query
  const st = transactions && transactions.find(e=>e.id == id);
  const owner = users && st && users.find(e=>e.uid == st.owner);
  const disabled = st && !!st.status || status;
  const reload = () => router.reload();
  console.log(owner);
  console.log(st);

  return (
    <div className="container">
      <Head>
        <title>BetterLifesavings admin dashboard / transactions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal show={updateOpen} onHide={hideUpdateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transaction status</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are about to change the status of this transaction to <span className='badge badge-success'>completed</span> Performing this action will as well update the account balance of the concerned client.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideUpdateModal}>
            Cancel
          </Button>
          <SendBtn variant="primary" onClick={()=>UpdateTransactionStatus(owner, st)} loading={transLoading} disabled={disabled}>
            Confirm
          </SendBtn>
        </Modal.Footer>
      </Modal>

      <main>
      <NavBar signOut={signOut} uid={uid} error={error} />

        { !data ? <div>Loading...</div> : (data && !data.uid) ? <div className="error">
          Unauthorized access <Link href='/'><a>Login</a></Link>
        </div> : null}

        <div className='authorized'>
        
          {st && users &&
            <div className="transactions">
                <h3>TRANSACTION DETAILS</h3>
                <h5>ID:  {st.id}</h5>
              <div className='row'>
                  <div className='col-sm-6 owner-details'>
                      <h6>CLIENT INFO</h6>
                      
                      <div>ACCOUNT NUMBER: <span><Link href={`/users/${st.owner}`}><a>{owner.phoneNumber}</a></Link></span></div>
                     <div>ACCOUNT BALANCE: <span>{owner.accountBalance || 0.00}</span><span onClick={reload} className='reload'>&#8634;</span></div>
                      <div>NAME: <span>{st.ownerDetails.name}</span></div>
                      <div>LOCATION: <span>{st.ownerDetails.city} {st.ownerDetails.state}</span></div>
                    <div>ADDRESS: <span>{st.ownerDetails.address} </span></div>
                  </div>
                 <div className='col-sm-6 transaction-details'>
                <h6>TRANSACTION INFO</h6>
                 <div>DATE: <span>{new Date(st.date).toDateString()} {new Date(st.date).toLocaleTimeString('en-US')}</span></div>
                 <div>TYPE: <span>{st.type}</span></div>
                 <div>AMOUNT: <span>&#8358;{st.amount}</span></div>
                 <div>STATUS: <span className={`badge ${st.status ? 'badge-success': 'badge-secondary'}`}>{st.status || 'requested'}</span></div>
                 <div>MESSAGE: <span>{st.message}</span></div>
                 </div>
              </div>
              <div className='action-buttons'>
              <button className='btn btn-outline-success btn-sm' onClick={openUpdateModal}>Update Transaction Status</button>
              </div>
            </div>
          }
        
        
        </div>
        <SuccessAlert alertText={successText} hideAlert={hideAlert} />
        <FailureAlert alertText={errorText} hideAlert={hideAlert} />
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


        .authorized{
          display: ${data && data.uid ? 'block' : 'none'};
          font-size: 0.9rem;
        }

        .transactions {
           width: 100%;
           margin: 80px 0 10px 0;
           padding: 20px;
           border: 1px solid #eaeaea;
        }
        .transactions h3,
        .transactions h5{
            text-align: center;
            margin: 20px 0;
        }
        .transactions h6{
            margin: 20px 0;
        }
        .transactions .action-buttons{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .action-buttons button{
            margin: 5px;
        }
        
        .transaction-details div, .owner-details div{
            margin: 15px 0;
        }
        .owner-details{
            text-transform: capitalize;
        }
        .transaction-details div span, .owner-details div span{
            margin-left: 10px;
            font-style: italic;
        }
        .reload{
          cursor: pointer;
          padding: 10px;
        }
        @media(max-width: 500px){
            .action-buttons{
                flex-direction: column;
            }
        }
      `}</style>
    </div>
  )
}
