<template>
    <div>
      <li class="list-group-item">
          <p>Server Status {{ computedStatus }}</p>
          <button @click='handleButtonClick'>Click Me</button>
      </li>
    </div>
</template>

<script>
  export default{
    data() {
      return {
        status: true
      }
    },
    methods: {
      handleButtonClick() {
        this.status = !this.status;
      }
    },
    computed: {
      computedStatus() {
        return this.status ? 'Clicked' : 'Not Clicked';
      }
    }
  }
</script>

