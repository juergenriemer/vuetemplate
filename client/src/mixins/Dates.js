import { format, formatDistance } from "date-fns";
export default {
  methods: {
    date(date) {
      date = date ? new Date(date) : new Date();
      return format(date, "dd MMMM yyyy");
    },
    ago(date) {
      date = date ? new Date(date) : new Date();
      return formatDistance(date, new Date());
    },
  },
};
