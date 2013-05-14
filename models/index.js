var mongoose = require('mongoose'),

  GlossSchema = new mongoose.Schema({
      term: { 'type': String, 'default': null, "lowercase": true }
    , definition: { 'type': String, 'default': null }
  });


GlossSchema.statics = {

  findByRegex: function (wordArray, cb) {
    var q = { term: { $in: [] } };
    for (var i = wordArray.length - 1; i >= 0; i--) {
      q.term['$in'].push(wordArray[i].toLowerCase())
    };
    console.log(q)
    this.find( q )
      .exec(cb)
  }
}
module.exports = mongoose.model('Todo', GlossSchema);