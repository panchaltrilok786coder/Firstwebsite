// app.js

import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


// ================= LOGIN =================
const loginForm = document.querySelector("form");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.querySelector("input[type='text']").value;
    const password = document.querySelector("input[type='password']").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "admin.html";
      })
      .catch(err => alert(err.message));
  });
}


// ================= ADMIN PROTECTION =================
if (window.location.pathname.includes("admin.html")) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}


// ================= ADD PRODUCT =================
window.addProduct = async function() {

  const name = document.getElementById("name")?.value;
  const image = document.getElementById("image")?.value;
  const desc = document.getElementById("desc")?.value;
  const price = document.getElementById("price")?.value;

  if (!name || !image || !price) {
    alert("Fill all fields");
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name,
      image,
      desc,
      price
    });

    alert("Product Added ✅");

  } catch (e) {
    alert("Error: " + e.message);
  }
};


// ================= LOAD PRODUCTS =================
async function loadProducts() {

  const container = document.getElementById("productContainer");
  if (!container) return;

  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach(doc => {
    const p = doc.data();

    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <strong>₹${p.price}</strong>
      </div>
    `;
  });
}

loadProducts();