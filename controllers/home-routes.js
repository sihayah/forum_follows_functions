const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models')

router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      attributes: [
        'id',
        'content',
        'title',
        'created_at'
      ],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { 
          posts,
          loggedIn: req.session.loggedIn
         });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'content',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      console.log("get /")
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      const post = dbPostData.get({ plain: true });
      res.render('single-post', { 
        post,
        loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
      return;
  }
  res.render('login')
});

router.get('/sign-up', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
      return;
  }
  res.render('sign-up')
});

    module.exports = router;