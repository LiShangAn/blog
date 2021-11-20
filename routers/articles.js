const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('get /articles');
  res.send('article');
});

router.get('/test/:testParam', (req, res) => {
  console.log('get /articles/test');
  console.log(req.params.testParam);
  res.send('test');
});

router.get('/new', (req, res) => {
  console.log('get /articles/new');
  res.render('articles/new', {article: new Article()});
});

router.get('/:slug', async (req, res) => {
  console.log('get /articles/:slug');
  // console.log(req.params.slug);
  const article = await Article.findOne({slug: req.params.slug});
  if (article == null) {
    res.redirect('/');
  }
  res.render('articles/show', {article: article});
});

router.post('/', async (req, res, next) => {
  // console.log('post /articles/');
  // const article = new Article({
  //   title: req.body.title,
  //   description: req.body.description,
  //   markdown: req.body.markdown
  // });
  // try {
  //   let result = await article.save(); // return id
  //   // res.redirect('/articles/test');
  //   res.redirect(`/articles/${result.slug}`);
  // } catch (e) {
  //   console.log(e);
  //   res.render('articles/new', {article: article});
  // }
  console.log('--------------------');
  req.article = new Article();
  next(); // > saveArticleAndRedirect
}, saveArticleAndRedirect('new'));

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  console.log('delete /:id');
  res.redirect('/');
});

router.get('/edit/:slug', async (req, res) => {
  console.log('get /articles:/slug');
  let article = await Article.findOne({slug: req.params.slug});
  res.render('articles/edit', {article: article});
});

router.put('/:slug', async (req, res, next) => {
  req.article = await Article.findOne({slug: req.params.slug});
  next();
}, saveArticleAndRedirect('edit'));

// path: new/edit
function saveArticleAndRedirect (path) {
  return async (req, res) => {
    console.log('post /articles/');
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    // const article = new Article({
    //   title: req.body.title,
    //   description: req.body.description,
    //   markdown: req.body.markdown
    // });
    try {
      let result = await article.save(); // return id
      // res.redirect('/articles/test');
      res.redirect(`/articles/${result.slug}`);
    } catch (e) {
      console.log(e);
      res.render(`articles/${path}`, {article: article}); // path: new/edit
    }
  };
}

module.exports = router;
