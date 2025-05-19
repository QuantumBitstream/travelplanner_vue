
// store/modules/destination.js

// 初始状态
import {getDestinations} from "@/utils";

const state = {
    destinations: [
        {
            id: 1,
            name: '洛杉矶',
            imageUrl: require('@/assets/images/la/santa-monica.png'),
            shortDescription: '阳光明媚，电影之都的魅力',
        },
        {
            id: 2,
            name: '悉尼',
            imageUrl: require('@/assets/images/sydney.jpg'),
            shortDescription: '悉尼歌剧院，海港大桥的壮丽景色',
        },
        {
            id: 3,
            name: '北京',
            imageUrl: require('@/assets/images/beijing.jpeg'),
            shortDescription: '历史悠久，长城与故宫的辉煌',
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
    async fetchDestinations({commit}) {
        // 这里可以添加实际的API调用
        // 暂时直接返回state中的数据

        try {
            const resp = await getDestinations();
            console.log('resp:', resp);
            commit('SET_DESTINATIONS', resp)
            this.setState({
                data: resp,
            });
        } catch (error) {
            console.error(error.message);
        }

    }
}

// getters
/**
 *
 *
 * getters 访问 Vuex 中的数据  为什么不直接state
 *
 *
 * 在 Vuex 中使用 getters 而不是直接访问 state 有几个好处：
 *
 * 1. **抽象层次**：
 * Getters 提供了一个抽象层次，使得组件不需要直接依赖于 state 的具体结构。如果 state 的结构发生变化，只需要修改 getters，而不需要修改所有使用该 state 的组件。
 *
 * 2. **复用性**：
 * Getters 可以在多个组件中复用，尤其是当需要对 state 进行一些计算或转换时。这样可以避免在多个组件中重复相同的逻辑。
 *
 * 3. **缓存**：
 * Getters 是基于 Vue 的响应式系统的，它们会根据依赖的变化自动更新，并且在依赖不变的情况下会缓存结果，从而提高性能。
 *
 * 4. **可测试性**：
 * Getters 可以单独进行测试，因为它们是纯函数，不依赖于组件的具体实现。
 *
 * 尽管在简单的场景下，直接访问 state 可能看起来更直接，但在复杂应用中，使用 getters 可以带来更好的可维护性和可扩展性。
 *
 * 如果你的应用很简单，或者你确定 state 的结构不会改变，直接访问 state 也是可以接受的。但在大多数情况下，使用 getters 是一种更好的实践。
 *
 *
 * @type {{getDestinationById: (function(*): function(*): T),
 *         getAllDestinations: (function(*): [{imageUrl: {}, name: string, id: number, shortDescription: string},{imageUrl: {}, name: string, id: number, shortDescription: string},{imageUrl: {}, name: string, id: number, shortDescription: string}])}}
 */
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
