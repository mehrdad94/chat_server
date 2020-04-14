export default function AsyncWrapper (fn, isSocket = false) {
  if (isSocket) {
    return (data, clb) => fn(data, clb).catch(e => console.error(e))
  } else {
    return (req, res, next) => fn(req, res).catch(next)
  }
}