import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Image, Button, Card, CardDeck, CardColumns } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Compressor from "compressorjs";
import useAuth from "../../hooks/auth";
import useBlog from "../../hooks/blog";
import { NavBar } from "../../components/NavBar";
import { SubmitBtn } from "../../components/SubmitBtn";

export default function Transactions() {
  const [urls, setUrls] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { signOut, data, error } = useAuth();
  const {
    getAllImgages,
    hasMoreImages,
    uploadBlogImage,
    loading,
    deleteImage,
  } = useBlog();
  useEffect(() => {
    getAllImgages().then((res) => setUrls(res));
  }, []);

  const fileUpload = useRef();

  const next = () => {
    getAllImgages().then((res) => setUrls([...urls, ...res]));
  };

  const openFileUpload = () => fileUpload.current.click();
  const handleSubmit = (e) => {
    e.preventDefault();
    uploadBlogImage(file).then((res) => setUrls([res, ...urls]));
  };
  const handleDelete = (e) => {
    deleteImage(e.fileName, e.id).then(()=> {
        const remUrls = urls.filter(url => url.id !== e.id)
        setUrls(remUrls);
    })
  }

  const uid = data && data.uid;

  function handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    if (file) {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 400,
        success(result) {
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
          };
          reader.readAsDataURL(result);
          setFile(result);
        },
        error(err) {
          console.log(err.message);
        },
      });
    }
  }
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
          <p className="description">All blog Images</p>

          <div className="preview" style={{ textAlign: "center", margin: 10 }}>
            {previewUrl && <Image src={previewUrl} width={150} thumbnail />}
          </div>
          <div className="img-container">
            <form onSubmit={handleSubmit}>
              <input
                style={{ display: "none" }}
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleImageChange}
                ref={fileUpload}
              />
              <div style={{ textAlign: "center" }}>
                <Button onClick={openFileUpload}>
                  <i className="material-icons">camera</i>
                </Button>
              </div>
              {file && <SubmitBtn loading={loading}>Submit</SubmitBtn>}
            </form>
          </div>
          <div className="blog-posts">
            <InfiniteScroll
              style={{ width: "100%", margin: "auto" }}
              dataLength={urls.length}
              next={next}
              hasMore={hasMoreImages}
              loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>{urls.length ? "You have seen it all" : null}</b>
                </p>
              }
            >
              <div className="images">
                <CardColumns>
                  {urls.map((e) => (
                    <Card key={e.id} style={{width: '18rem'}}>
                      <Card.Img variant="top" src={e.url} />
                      <Card.Body>
                        <Card.Text>{e.url}</Card.Text>
                        <Card.Text>
                          <small className="text-muted">
                            {new Date(e.date).toDateString()}
                          </small>
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(e)}
                        >
                          DELETE
                        </Button>
                      </Card.Footer>
                    </Card>
                  ))}
                </CardColumns>
              </div>
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

        .logout {
          position: fixed;
          top: 15px;
          right: 15px;
        }

        .images {
          margin: 50px 0 !important;
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
