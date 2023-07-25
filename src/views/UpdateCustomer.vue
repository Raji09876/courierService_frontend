<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import PageLoader from "../components/PageLoader.vue";
import Alert from "../components/Alert.vue";
import { updateAlert } from "../utils"
import TextBox from "../components/TextBox.vue"
import StreetAndAvenue from "../components/StreetAndAvenue.vue";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const customer = ref({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
});
const isPageLoader = ref(false);
const location = ref({ street:"",avenue: ""})

onMounted(async () => {
   const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
    await getCustomer();
    isPageLoader.value = false
});

async function getCustomer() {
    isPageLoader.value = true
    await CustomerServices.getCustomer(router.currentRoute.value.params.id)
        .then((response) => {
            customer.value = response.data
            location.value = {
              street: response.data.streetNumber,
              avenue: response.data.avenue
            }
            isPageLoader.value = false
        })
        .catch((error) => {
            isPageLoader.value = false
        });
}

async function updateCustomer() {
      if(customer.value.firstName === "") {
        snackbar.value = updateAlert("First Name is Empty")
    }
    else if(customer.value.lastName === "") {
        snackbar.value = updateAlert("Last Name is Empty")
    }
    else if(customer.value.email === "") {
           snackbar.value = updateAlert("Email is Empty")
    }
    else if(customer.value.phoneNumber === "") {
             snackbar.value = updateAlert("Mobile is Empty")
    }
    else {
        isPageLoader.value = true
        await CustomerServices.updateCustomer({...customer.value, streetNumber: location.value.street,avenue: location.value.avenue})
            .then((response) => {
              snackbar.value = updateAlert("User is Updated successfully!","green")
              isPageLoader.value = false
          })
          .catch((error) => {
              console.log(error);
              snackbar.value = updateAlert(error.response.data.message)
              isPageLoader.value = false
          });
    }
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Update Customer </v-card-title>
        </div>
        <PageLoader v-if="isPageLoader" />
        <v-card-text v-else>
          <TextBox class="md-3" id="firstName" title="First Name" :value="customer.firstName" @update:value="customer.firstName = $event"/>
          <TextBox class="md-3" id="lastName" title="Last Name" :value="customer.lastName" @update:value="customer.lastName = $event"/>
          <TextBox class="md-3" id="email" title="Email" :value="customer.email" @update:value="customer.email = $event"/>
          <TextBox class="md-3" id="mobile" title="Mobile Number" :value="customer.phoneNumber" @update:value="customer.phoneNumber = $event"/>
          <div style="margin-top:10px"/>
          <StreetAndAvenue :location="location" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="updateCustomer()">Update</v-btn>
        </v-card-actions>
      </v-card>
      <Alert :snackbar="snackbar"/>
    </div>
  </v-container>
</template>

<style scoped>
.add {
  margin-right: 20px;
  height: 40px;
  margin-top: 5px;
}
.heading {
    margin-top: 10px;
    justify-content: space-between;
}
</style>