let firebaseConfig = {
    apiKey: "AIzaSyCNGSeZGjPHTSdaZg9no2QK84HpR_Gl06I",
    authDomain: "testing-blog-7e3ce.firebaseapp.com",
    projectId: "testing-blog-7e3ce",
    storageBucket: "testing-blog-7e3ce.appspot.com",
    messagingSenderId: "194000073212",
    appId: "1:194000073212:web:47d92c83e2e27d2f0e0279"
  };

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();