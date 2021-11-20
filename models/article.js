const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');

const createDomPurify = require('dompurify');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dowPurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});

articleSchema.pre('validate', function (next) {
  console.log('validate schema');
  if (this.title) {
    this.slug = slugify(this.title, {lower: true, strict: true});
  }

  if (this.markdown) {
    // console.log(marked.marked(this.markdown));
    this.sanitizedHtml = dowPurify.sanitize(marked.marked(this.markdown));
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
