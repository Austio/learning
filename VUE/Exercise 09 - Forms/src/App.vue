<template>
  <div class="container">
    <form>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">

          <FullnameComp v-model="fullname"></FullnameComp>
          <input
                  id="email"
                  type="email"
                  class="form-control"
                  v-model="email"
          />
          <label for="email">Email</label>
          <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="password"
          />
          <br>
          <label for="password">Password</label>
          <input
                  id="storeDataYes"
                  type="radio"
                  v-model="storeData"
                  value="Yes"
          />
          <label for="storeDataYes">Yes</label>
          <input
                  id="storeDataNo"
                  type="radio"
                  v-model="storeData"
                  value="No"
          />
          <label for="storeDataNo">No</label>

          <button type="submit" @click.prevent="submitForm" :disabled="formSubmitted">Submit</button>

          <!-- Exercise 3 -->
          <!-- Edit the Example from above and create a custom "Full Name" Control -->
          <!-- which still holds the First Name and Last Name Input Field -->
        </div>
      </div>
    </form>
    <hr v-if="1">
    <div class="row" v-if="1">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4>Your Data</h4>
          </div>
          <div class="panel-body">
            <p>Full Name: {{ fullname }}</p>
            <p>Mail: {{ email }}</p>
            <p>Password: {{ password }}</p>
            <p>Store in Database?: {{ storeData }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Fullname from './Fullname.vue';
    export default {
      data() {
        return {
          fullname: '',
          email: '',
          password: '',
          storeData: 'Yes',
          formSubmitted: false
        }
      },
      methods: {
        submitForm() {
          this.formSubmitted = true
        }
      },
      components: {
        FullnameComp: Fullname
      }
    }

</script>

<style>
</style>
