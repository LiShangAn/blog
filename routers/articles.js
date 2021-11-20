const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('article');
  res.send('article');
});

router.get('/test', (req, res) => {
  res.send('test');
});

router.get('/new', (req, res) => {
  console.log('get articles/new');
  res.render('articles/new', {article: new Article()});
});

router.get('/:slug', async (req, res) => {
  console.log('get articles/:slug');
  // console.log(req.params.slug);
  const article = await Article.findOne({slug: req.params.slug});
  if (article == null) {
    res.redirect('/');
  }
  res.render('articles/show', {article: article});
});

router.post('/', async (req, res) => {
  console.log('post /articles/');

  const article = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown
  });
  try {
    let result = await article.save(); // return id
    // res.redirect('/articles/test');
    res.redirect(`/articles/${result.slug}`);
  } catch (e) {
    console.log(e);
    res.render('articles/new', {article: article});
  }
});

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

module.exports = router;
