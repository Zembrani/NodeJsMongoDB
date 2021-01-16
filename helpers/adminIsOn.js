module.exports = {
    adminIsOn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return true
        } else {
            return false
        }
    }
}