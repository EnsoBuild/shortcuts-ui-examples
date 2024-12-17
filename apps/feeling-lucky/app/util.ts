export const isEoaMode = () => typeof window !== "undefined" && JSON.parse(localStorage.getItem("eoaEnabled"));

export const toggleIsEoaMode = () => {
  localStorage.setItem("eoaEnabled", JSON.stringify(!isEoaMode()));
  window.location.reload();
};
