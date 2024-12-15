export const capitalizeStr = (str) => {
    const strArray = str.split(" ");
    const arr = strArray.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return arr.join(" ");
  }