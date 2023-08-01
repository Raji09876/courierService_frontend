<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import DashboardServices from "../services/DashboardServices.js";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Alert from "../components/Alert.vue";
import Graph from "../components/Graph.vue";

const dashboard = ref(null)
const isLoading = ref(true);
const router = useRouter();
const user = ref(null);
const id = null
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const lastWeek = ref([])
const userChartData = ref([])
const orderChartData = ref([])
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getReport();
  isLoading.value = false;
});

async function getReport() {
  await DashboardServices.getDashboard()
    .then((res) => {
        dashboard.value = res.data
        generateCharts(res.data)
    })
    .catch((error) => {
      console.log(error);
    });
}
const generateCharts = (data) => {
        generateLastWeekChart(data)
        generateUsersChart(data)
        generateOrdersChart(data)
}
const generateLastWeekChart = (data) =>{
    const labels= data.lastWeek.map((item) => item.date);
    const couriers = data.lastWeek.map((item) => item.delivered);
    lastWeek.value = {
    labels: labels,
    datasets: [
        {
        label: 'Last Week Delivered Orders',
        backgroundColor: '#80162B',
        data: couriers
        }
    ]
    }
}
const generateOrdersChart = (data) =>{
    const orderLabels= ["Total Pending Orders","Total Progress Orders","Total Delivered Orders"];
    const orderData = [data.pendingOrdersCount,data.progressOrdersCount,data.deliveredOrdersCount];
    orderChartData.value = {
    labels: orderLabels,
    datasets: [
        {
        label: 'Orders',
        backgroundColor: '#1877f2',
        data: orderData
        }
    ]
    }
}
const generateUsersChart = (data) =>{
    const userLabels= ["Admin","Clerk","Courier"];
    const userData = [data.adminCount,data.clerkCount,data.deliveryBoyCount];
    userChartData.value = {
    labels: userLabels,
    datasets: [
        {
        label: 'User List',
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: userData
        }
    ]
    }
}
</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex;">
      <h3>Dashboard</h3>
    </div>
    <br/>
    <PageLoader v-if="isLoading" />
    <div class="col-md-12 container elevation-4 dashboard" v-else-if="dashboard">
        <div class="row">
            <div style="width:100%;height:500px;">
                <Graph :chartData="lastWeek" />
            </div>
             <div class="row" style="background-color:#111827;padding:30px;font-size:22px;margin-top:30px;margin-left:5px;">
                <div  class="col-3">
                    <p style="color:#9CA3AF">Admins</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.admins }}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Clerks</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.clerks }}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Delivery Boys</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.deliveryBoys }}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Customers</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.customers }}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Couriers</p>
                    <p style="color:white;font-size:32px;"> {{  dashboard.pendingCouriers + dashboard.progressCouriers + dashboard.deliveredCouriers}}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Pending Couriers</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.pendingCouriers }}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Progress Couriers</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.progressCouriers }}</p>
                </div>
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Delivered Couriers</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.deliveredCouriers }}</p>
                </div> 
                <div  class="col-3">
                    <p style="color:#9CA3AF">Delivered In Time</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.deliveryInTimeCount }}</p>
                </div> 
                 <div  class="col-3">
                    <p style="color:#9CA3AF">Delivered Out Of Time</p>
                    <p style="color:white;font-size:32px;"> {{ dashboard.deliveredCouriers - dashboard.deliveryInTimeCount }}</p>
                </div> 
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
      <h4 class="text-muted">Unable to fetch data</h4>
      <hr/>
    </div>
  <Alert :snackbar="snackbar"/>
  <br/>
  </div>
</v-container>
</template>

<style scoped>
.dashboard {
    background-color: white;
    padding: 30px;
}
.col-6{
    margin-bottom: 50px;
}
.dashboard-static-data {
    display: flex;
    width: 40%;
    justify-content: space-between;
}
.static {
    margin-top: 40px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
table {
    width: 80%;
}
td {
    width: 80%;
    padding: 10px;
}
th {
    padding: 10px;
}
</style>