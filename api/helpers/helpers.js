
module.exports = {
 generateOTP: async () => {
  return Math.floor(Math.random() * 899999 + 100000).toString();
 },

};
