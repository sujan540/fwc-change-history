export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    rowData: {
      type: Object
    },
    cellData: {
      type: [Object, String, Number]
    }
  },
  computed: {
    value() {
      return this.cellData;
    }
  }
};
