<script setup>
import { onMounted, watch,defineProps, toRef  } from "vue";
import { useRouter } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Alert from "../components/Alert.vue";
import { updateAlert } from "../utils"


// const courier = ref([]);
const loader = ref(true);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const router = useRouter()

const props = defineProps({
  courier: Object,
});
const courier = toRef(props, 'courier');

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await getCourier();
  loader.value = false;
});

async function getCourier() {
  await CourierServices.getCourier(props.id)
    .then((res) => {
      courier.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCourier = async() => {
    await CourierServices.deleteCourier(courier.value.id)
    .then((res) => {
      snackbar.value = updateAlert("Courier is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateAlert(error.response.data.message)
    });
}
const pickedup = async() => {
    await CourierServices.pickedup(courier.value.id)
    .then((res) => {
      snackbar.value = updateAlert("Courier is pickeup successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateAlert(error.response.data.message)
    });
}
const delivered = async() => {
    await CourierServices.delivered(courier.value.id)
    .then((res) => {
      snackbar.value = updateAlert("Courier is delivered successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateAlert(error.response.data.message)
    });
}
</script>

<template>
<v-container>
  <div style="margin-top: 20px;margin-left:30px;margin-right:30px;">
    <br/>
    <Spinner v-if="loader" />
     <div class="col-md-12 couriers" v-else>
        <div class="flex">
            <table>
                <tr>
                <th>Courier Id</th>
                <td>{{ courier.id }}</td>
                </tr>
                <tr>
                <th>Status</th>
                <td>{{ courier.status }}</td>
                </tr>
                <tr>
                <th>Price</th>
                <td> ${{ courier.cost }}</td>
                </tr>
                <tr>
                <th>Distance</th>
                <td> {{ courier.distance }} miles</td>
                </tr>
                <tr v-if="courier.CourierBoyPoints">
                <th>Delivery Boy Bonus</th>
                <td> ${{ courier.CourierBoyPoints }}</td>
                </tr>
                <tr>
                <th>Expected Time for Delivery </th>
                <td> {{ courier.timeTakesForDelivery }} Minutes</td>
                </tr>
                <tr>
                 <th>Created At</th>
                <td> {{ courier.createdAt }} </td>
                </tr>
                <tr v-if="courier.pickedupTime" >
                 <th>Picked up At</th>
                <td> {{ courier.pickedupTime }} </td>
                </tr>
                <tr v-if="courier.deliveredTime" >
                 <th>Delivered At</th>
                <td> {{ courier.deliveredTime }} </td>
                </tr>
                <tr v-if="courier.deliveredTime" >
                 <th>Delivered in time</th>
                <td> {{ courier.deliveredTime ? "Yes" : "No" }} </td>
                </tr>
                 <tr v-if="courier.pickup_from" >
                 <th>Pickup Details</th>
                <td> 
                    <p> Name - {{ courier.pickup_from.firstName}} {{ courier.pickup_from.lastName}} <br/>
                     Email - {{ courier.pickup_from.email}} <br/>
                     Contact - {{ courier.pickup_from.phoneNumber}} <br/>
                     Address -  Street {{ courier.pickup_from.streetNumber}}, Avenue {{ courier.pickup_from.avenue }}  <br/>
                     </p>
                </td>
                </tr>
                <tr v-if="courier.delivery_to_customerDetails">
                 <th>Delivery Details</th>
                <td> 
                    <p> Name - {{ courier.delivery_to_customerDetails.firstName}} {{ courier.delivery_to_customerDetails.lastName}} <br/>
                     Email - {{ courier.delivery_to_customerDetails.email}} <br/>
                     Contact - {{ courier.delivery_to_customerDetails.phoneNumber}} <br/>
                     Address - Street {{ courier.delivery_to_customerDetails.streetNumber}}, Avenue {{ courier.delivery_to_customerDetails.avenue }} <br/>
                     </p>
                </td>
                </tr>
                <tr  v-if="courier.clerk_details">
                <th>Clerk Details</th>
                <td> 
                    <p> Name - {{ courier.clerk_details.firstName}} {{ courier.clerk_details.lastName}} <br/>
                     Email - {{ courier.clerk_details.email}} <br/>
                     Contact - {{ courier.clerk_details.phoneNumber}} <br/>
                    </p>
                </td>
                </tr>
                <tr v-if="courier.courier_boy_details">
                <th>Delivery Boy Details</th>
                <td> 
                    <p> Name - {{ courier.courier_boy_details.firstName}} {{ courier.courier_boy_details.lastName}} <br/>
                     Email - {{ courier.courier_boy_details.email}} <br/>
                     Contact - {{ courier.courier_boy_details.phoneNumber}} <br/>
                    </p>
                </td>
                </tr>
            </table>
            <div v-if="user.role_id =='3' && !courier.deliveredTime ">
                <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary edit" v-if="!courier.pickedupTime" @click="pickedup()">Picked Up</button>
                <button type="button" class="btn btn-secondary edit" v-if="!courier.deliveredTime" @click="delivered()">Delivered</button>
                </div> 
            </div>
        </div>
    </div>
  </div>
  <Alert :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

table, th, td {
  bcourier: 1px solid black;
  bcourier-collapse: collapse;
}
table {
    width: 80%;
}
td {
    width: 80%;
    padding: 10px;
}
th {
    padding-left: 10px;
}
.flex {
    display: flex;
    justify-content: space-around;
}
.couriers {
    background-color: white;
}
.couriers {
  padding: 30px;
}
.courier {
  margin-top: 30px;
  width:100%;
  padding:15px;
  margin-left: 20px;
}
.btn-danger {
  margin-left: 20px;
}
.users{
  margin-top: 20px;
  margin-bottom: 20px;
}
.underline {
  width: 40%;
  margin-bottom: 10px;
}
.create {
    background-color: #1E73BE ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
}
.edit {
  background-color: #1E73BE;
  color: white;
}
.delete {
  background-color: #dc3545;
  color: white;
}
.search {
  margin-left: 70%;
  width: 30%;
}
</style>