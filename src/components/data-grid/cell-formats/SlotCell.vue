<script>
import abstractCell from './AbstractCell';

export default {
  mixins: [abstractCell],
  name: 'slot-cell',
  render(createElement) {
    if (this.column.slot) {
      return createElement('div', [
        this.column.slot({
          row: this.rowData,
          cell: this.cellData
        })
      ]);
    }
    return createElement('span', 'Undefined');
  }
};
</script>
