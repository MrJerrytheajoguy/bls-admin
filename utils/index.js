
export const formatDate = (iso) => {
    var options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(iso).toLocaleDateString("en-US", options);
    const time = new Date(iso).toLocaleTimeString("en-US");
    return {
      date,
      time,
    };
  };