export const isEoaMode = () => JSON.parse(localStorage.getItem("eoaEnabled"));

export const toggleIsEoaMode = () => {
  localStorage.setItem("eoaEnabled", JSON.stringify(!isEoaMode()));
  window.location.reload();
};
