import axios from 'axios'

const SUCCESS = 'success';
const FAILED = 'failed';
const PENDING = 'pending';

export default {
  data: () => ({
    state: PENDING,
    data: null,
    error: null,
  }),
  props: {
    url: String,
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.state = PENDING;
      axios
        .get(this.url)
        .then(data => {
          this.data = data;
          this.state = SUCCESS
        })
        .catch(error => {
          this.error = error;
          this.state = FAILED;
        })
    }
  },
  render() {
    switch (this.state) {
      case SUCCESS:
        return this.$scopedSlots.default({ data: this.data.data, refresh: this.refresh });
      case FAILED:
        return this.$scopedSlots.error({ error: this.error, refresh: this.refresh });
      default:
        return this.$scopedSlots.loading;
    }
  }
}
