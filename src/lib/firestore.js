// Write data to Firestore document identified by docId
// Documentation for the set() method can be found here:
// https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
// https://firebase.google.com/docs/reference/node/firebase.firestore.DocumentReference#set
export const dbDocumentSet = async (context, docId, data) => {
  return await context.firestore
    .collection("timers")
    .doc(docId)
    .set(data, { merge: true });
};

// Read data from Firestore associated with docId
// Documentation for the get() method can be found here:
// https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
// https://firebase.google.com/docs/reference/node/firebase.firestore.DocumentReference#get
export const dbDocumentGet = async (context, docId) => {
  return await context.firestore.collection("timers").doc(docId).get();
};

// Trigger callback whenever data associated with Firestore document docId changes
// Documentation for the onSnapshot() method can be found here:
// https://firebase.google.com/docs/firestore/query-data/listen
// https://firebase.google.com/docs/reference/node/firebase.firestore.DocumentReference#onsnapshot
export const dbDocumentListen = (context, docId, callback) => {
  return context.firestore
    .collection("timers")
    .doc(docId)
    .onSnapshot((doc) => {
      if (!doc.exists) return;
      const data = doc.data();
      if (!data) return;
      callback(data);
    });
};
