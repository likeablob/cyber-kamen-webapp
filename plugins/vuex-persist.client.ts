import { Store } from 'vuex'
import { VuexPersistence } from 'vuex-persist'

// import ckBleDevice from '~/store/ck-ble-device'
// import matrix from '~/store/matrix'

export default ({ store }: { store: Store<any> }) => {
  new VuexPersistence({ modules: ['matrix'] }).plugin(store)
}
