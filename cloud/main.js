
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('getActiveProducts', function(req, res){
  var User = Parse.Object.extend("User");
  var Products = Parse.Object.extend("Products");
  var innerQuery = new Parse.Query(User);
  innerQuery.equalTo("objectId", req.params.currentUser);
  var query = new Parse.Query(Products);
  query.matchesQuery("createdby", innerQuery);
  query.notEqualTo('isDeleted', 1);
  query.find({
    success: function(results) {
      res.success(results)
    },
    error: function() {
      res.error("Could not retrieve products");
    }
  })
});

Parse.Cloud.define('deleteProduct', function(req, res){
  var query = new Parse.Query("Products");
  query.equalTo('objectId', req.params.id);
  query.first({
    success: function(result) {
        if (result) {
            if (result.get('createdby').id == req.params.createdBy) {
              result.set('isDeleted', 1);
              result.save(null, {
                success: function(){
                  res.success('Product Deleted');
                },
                error: function(status) {
                  res.error('Not saved');
                }
              });
            } else {
               res.error("Not allowed");
            }
        } else {
            res.error("Could not find product");
        }
    },
    error: function() {
      res.error("Could not retrieve product");
    }
  })
});
