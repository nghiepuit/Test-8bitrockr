import * as firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyADjo3JiGrCq_t99CkIHhKE2YKczzyJags',
  authDomain: 'exercise-89e70.firebaseapp.com',
  databaseURL: 'https://exercise-89e70.firebaseio.com',
  projectId: 'exercise-89e70',
  storageBucket: '',
  messagingSenderId: '473231679215',

}

export const firebaseApp = firebase.initializeApp(config)
export const addressRef = firebase.database().ref('address')
