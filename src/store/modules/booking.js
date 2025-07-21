const state = () => ({
    bookingInfo: {}
})

const mutations = {
    setBookingInfo(state, info) {
        state.bookingInfo = info
        console.log(" - vuex - info:", info)
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
