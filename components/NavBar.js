import React from "react";

export const NavBar = ({ signOut, uid, error }) => {
  return (
    <div className="nav-bar shadow-sm">
      <h6 className="title">BetterlifeSavings Admin</h6>
      <button className="btn btn-default logout" onClick={() => signOut()}>
        &#10061; logout
      </button>
      <style jsx>
          {`
          .nav-bar {
            margin: 0;
            line-height: 1.15;
            letter-spacing: 2px;
            padding: 15px 20px;
            position: fixed;
            z-index: 99;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
          }
          .logout{
            display: ${uid || error ? 'block' : 'none'};
            background: rgba(0,0,0,0.1);
            padding: 2px 10px;
          }
  
          `}
      </style>
    </div>
  );
};
