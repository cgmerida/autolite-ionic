import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
// import * as serviceAccountCred from './service-key.json';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const serviceAccount = require('../privkey-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://autolite-7901a.firebaseio.com"
});


export const removeUser = functions.firestore.document("/users/{uid}")
    .onDelete((snapshot, context) => {
        return admin.auth().deleteUser(context.params.uid);
    });


export const lockUser = functions.firestore.document("/users/{uid}")
    .onUpdate((snapshot, context) => {

        const oldDisabled = snapshot.before.get('disabled');
        const disabled = snapshot.after.get('disabled');

        if (disabled !== undefined) {
            if (oldDisabled == undefined || (oldDisabled !== undefined && disabled !== oldDisabled)) {
                return admin.auth().updateUser(context.params.uid, { disabled: disabled });
            }
        }

        return false;
    });