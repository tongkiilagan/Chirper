const logoutController =
{
    getLanding: function(req, res)
    {
        req.session.destroy();
        res.redirect('/');
    }
}
module.exports = logoutController;