<template>
  <div class="trip-planner">

    <div class="page-header">
      <h1>旅行规划器</h1>
      <p>设计属于您自己的旅行计划，享受无缝体验</p>
    </div>

    <div class="global-container-flex-row">

      <el-card class="planner-form-card">
        <div class="planner-form">
          <el-form :model="tripData" label-width="100px">
            <!-- 选择目的地 -->
            <el-form-item label="目的地">
              <el-select v-model="tripData.destination" placeholder="请选择目的地">
                <el-option v-for="dest in destinations" :key="dest.id" :value="dest.name" :label="dest.name" />
              </el-select>
            </el-form-item>

            <!-- 选择日期 -->
            <el-form-item label="出发日期">
              <el-date-picker v-model="tripData.startDate" type="date" placeholder="选择日期" />
            </el-form-item>

            <!-- 选择天数 -->
            <el-form-item label="旅行天数">
              <el-input-number v-model="tripData.days" :min="1" :max="15" />
            </el-form-item>

            <!-- 选择人数 -->
            <el-form-item label="人数">
              <el-input-number v-model="tripData.peopleCount" :min="1" />
            </el-form-item>

            <!-- 添加活动 -->
            <el-form-item label="活动安排">
              <el-select v-model="newActivityDay" placeholder="选择天">
                <el-option v-for="n in tripData.days" :key="n" :value="n" :label="'第' + n + '天'" />
              </el-select>
              <el-autocomplete
                  v-model="newActivity"
                  :fetch-suggestions="fetchSuggestions"
                  placeholder="输入活动名称(目的地景点)"
                  @select="onSelectSuggestion"
              />
              <el-input
                  v-model="newActivityDescription"
                  placeholder="输入活动描述"
              />
              <el-time-picker
                  v-model="newActivityTime"
                  placeholder="选择活动时间"
                  value-format="HH:mm"
                  format="HH:mm"
              />
              <el-button type="primary" @click="addActivity();getSelectDayInputAttractions(newActivityDay)">添加活动</el-button>

              <!-- 在模板中显示特定天数的景点 -->
              <div class="day-attractions">
                <el-icon><MapLocation /></el-icon>
                <span> 当前选中日期的景点: </span>
                <ul>
                  <li v-for="attraction in getInputAttractionsBySpecificDayCoordinates(newActivityDay)"
                      :key="attraction.name">
                    {{ attraction.name }} - {{ attraction.time }}
                  </li>
                </ul>
              </div>

            </el-form-item>



            <!-- 提交按钮 -->
            <el-form-item>
              <el-button type="success" @click="submitPlan">提交计划</el-button>
            </el-form-item>

            <!-- 生成行程计划 -->
            <el-form-item>
              <el-button type="primary"
                         @click="
                         generateItinerary();
                         getAttractionsForDestination();
                         getAllInputAttractions();
                         getSelectedAttractionCoordinates();
                         getAllInputAttractionsBySpecificDayCoordinates();
                         getSelectedAttractionCoordinatesByFormatLabel(newActivityDay);
                         ">生成行程计划</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <div>
        <OverlayPin
            :geometriesTest="geometries2"
            :geometriesRoute="geometries"
            :geometriesLabelTest="geometriesLabel"></OverlayPin>
      </div>

    </div>

    <!-- 显示活动 -->
    <div v-for="day in tripData.days" :key="day" class="day-activities">
      <h4>第{{ day }}天:</h4>
      <ul class="activities-list">
        <li v-for="(activity, index) in getActivitiesForDay(day)" :key="index">
          {{ activity.name }} - {{ activity.description }} - {{ activity.time }}
          <el-button type="text" @click="removeActivity(day, index)">移除</el-button>
        </li>
      </ul>
    </div>

    <!-- 显示生成的行程 -->
    <div v-if="itinerary.length" class="itinerary">
      <h3>生成的行程计划</h3>
      <ul>
        <li v-for="(day, index) in itinerary" :key="index">
          第{{ index + 1 }}天 ({{ day.date }}):
          <ul>
            <li v-for="activity in day.activities" :key="activity.name">
              {{ activity.name }} - {{ activity.description }} - {{ activity.time }}
            </li>
          </ul>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import OverlayPin from "@/components/OverlayPin.vue";
