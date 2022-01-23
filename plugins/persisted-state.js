// import createPersistedState from 'vuex-persistedstate'

// import ckBleDevice from '~/store/ck-ble-device'
// import matrix from '~/store/matrix'

// export default ({ store, isHMR }) => {
//   // In case of HMR, mutation occurs before nuxReady, so previously saved state
//   // gets replaced with original state received from server. So, we've to skip HMR.
//   // Also nuxtReady event fires for HMR as well, which results multiple registration of
//   // vuex-persistedstate plugin
//   if (isHMR) return

//   if (process.client) {
//     window.onNuxtReady((_) => {
//       createPersistedState({
//         paths: [
//           'matrix.dots',
//           'matrix.isBoxDots',
//           'matrix.savedDots',
//           'matrix.dotColor',
//         ],
//       })(store) // vuex plugins can be connected to store, even after creation
//     })
//   }
// }
