/**
 * IpsumController
 *
 * @description :: Server-side logic for managing ipsums
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		var newIpsum = {
			name: req.param('name')
		}

		Ipsum.create(newIpsum).exec(function(err, createdIpsum) {
			if (err) return console.log(err);

			return res.json({data : createdIpsum});
		});
	},

	getAllInfo: function(req,res) {
		Ipsum.find().exec(function(err, allInfo) {
			if (err) return console.log(err);

			return res.json({data : allInfo});
		});
	},

	getElementByName: function(req, res) {
		Ipsum.findOne({name :req.param('name')}).exec(function(err, returnItem) {
			if (err) return console.log(err);

			return res.json({data : returnItem});
		});
	},

	updateElementByName: function(req, res) {
		Ipsum.update(
			{name: req.param('name') },
			{name: req.param('nameChange')}
		).exec(function(err, changedObject) {
			if (err) return console.log(err);

			return res.json({data : changedObject});
		});
	},

	deleteElementByName: function(req,res){
		Ipsum.destroy({name : req.param('name')}).exec(function(err){
			if (err) return console.log(err);

			return res.send('It got deleted...')
		});
	}

};
