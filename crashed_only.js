var async = require('async');
var mongoose = require('mongoose');
var server = 'localhost/test';

async.series([
	// Step 0: dropDatabase
	function(callback) {
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			conn.db.dropDatabase();
			conn.close();
			callback(null, '[DONE] RESET DATABASE');
		});
	},

	// Step 1: generate test data
	function(callback) {
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var model = conn.model( 
				'rec', 
				new mongoose.Schema({ user: String, item: [String] }), 
				'rec'
			);
			var record_array = [];
			for (var i=0; i < 21; ++i) {
				var user = String.fromCharCode(97 + i);
				var items = [];
				for (var j=0 ; j < 512 ; ++j)
					items.push(j * i);
				record_array.push( { user: user, item: items } );
			}
			model.collection.insert(record_array, {w:1}, function (err) {
				if (err)
					console.log(err);
				conn.close();
				callback(null, '[DONE] generate test data');
			});
		});
	},

	// STEP 2: test mapreduce via jsMode = false
	function(callback) {
		var collection_out = 'item_pair_jsmode_off';
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var o = {};
			o.scope = { input_field: 'item' };
			o.verbose = true;
			o.jsMode = false;
			o.map = function(){
				if (this[input_field]) {
					var cnt = 0;
					for (var i=0, len=this[input_field].length ; i<len ; ++i) {
						var key = this[input_field][i] + "-" + this[input_field][i];
						emit(key, 1);
						cnt ++;
						for (var j = i+1 ; j<len ; ++j) {
							var key = this[input_field][i]+"-"+this[input_field][j];
							emit(key, 1);
							cnt ++;
							key = this[input_field][j]+"-"+this[input_field][i];
							emit(key, 1);
							cnt ++;
						}
					}
				}
			}
			o.reduce = function(k, vals) {
				return Array.sum(vals);
			}
			o.out = {
				replace: collection_out, 
				sharded: true,
			};
	
			var model = conn.model( 'rec', new mongoose.Schema({ user: String, item: [String] }), 'rec');
			model.mapReduce(o, function (err, results) {
				if(err)
					console.log(err);
				conn.close();
				callback(null, '[DONE] jsMode is false');
			});
		});
	},

], function(err, result){
	if (err)
		console.log(err);
	console.log("\n\n");
	for (var i=0, cnt=result.length ; i<cnt ; ++i)
		console.log(result[i]);
});
