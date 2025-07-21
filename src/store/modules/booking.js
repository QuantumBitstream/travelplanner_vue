const state = () => ({
    bookingInfo: {}
})

const mutations = {
    setBookingInfo(state, info) {
        state.bookingInfo = info
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
