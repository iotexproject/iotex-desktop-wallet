// mongoose plugin http://mongoosejs.com/docs/plugins.html
const tools = require('../utils/tools');
import mongoose from 'mongoose';

export function baseModel(schema: mongoose.Schema) {
  schema.methods.createAtAgo = function createAtAgo() {
    return tools.formatDate(this.createAt, true);
  };

  schema.methods.updateAtAgo = function updateAtAgo() {
    return tools.formatDate(this.updateAt, true);
  };
}
