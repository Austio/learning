var obj = {};

function getDate() {
  return new Date();
}
Object.defineProperty(obj, 'config', {
  get() {
    return 'Getting Value' + getDate();
  },
});

export default obj.config;

export {
  obj
}