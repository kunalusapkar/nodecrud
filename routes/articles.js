const express = require('express');
const router = express.Router();

// Bring in article model
let Article = require('../models/article');

router.get('/add',ensureAuthenticated,function(req,res){
  res.render('add_article',{
    title:'Add Article'
  });
});
// Add submit post route
router.post('/add', function(req,res){
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    // Get Errors
    let errors = req.validationErrors();
    if(errors){
      res.render('add_article',{
        title:'Add Title',
        errors:errors
      });
    }
    else{
      let article =new Article();
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;
      article.save(function(err){
        if(err){
          console.log(err);
        }else{
          req.flash('success','Article added');
          res.redirect('/');
        }
      });
    }

});

// Get single post
router.get('/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render('article',{
      article:article
    });
  });
});
// Load Edit form
router.get('/edit/:id',ensureAuthenticated,function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

// Update submit post route
router.post('/edit/:id',ensureAuthenticated,function(req,res){
    let article ={};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query = {_id:req.params.id}
    Article.update(query,article,function(err){
      if(err){
        console.log(err);
      }else{
        req.flash('success','Article updated');
        res.redirect('/');
      }
    });
});

router.delete('/:id',ensureAuthenticated,function(req,res){
  let query = {_id:req.params.id}
  Article.remove(query,function(err){
    if(err){
      console.log(err);
    }
    res.send('Success')
  });
});

// Access controls
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('danger','Please Login');
    res.redirect('/users/login')
  }
}

// To use this router anywhere
module.exports = router;
