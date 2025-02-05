const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    enableUser,
    disableUser,
    getAdminProfile,
    removeDevice,
    adminLogout,
    updateAdminProfile,
    adminProfile
} = require('../controllers/userControllers');


router.get('/', getAllUsers);
router.post('/create', createUser); // Only admins can create users
router.put('/admin-update/info/:id', updateUser); // Only admins can update users
router.patch('/enable/:id', enableUser); // Only admins can enable users
router.patch('/disable/:id', disableUser); // Only admins can disable users
router.delete('/admin/delete/:id', deleteUser); // Only admins can delete users
router.get('/profile', getAdminProfile);
router.delete('/admin/remove-device/:email/:deviceId', removeDevice); // Only admins can remove devices
router.put('/admin/update-profile/:id', updateAdminProfile);
router.post('/admin/logout', adminLogout); // Only admins can log out admin
router.get('/admin/profile/:id', adminProfile);

module.exports = router;
