/**
 * UserController
 *
 * @module			:: controllers/user
 * @description :: Performing CRUD operations on User model
 * @author			:: Vivek Sharma <vivekssharma07@gmail.com>
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * @description		Get a name from user and store it in the User model
	 * @author			Vivek Sharma <vivekssharma07@gmail.com>
	 *
	 * @api 			{post} /create 	Create Name
	 * @apiName 		create
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A random string
	 * @apiSuccess 		{Object} Returns the created record in User collection. If error logs it in the server.
	 */
	create: function (req, res) {
		var newUser = {
			name: req.param('name'),
			group: req.param('group')
		}

		User.create(newUser).exec(function (err, createdUser) {
			if (err) return console.log(err);

			return res.json(createdUser);
		});
	},

	/**
	 * @description		Get all records in the User model
	 * @author			Vivek Sharma <vivekssharma07@gmail.com>
	 *
	 * @api 			{get} /find 	Find All
	 * @apiName 		find
	 * @apiGroup 		CRUD
	 *
	 * @apiSuccess 		{Object} Returns all the records in User collection. If error logs it in the server.
	 */
	getAllJobInfo: async (req, res) => {
		try {
			const result = await User.find()
			return res.json(result);
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},

	/**
	 * @description		Get all records in the User model
	 * @author			Vivek Sharma <vivekssharma07@gmail.com>
	 *
	 * @api 			{get} /find 	Find All
	 * @apiName 		find
	 * @apiGroup 		CRUD
	 *
	 * @apiSuccess 		{Object} Returns all the records in User collection. If error logs it in the server.
	 */
	getAllInfo: function (req, res) {
		try {
			User.find().exec(function (err, allInfo) {
				if (err) return console.log(err);

				return res.json(allInfo);
			});
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},
	/**
	 * @description		Find a record from the User model with the specified name.
	 * @author			Vivek Sharma <vivekssharma07@gmail.com>
	 *
	 * @api 			{post} /findOne 	Find Name
	 * @apiName 		findOne
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A Name
	 * @apiSuccess 		{Object} Returns the record in User collection with the requested name. Returns error if name not found,
	 *												 If  database error logs it in the server.
	 */
	getElementByName: function (req, res) {
		User.findOne({ name: req.param('name') }).exec(function (err, returnItem) {
			if (err) return console.log(err);

			if (returnItem) {
				return res.json(returnItem);
			}
			else {
				return res.status(404).json({ error: "Name does not exist in User" });
			}
		});
	},

	/**
	 * @description		Get a name from user and update another name in the User model
	 * @author			Vivek Sharma <vivekssharma07@gmail.com>
	 *
	 * @api 			{put} /update 	Update Name
	 * @apiName 		Update
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A random Name
	 * @apiParam		{String} nameChange A random Name
	 * @apiSuccess 		{Array} Returns the updated record in User collection. If error logs it in the server.
	 */
	updateElementByName: function (req, res) {
		User.update(
			{ id: req.param('id') },
			{ name: req.param('name') },
			{ group: req.param('group') }
		).exec(function (err, changedObject) {
			if (err) return console.log(err);

			return res.json(changedObject);
		});
	},

	/**
	 * @description		Get a name from user and deltes corrsponding record from the User model
	 * @author			Vivek Sharma <vivekssharma07@gmail.com>
	 *
	 * @api 			{delete} /delete 	Delete Name
	 * @apiName 		delete
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A random Name
	 * @apiSuccess 		{Object} Returns confirmation after deleting record from the User collection. If error logs it in the server.
	 */
	deleteElementByName: function (req, res) {
		User.destroy({ name: req.param('name') }).exec(function (err) {
			if (err) return console.log(err);

			return res.send('It got deleted...');
		});
	}
};
