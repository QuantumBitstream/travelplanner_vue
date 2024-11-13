
// store/modules/destination.js

// 初始状态
const state = {
    destinations: [
        {
            id: 1,
            name: '桂林',
            imageUrl: require('@/assets/images/guilin.png'),
            shortDescription: '青山绿水，甲天下的风光',
        },
        {
            id: 2,
            name: '苏州',
            imageUrl: require('@/assets/images/suzhou.png'),
            shortDescription: '园林之美，江南风情浓郁',
        },
        {
            id: 3,
            name: '丽江',
            imageUrl: require('@/assets/images/lijiang.png'),
            shortDescription: '古城魅力，纳西族文化深厚',
        },
    ]
}

// mutations
const mutations = {
    SET_DESTINATIONS(state, destinations) {
        state.destinations = destinations
    },
    ADD_DESTINATION(state, destination) {
        state.destinations.push(destination)
    }
}

// actions
const actions = {
    fetchDestinations({ commit }) {
        // 这里可以添加实际的API调用
        // 暂时直接返回state中的数据
        commit('SET_DESTINATIONS', state.destinations)
    }
}

// getters
const getters = {
    getAllDestinations: state => state.destinations,
    getDestinationById: (state) => (id) => {
        return state.destinations.find(dest => dest.id === id)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
