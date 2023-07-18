import apiClient from "./services";

export default {
  getCouriers(type,userId) {
    if(!type)
      return apiClient.get("couriers");
    if(type == "delivered-couriers")
      return apiClient.get("couriers/delivery-boy-delivered/"+userId)
    else if(type== "my-current-courier")
      return apiClient.get("couriers/delivery-boy-not-delivered/"+userId)
    else if(type == "ordered-couriers") 
      return apiClient.get("couriers/clerk/"+userId)
    return apiClient.get("couriers")  
  },
  getCourier(id) {
    return apiClient.get("couriers/" + id);
  },
  addCourier(courier) {
    return apiClient.post("couriers", courier);
  },
  findDistance(courier) {
    return apiClient.post("couriers/find-distance",courier);
  },
  updateCourier(courier) {
    return apiClient.put("couriers/" + courier.id, courier);
  },
  deleteCourier(courierId) {
    return apiClient.delete("couriers/" + courierId);
  },
  pickedup(orderId) {
    return apiClient.post("/couriers/taken/" + orderId);
  },
  delivered(orderId) {
    return apiClient.post("couriers/done/" + orderId);
  }
};