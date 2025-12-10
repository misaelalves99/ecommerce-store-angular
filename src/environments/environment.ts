// src/environments/environment.ts

export const environment = {
  production: false,

  // 🔹 Base da API (dev)
  apiBaseUrl: 'https://api.local-ecommerce.com',

  firebase: {
    apiKey: 'AIzaSyCyJGnYbTDnNXitl5rFEcd8B422f1VDKC8',
    authDomain: 'ecommerce-store-c4c02.firebaseapp.com',
    projectId: 'ecommerce-store-c4c02',
    storageBucket: 'ecommerce-store-c4c02.appspot.com',
    messagingSenderId: '1593265659',
    appId: '1:1593265659:web:XXXXXXXXXXXXXXX',
    measurementId: 'G-XXXXXXXXXX',
  },

  oauth: {
    googleClientId:
      '1593265659-32ainpXXXXXXXXXXXXXXX.apps.googleusercontent.com',
    facebookAppId: '773118492163657',
  },
};
