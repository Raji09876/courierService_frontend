<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import { ref } from "vue";
import PageLoader from "../components/PageLoader.vue";
import Alert from "../components/Alert.vue";
import { updateAlert } from "../utils"
import ViewCourier from "./ViewCourier.vue";


const couriers = ref([]);
const backup = ref([]);
const loader = ref(true);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const router = useRouter()
const type = router.currentRoute.value.params.type
const pickup_from_details = ref({})
const drop_customer_details = ref({})
const selectedCourier = ref(0)
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCouriers();
  loader.value = false;
});

watch(
      () => router.currentRoute.value.params.type,
      (newType, oldType) => {
        if (newType !== oldType) {
          location.reload();
        }
      }
    );

async function getCouriers() {
  await CourierServices.getCouriers(type,user.value.id)
    .then((res) => {
      couriers.value = res.data;
      backup.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCourier = async(id,index) => {
  await CourierServices.deleteCourier(id)
    .then((res) => {
      couriers.value.splice(index, 1);
      snackbar.value = updateAlert("Courier is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateAlert(error.response.data.message)
    });
}
</script>

<template>
<v-container>
  <div style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>All Delivery Requests</h3>
    </div>
    <br/>
    <PageLoader v-if="loader" />
     <div class="col-md-12 elevation-4 couriers" v-else-if="couriers.length != 0">
                <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">Pickup Customer</th>
                    <th scope="col">Delivery Customer</th>
                    <th v-if="user.role_id != 3"> Delivery Boy </th>
                     <th scope="col">Pickup Date</th>
                    <th scope="col">Pickup Time</th>
                    <th scope="col">Price of Courier</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Status</th>
                    <th scope="col" v-if="user.role_id != 3">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(courier,index) in couriers" :key="index" >
                    <th scope="row"><a type="button" data-bs-toggle="modal" data-bs-target="#courierModal" @click="selectedCourier=courier">{{ courier.id }} </a></th>
                    <td>{{ courier.pickup_from.firstName }} {{ courier.pickup_from.lastName }}</td>
                    <td>{{ courier.delivery_to_customerDetails.firstName }} {{ courier.delivery_to_customerDetails.lastName }}</td>
                    <td v-if="courier.courierBoyId && user.role_id != 3">{{ courier.courier_boy_details.firstName }} {{ courier.courier_boy_details.laststName }}</td>
                    <td v-else-if="user.role_id != 3"> Not Assigned</td>
                    <td>{{ courier.dateForPickup}} </td>
                    <td>{{ courier.timeForPickup }}</td>
                    <td>${{ courier.cost }}</td>
                    <td >{{ courier.distance }} Miles</td>
                    <td> {{ courier.status }} </td>
                    <td v-if="user.role_id != 3 && courier.status !== 'DELIVERED'">
                        <div class="btn-group" role="group">
                        <a type="button" class="btn btn-secondary update" :href="['/courier-frontend/update-courier/'+courier.id]">Update</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteCourier(courier.id,index)">Delete</button>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
    </div>
     <div class="text-center" v-else>
      <h4 class="text-primary">No Couriers are available Now.</h4>
    </div>
  </div>
  <Alert :snackbar="snackbar"/>
   <div class="modal fade" id="courierModal" tabindex="-1" aria-labelledby="courierModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="courierModalLabel">Courier Details</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <ViewCourier :courier="selectedCourier" />
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary update" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  <br/>
</v-container>

</template>

<style scoped>

.couriers {
    background-color: #FFFFFF;
}
.couriers {
  padding: 30px;
}
.courier {
  margin-top: 30px;
  width:100%;
  padding-bottom: 1px solid black;
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
.add {
    background-color: #1E73BE ;
    margin-left: 20px;
    padding-top: -10px;
    color: #FFFFFF;
}
.update {
  background-color: #1E73BE;
  color: #FFFFFF;
}
.delete {
  background-color: #dc3545;
  color: #FFFFFF;
}
.search {
  margin-left: 70%;
  width: 30%;
}
</style>