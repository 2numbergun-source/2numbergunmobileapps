/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Firebase Realtime Database सेटअप — सबै मोबाइलमा तुरुन्तै (real-time) साइरन/अलर्ट
// पुर्‍याउनका लागि यो प्रयोग हुन्छ। यो नभई साइरन एउटै फोनमा मात्र बज्छ, अरूमा पुग्दैन।
//
// ===== सेटअप कसरी गर्ने (५ मिनेट, सम्पूर्ण निःशुल्क) =====
// १. https://console.firebase.google.com मा गई "Add project" थिचेर नयाँ प्रोजेक्ट बनाउनुहोस्
//    (उदा. नाम: apf-gan-2-mgj)। Google Analytics नचाहिए "Disable" गर्न सकिन्छ।
// २. बायाँतिरको मेनुबाट Build > "Realtime Database" खोल्नुहोस् > "Create Database"
//    > कुनै पनि नजिकको region छान्नुहोस् > "Start in test mode" रोज्नुहोस्।
//    (पछि माथिको "Rules" ट्याबबाट सुरक्षा नियम थप कस्न सकिन्छ — README.md हेर्नुहोस्)
// ३. Project Overview (⚙️ Project settings) > "Your apps" सेक्सनमा वेब आइकन (</>)
//    थिचेर "एप जोड्नुहोस्" (nickname जे पनि दिन सकिन्छ, Firebase Hosting नचाहिन्छ)।
// ४. त्यहाँ देखिने firebaseConfig { apiKey, authDomain, databaseURL, ... } का मानहरू
//    प्रोजेक्टको जरोमा रहेको .env फाइलमा (.env.example बाट कपी गरेर बनाउनुहोस्) राख्नुहोस्।
// ५. `npm install` गरेपछि `npm run build` वा `npm run dev` गर्नुहोस् — त्यत्ति हो।
//
// जबसम्म .env मा मान राखिँदैन, तबसम्म एप पहिलेजस्तै पूर्ण रूपमा चल्छ (कुनै त्रुटि आउँदैन),
// तर साइरन/अलर्ट अर्को फोनमा भने पुग्दैन (स्थानीय-मात्र मोड)।

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL
);

let app: FirebaseApp | null = null;
let db: Database | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
    db = getDatabase(app);
  } catch (e) {
    console.warn('Firebase सुरु हुन सकेन — स्थानीय-मात्र मोडमा चल्नेछ।', e);
    db = null;
  }
} else {
  console.info(
    'Firebase कन्फिगर गरिएको छैन (.env हेर्नुहोस्) — साइरन स्थानीय फोनमा मात्र बज्नेछ, अरूमा पुग्दैन।'
  );
}

export { db };