import {computed, ref} from 'vue';
import dayjs from 'dayjs';

// 假设有一个函数可以优化活动顺序
function optimizeRoute(activities) {
  // Mock implementation: simply return activities in reverse order for demonstration
  return activities.slice().reverse();
}

export default {
  name: 'TripPlanner',
  components: {OverlayPin},
  setup() {
    const destinations = [
      {id: 1, name: '北京'},
      {id: 2, name: '纽约'},
      {id: 3, name: '洛杉矶'},
      // 更多目的地...
    ];

    const tripData = ref({
      destination: '',
      startDate: '',
      days: 1,
      peopleCount: 1,
      activities: Array.from({length: 15}, () => [])
    });

    const newActivity = ref('');
    const newActivityDescription = ref('');
    const newActivityTime = ref('');
    const newActivityDay = ref(1);
    const itinerary = ref([]);

    const addActivity = () => {
      if (newActivity.value.trim() && newActivityDay.value) {
        console.log('newActivityTime.value: ',newActivityTime.value);
        tripData.value.activities[newActivityDay.value - 1].push({
          name: newActivity.value.trim(),
          description: newActivityDescription.value.trim(),
          time: newActivityTime.value
        });
        newActivity.value = '';
        newActivityDescription.value = '';
        newActivityTime.value = '';
      }
    };

    const removeActivity = (day, index) => {
      tripData.value.activities[day - 1].splice(index, 1);
    };

    const getActivitiesForDay = (day) => {
      return tripData.value.activities[day - 1] || [];
    };

    const cityAttractions = {
      '北京': [
        { value: '故宫博物院' },
        { value: '长城' },
        { value: '天安门广场' },
        { value: '颐和园' },
        { value: '天坛公园' },
        { value: '南锣鼓巷' },
        { value: '798艺术区' },
        { value: '北海公园' },
        { value: '圆明园' }
      ],
      '纽约': [
        { value: '自由女神像' },
        { value: '中央公园' },
        { value: '时代广场' },
        { value: '帝国大厦' },
        { value: '大都会博物馆' },
        { value: '布鲁克林大桥' },
        { value: '百老汇' },
        { value: '洛克菲勒中心' },
        { value: '华尔街' }
      ],
      '洛杉矶': [
        { value: '好莱坞标志' },
        { value: '环球影城' },
        { value: '迪士尼乐园' },
        { value: '比佛利山庄' },
        { value: '圣莫尼卡海滩' },
        { value: '格里菲斯天文台' },
        { value: '盖蒂中心' },
        { value: '威尼斯海滩' },
        { value: '星光大道' }
      ]
    };

    const fetchSuggestions = (queryString, cb) => {
      const selectedCity = tripData.value.destination;
      const suggestions = cityAttractions[selectedCity] || [];
      cb(suggestions.filter(s => s.value.toLowerCase().includes(queryString.toLowerCase())));
    };

    const onSelectSuggestion = (item) => {
      newActivity.value = item.value;
    };

    const submitPlan = () => {
      if (validateForm()) {
        alert('旅行计划已提交！');
        // 可以将数据发送到服务器
      } else {
        alert('请完整填写所有必填项。');
      }
    };

    const validateForm = () => {
      return (
          tripData.value.destination &&
          tripData.value.startDate &&
          tripData.value.activities.some(dayActivities => dayActivities.length > 0)
      );
    };

    const generateItinerary = () => {
      if (!tripData.value.startDate) {
        alert('请选择出发日期！');
        return;
      }

      itinerary.value = Array.from({length: tripData.value.days}, (_, index) => {
        const date = dayjs(tripData.value.startDate).add(index, 'day').format('YYYY-MM-DD');
        const activitiesForDay = tripData.value.activities[index] || [];
        console.log( 'activitiesForDay: ', activitiesForDay );
        return {
          date,
          activities: optimizeRoute(activitiesForDay)
        };
      });
    };

    const getAttractionsForDestination = () => {
      const selectedCity = tripData.value.destination;
      console.log('selectedCity: ', cityAttractions[selectedCity] || []);
      return cityAttractions[selectedCity] || [];
    };

    // 返回select day输入的所有景点的数组 ['a','b']
    const getSelectDayInputAttractions = (day) => {

      // 检查天数是否有效
      if (day < 1 || day > tripData.value.days) {
        console.error(`无效的天数：${day}`);
        return [];
      }

      // 获取指定天数的活动
      const dayActivities = tripData.value.activities[day - 1] || [];

      // 扁平化select day的活动数组，并提取景点名称
      console.log('getSelectDayInputAttractions dayActivities：', dayActivities);
      const selectDayallAttractions = dayActivities
          .flat() // 将二维数组扁平化为一维数组
          .map(activity => activity.name) // 提取每个活动的名称
          .filter((name, index, self) => name && self.indexOf(name) === index); // 去重
      console.log('getSelectDayInputAttractions 所有输入的景点：', selectDayallAttractions);
      return selectDayallAttractions;
    };

    // 返回输入的所有目的地景点的数组 ['a','b']
    const getAllInputAttractions = () => {
      // 扁平化所有天数的活动数组，并提取景点名称
      console.log('tripData.value.activities：', tripData.value.activities);
      const allAttractions = tripData.value.activities
          .flat() // 将二维数组扁平化为一维数组
          .map(activity => activity.name) // 提取每个活动的名称
          .filter((name, index, self) => name && self.indexOf(name) === index); // 去重
      console.log('所有输入的景点：', allAttractions);
      return allAttractions;
    };

    const attractionsWithCoordinates = {
      '北京': [
        { value: '故宫博物院', lat: 39.916345, lng: 116.397155 },
        { value: '长城', lat: 40.431908, lng: 116.570375 },
        { value: '天安门广场', lat: 39.903740, lng: 116.397480 },
        { value: '颐和园', lat: 39.999912, lng: 116.275475 },
        { value: '天坛公园', lat: 39.882209, lng: 116.406414 },
        { value: '南锣鼓巷', lat: 39.933708, lng: 116.407988 },
        { value: '798艺术区', lat: 39.984104, lng: 116.497438 },
        { value: '北海公园', lat: 39.928619, lng: 116.396799 },
        { value: '圆明园', lat: 40.007634, lng: 116.310464 }
      ],
      '纽约': [
        { value: '自由女神像', lat: 40.689247, lng: -74.044502 },
        { value: '中央公园', lat: 40.785091, lng: -73.968285 },
        { value: '时代广场', lat: 40.758896, lng: -73.985130 },
        { value: '帝国大厦', lat: 40.748817, lng: -73.985428 },
        { value: '大都会博物馆', lat: 40.779437, lng: -73.963244 },
        { value: '布鲁克林大桥', lat: 40.706086, lng: -73.996864 },
        { value: '百老汇', lat: 40.759011, lng: -73.984472 },
        { value: '洛克菲勒中心', lat: 40.758740, lng: -73.978674 },
        { value: '华尔街', lat: 40.707491, lng: -74.011276 }
      ],
      '洛杉矶': [
        { value: '好莱坞标志', lat: 34.134115, lng: -118.321548 },
        { value: '环球影城', lat: 34.138117, lng: -118.353378 },
        { value: '迪士尼乐园', lat: 33.812092, lng: -117.918974 },
        { value: '比佛利山庄', lat: 34.073620, lng: -118.400356 },
        { value: '圣莫尼卡海滩', lat: 34.019454, lng: -118.491191 },
        { value: '格里菲斯天文台', lat: 34.118434, lng: -118.300393 },
        { value: '盖蒂中心', lat: 34.078036, lng: -118.474095 },
        { value: '威尼斯海滩', lat: 33.985047, lng: -118.469483 },
        { value: '星光大道', lat: 34.101558, lng: -118.326843 }
      ]
    };

    // 获取指定景点的坐标 geometriesLabel格式
    const getSpecificAttractionCoordinatesByFormatOfgeometriesOfLabel = (cityName, attractionName) => {
      const cityAttractions = attractionsWithCoordinates[cityName] || [];
      const attraction = cityAttractions.find(a => a.value === attractionName);
      if (attraction) {
        return {
          id: attraction.id,
          styleId: 'label',
          content: attractionName,
          position: {
            lat: attraction.lat,
            lng: attraction.lng
          }
        };
      }
      return null;
    };

    // 获取指定景点的坐标 geometries2格式
    const getSpecificAttractionCoordinates = (cityName, attractionName) => {
      const cityAttractions = attractionsWithCoordinates[cityName] || [];
      const attraction = cityAttractions.find(a => a.value === attractionName);
      if (attraction) {
        return {
          styleId: 'marker',
          content: attractionName,
          position: {
            lat: attraction.lat,
            lng: attraction.lng
          }
        };
      }
      return null;
    };

    const geometriesLabel = computed(() => {
      let geometriesLabelTest = [];
      getSelectedAttractionCoordinatesByFormatLabel(1);
      geometriesLabelTest = getSelectedAttractionCoordinatesByFormatLabel(1)
      console.log(' test computed select day  geometriesLabel: ',geometriesLabelTest);
      return geometriesLabelTest;
    });

    // 获取指定景点的坐标 geometries格式
    const getSpecificAttractionCoordinatesOfRoute = (cityName, attractionName) => {
      const cityAttractions = attractionsWithCoordinates[cityName] || [];
      const attraction = cityAttractions.find(a => a.value === attractionName);
      if (attraction) {
        // 生成围绕景点的多个坐标点，形成一个闭合路径
        const baseLat = attraction.lat;
        const baseLng = attraction.lng;

        return [{
          id: `polyline-${attractionName}`,
          styleId: 'polyline',
          paths: [
            { lat: baseLat, lng: baseLng },
          ],
          properties: {
            title: 'polyline',
          },
        }];
      }

      return [];
    };

    // 获取到用户选择的select day所有景点的坐标数据 formatLabel
    const getSelectedAttractionCoordinatesByFormatLabel = (day) => {
      const selectedCity = tripData.value.destination;
      const selectedAttractions = getSelectDayInputAttractions(day);

      const geometriesLabel = selectedAttractions.map(attractionName =>
          getSpecificAttractionCoordinatesByFormatOfgeometriesOfLabel(selectedCity, attractionName)
      ).filter(coord => coord !== null)

      console.log('select day  geometriesLabel: ', geometriesLabel);

      return geometriesLabel;
    };

    // 获取到用户选择的所有景点的坐标数据 formatLabel
    const getAllSelectedAttractionCoordinatesByFormatLabel = () => {
      const selectedCity = tripData.value.destination;
      const selectedAttractions = getAllInputAttractions();

      const geometriesLabel = selectedAttractions.map(attractionName =>
          getSpecificAttractionCoordinatesByFormatOfgeometriesOfLabel(selectedCity, attractionName)
      ).filter(coord => coord !== null)

      console.log('geometriesLabel: ', geometriesLabel);

      return geometriesLabel;
    };


    // 获取到用户选择的所有景点的坐标数据
    const getSelectedAttractionCoordinates = () => {
      const selectedCity = tripData.value.destination;
      const selectedAttractions = getAllInputAttractions();

      const geometries2 = selectedAttractions.map(attractionName =>
          getSpecificAttractionCoordinates(selectedCity, attractionName)
      ).filter(coord => coord !== null)

      console.log('geometries2: ', geometries2);

      return geometries2;
    };

    const geometries2 = computed(() => {
      let geometries = [];
      getSelectedAttractionCoordinates();
      geometries = getSelectedAttractionCoordinates()
      console.log(' test computed geometries2: ',geometries);
      return geometries;
    });


    // 获取到用户选择的当天的所有景点的坐标数据
    const getInputAttractionsBySpecificDayCoordinates = (day) => {
      // 检查天数是否有效
      if (day < 1 || day > tripData.value.days) {
        console.error(`无效的天数：${day}`);
        return [];
      }

      // 获取指定天数的活动
      const dayActivities = tripData.value.activities[day - 1] || [];

      // 获取选中的城市
      const selectedCity = tripData.value.destination;

      // 提取该天的景点信息并包含坐标
      const attractionsWithCoordinates = dayActivities
          .filter(activity => activity && activity.name)
          .map(activity => {
            const coordinates = getSpecificAttractionCoordinatesOfRoute(selectedCity, activity.name);
            if (coordinates) {
              return {
                ...coordinates,
                name: activity.name,
                time: activity.time
              };
            }
            return null;
          })
          .filter(attraction => attraction !== null);

      console.log(`第${day}天的景点数据 the day  attractionsWithCoordinates：`, attractionsWithCoordinates);
      return attractionsWithCoordinates;
    };

    // 获取指定天数的所有景点的坐标 geometries 格式
    const getAllInputAttractionsBySpecificDayCoordinates = (day) => {
      // 检查天数是否有效
      if (day < 1 || day > tripData.value.days) {
        console.error(`无效的天数：${day}`);
        return [];
      }

      // 获取指定天数的活动
      const dayActivities = tripData.value.activities[day - 1] || [];

      // 获取选中的城市
      const selectedCity = tripData.value.destination;

      // 收集所有景点的坐标
      const allPaths = dayActivities
          .filter(activity => activity?.name)
          .map(activity => {
            const cityAttractions = attractionsWithCoordinates[selectedCity] || [];
            const attraction = cityAttractions.find(a => a.value === activity.name);
            if (attraction) {
              return {
                lat: attraction.lat,
                lng: attraction.lng
              };
            }
            return null;
          })
          .filter(coord => coord !== null);

      // 如果没有有效的坐标点，返回空数组
      if (allPaths.length === 0) {
        return [];
      }

      // 返回包含所有景点坐标的单个路径
      return [{
        id: `polyline-day-${day}`,
        styleId: 'polyline',
        paths: allPaths,
        properties: {
          title: 'polyline',
        }
      }];
    };

    const geometries = computed(() => {
      // 使用当前选中的天数
      console.log(` geometries computed 第${newActivityDay.value}天的景点数据 geometries格式：`, getAllInputAttractionsBySpecificDayCoordinates(newActivityDay.value));
      return getAllInputAttractionsBySpecificDayCoordinates(newActivityDay.value);
    });

    return {
      destinations,
      tripData,
      newActivity,
      newActivityDescription,
      newActivityTime,
      newActivityDay,
      itinerary,
      addActivity,
      removeActivity,
      getActivitiesForDay,
      fetchSuggestions,
      onSelectSuggestion,
      submitPlan,
      generateItinerary,
      getAttractionsForDestination,
      getAllInputAttractions,
      attractionsWithCoordinates,
      getSpecificAttractionCoordinates,
      getSelectedAttractionCoordinates,
      geometries2,
      getInputAttractionsBySpecificDayCoordinates,
      getAllInputAttractionsBySpecificDayCoordinates,
      geometries,
      getSpecificAttractionCoordinatesOfRoute,
      getSpecificAttractionCoordinatesByFormatOfgeometriesOfLabel,
      geometriesLabel,
      getSelectedAttractionCoordinatesByFormatLabel,
      getSelectDayInputAttractions,
      getAllSelectedAttractionCoordinatesByFormatLabel,
    };
  }
}
</script>

<style scoped>
.trip-planner {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.2em;
}

.planner-form-card {
  max-width: 450px;
  margin: 0 auto;
}

.planner-form .el-form-item {
  margin-bottom: 20px;
}

.day-activities {
  margin-top: 20px;
}

.activities-list {
  list-style: none;
  padding: 0;
}

.activities-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 5px 0;
}

.activities-list li .el-button {
  font-size: 0.9em;
  color: #f56c6c;
}

.itinerary {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.itinerary h3 {
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2em;
  }

  .page-header p {
    font-size: 1em;
  }
}
</style>
