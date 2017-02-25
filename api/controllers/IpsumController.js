/**
 * IpsumController
 *
 * @module			:: controllers/ipsum
 * @description :: Performing CRUD operations on ipsum model
 * @author			:: Sriram Jayaraman <sriramemailsyou@gmail.com>
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * @description		Get a name from user and store it in the ipsum model
	 * @author			Sriram Jayaraman <sriramemailsyou@gmail.com>
	 *
	 * @api 			{post} /create 	Create Name
	 * @apiName 		create
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A random string
	 * @apiSuccess 		{Object} Returns the created record in ipsum collection. If error logs it in the server.
	 */
	create: function(req, res) {
		var newIpsum = {
			name: req.param('name')
		}

		Ipsum.create(newIpsum).exec(function(err, createdIpsum) {
			if (err) return console.log(err);

			return res.json(createdIpsum);
		});
	},

	/**
	 * @description		Get all records in the ipsum model
	 * @author			Sriram Jayaraman <sriramemailsyou@gmail.com>
	 *
	 * @api 			{get} /find 	Find All
	 * @apiName 		find
	 * @apiGroup 		CRUD
	 *
	 * @apiSuccess 		{Object} Returns all the records in ipsum collection. If error logs it in the server.
	 */
	getAllInfo: function(req,res) {
		Ipsum.find().exec(function(err, allInfo) {
			if (err) return console.log(err);

			return res.json(allInfo);
		});
	},

	/**
	 * @description		Find a record from the ipsum model with the specified name.
	 * @author			Sriram Jayaraman <sriramemailsyou@gmail.com>
	 *
	 * @api 			{post} /findOne 	Find Name
	 * @apiName 		findOne
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A Name
	 * @apiSuccess 		{Object} Returns the record in ipsum collection with the requested name. Returns error if name not found,
	 *												 If  database error logs it in the server.
	 */
	getElementByName: function(req, res) {
		Ipsum.findOne({name :req.param('name')}).exec(function(err, returnItem) {
			if (err) return console.log(err);

			if(returnItem) {
				return res.json(returnItem);
			}
			else {
				return res.status(404).json({error : "Name does not exist in Ipsum"});
			}
		});
	},

	/**
	 * @description		Get a name from user and update another name in the ipsum model
	 * @author			Sriram Jayaraman <sriramemailsyou@gmail.com>
	 *
	 * @api 			{put} /update 	Update Name
	 * @apiName 		Update
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A random Name
	 * @apiParam		{String} nameChange A random Name
	 * @apiSuccess 		{Array} Returns the updated record in ipsum collection. If error logs it in the server.
	 */
	updateElementByName: function(req, res) {
		Ipsum.update(
			{name: req.param('name') },
			{name: req.param('nameChange')}
		).exec(function(err, changedObject) {
			if (err) return console.log(err);

			return res.json(changedObject);
		});
	},

	/**
	 * @description		Get a name from user and deltes corrsponding record from the ipsum model
	 * @author			Sriram Jayaraman <sriramemailsyou@gmail.com>
	 *
	 * @api 			{delete} /delete 	Delete Name
	 * @apiName 		delete
	 * @apiGroup 		CRUD
	 *
	 * @apiParam 		{String} name A random Name
	 * @apiSuccess 		{Object} Returns confirmation after deleting record from the ipsum collection. If error logs it in the server.
	 */
	deleteElementByName: function(req,res){
		Ipsum.destroy({name : req.param('name')}).exec(function(err){
			if (err) return console.log(err);

			return res.send('It got deleted...');
		});
	}

};
