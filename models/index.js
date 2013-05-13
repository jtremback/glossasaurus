var mongoose = require('mongoose'),

  GlossSchema = new mongoose.Schema({
      word: { 'type': String, 'default': null }
    , definition: { 'type': String, 'default': null }
  });


GlossSchema.statics = {

  findByRegex: function (wordArray, cb) {
    var q = { word: { $in: [] } };
    for (var i = wordArray.length - 1; i >= 0; i--) {
      var regex = new RegExp(wordArray[i], 'i')
      q.word['$in'].push(regex)
    };
    this.find( q )
      .exec(cb)
  }
}
module.exports = mongoose.model('Todo', GlossSchema);