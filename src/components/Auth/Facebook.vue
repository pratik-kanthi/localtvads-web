<template>
    <div>
        <v-btn color="#3b5998" class="mt-5 white--text text-capitalize font-weight-bold" block @click="googleAuth()"><span><v-img contain position="0 0" :src="fbIcon" max-width="24px" style="margin-left:-96px" /></span>Sign up with Facebook</v-btn>
    </div>
</template>
<script>
export default {
 name: "Facebook",
 data() {
  return {
   fbIcon: require('@/assets/images/facebook.png'),
  }
 },
}
</script>