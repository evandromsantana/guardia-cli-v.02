import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Adicione a configuração do seu projeto Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyAjUL5cR6VeouX4s_6a2-f4RzXrHg5Ty3o",
  authDomain: "guardia-dd810.firebaseapp.com",
  projectId: "guardia-dd810",
  storageBucket: "guardia-dd810.firebasestorage.app",
  messagingSenderId: "285764900701",
  appId: "SEU_APP_ID",
  measurementId: "1:285764900701:web:a5e7e160305f692a443ab4" // Opcional
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
