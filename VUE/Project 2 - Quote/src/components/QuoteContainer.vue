<template>
    <div>
      <ProgressBar></ProgressBar>
      <NewQuoteForm></NewQuoteForm>
      <Quotes></Quotes>
    </div>
</template>
<style>
    body{
        background-color: light-grey;
    }
</style>
<script>
    import ProgressBar from './ProgressBar.vue';
    import NewQuoteForm from './NewQuoteForm.vue';
    import Quotes from './Quotes.vue';

    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
          ProgressBar,
          NewQuoteForm,
          Quotes
        }
    }
</script>
