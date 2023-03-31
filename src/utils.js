export const sortAlphabeticallyBy = (data = [], property) => {
  return data.sort((a, b) => a[property].localeCompare(b[property]));
};
