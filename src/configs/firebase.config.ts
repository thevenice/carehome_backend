import admin from 'firebase-admin'
//@ts-ignore
import serviceAccount from './serviceAccountKey.json'

export let _admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
