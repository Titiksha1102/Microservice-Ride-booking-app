module.exports.userLoggedIn= async (req, res, next) => {
    const token = req.headers.authorization&&req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'You are not logged in'
        });
    }
    const user=axios.get(`${process.env.USER_SERVICE_URL}/profile`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(user);
    if (!user) {
        return res.status(401).json({
            message: 'You are not logged in'
        });
    }
    req.body.userId=user.data._id;
    next();
}