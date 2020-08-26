import { useState } from "react";
import { app } from "../config/firebase";

function useBlog() {
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUPdateOpen] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const { db, storageRef } = app;

  const getAllPosts = async function () {
    const posts = lastVisible
      ? db
          .collection("blog")
          .orderBy("date", "desc")
          .startAfter(lastVisible)
          .limit(10)
      : db.collection("blog").orderBy("date", "desc").limit(10);
    return posts.get().then(function (documentSnapshots) {
      if (!documentSnapshots.docs.length) setHasMore(false);
      var lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisible);
      console.log("last", lastVisible);
      const posts = [];
      documentSnapshots.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      return posts;
    });
  };

  const getAllImgages = async function () {
    const images = lastImage
      ? db
          .collection("blogImages")
          .orderBy("date", "desc")
          .startAfter(lastImage)
          .limit(10)
      : db.collection("blogImages").orderBy("date", "desc").limit(12);
    return images.get().then(function (documentSnapshots) {
      if (!documentSnapshots.docs.length) setHasMoreImages(false);
      var lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastImage(lastVisible);
      const images = [];
      documentSnapshots.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() });
      });
      return images;
    });
  };

  const updateBlogPost = async (values, id) => {
    setLoading(true);
    return db
      .collection("blog")
      .doc(id)
      .set({ ...values }, { merge: true })
      .then(() => {
        setLoading(false);
        hideUpdateModal();
      });
  };

  const postNewBlog = async (values) => {
    setLoading(true);
    return db
      .collection("blog")
      .add({
        ...values,
        date: new Date().toISOString(),
      })
      .then((docRef) => {
        setLoading(false);
        console.log(docRef);
      })
      .catch((err = console.log(err)));
  };

  const uploadBlogImage = async (file) => {
    const fileName = Date.now() + "-" + file.name;
    setLoading(true);
    try {
      const snapshot = await storageRef
        .child("blog-images/" + fileName)
        .put(file);
      const url = await snapshot.ref.getDownloadURL();
      console.log("File available at", url);
      const docRef = await db.collection("blogImages").add({
        fileName,
        url,
        date: new Date().toISOString(),
      });
      setLoading(false);
      window.alert("image upload successful");
      console.log(docRef.id)
      return {
        fileName,
        url,
        id: docRef.id,
        date: new Date().toISOString(),
      };
    } catch (error) {
      return console.log(error);
    }
  };

  const deleteImage = async (fileName, id) => {
    var ref = storageRef.child(`blog-images/${fileName}`);
    await ref.delete();
    try {
      await db.collection("blogImages")
        .doc(id)
        .delete();
      return window.alert("Image successfully deleted!");
    }
    catch (error) {
      console.log("Error deleting file");
    }
  };

  const hideUpdateModal = () => setUPdateOpen(false);
  const showUpdateModal = () => setUPdateOpen(true);
  return {
    getAllPosts,
    hasMore,
    loading,
    updateBlogPost,
    updateOpen,
    hideUpdateModal,
    showUpdateModal,
    postNewBlog,
    uploadBlogImage,
    getAllImgages,
    hasMoreImages,
    deleteImage,
  };
}

export default useBlog;
