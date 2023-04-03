import memoize from 'lodash.memoize';

export const sortAlphabeticallyBy = memoize(
  (property, data = []) => {
    return data.sort((a, b) => a[property].localeCompare(b[property]));
  },
  // resolve fn to generate the key for caching result
  (property, data) => {
    // generate key using value from first and last item in list
    return data[0][property] + data[data.length - 1][property];
  }
);
