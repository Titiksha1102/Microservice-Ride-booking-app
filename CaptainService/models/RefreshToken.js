const mongoose = require('mongoose');
const refreshTokenSchema =new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    captainId: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        set: function (value) {
            // If no expiryDate is provided, set it to 2 days from now
            return value || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
          }
    }
});
refreshTokenSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('RefreshToken', refreshTokenSchema);