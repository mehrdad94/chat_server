export const removeEmptyFromObject = obj => Object.entries(obj).forEach(([key, val]) => {
  if (val && typeof val === 'object') removeEmptyFromObject(val)
  else if (val == null) delete obj[key]
})