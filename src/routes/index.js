const { Router } = require('express');
const passport = require('passport');
const router = Router();
const {fork} = require('child_process');
const numCpus = require('os').cpus().length;

router.post('/login',passport.authenticate('login',
{ failureRedirect: 'faillogin' }),(req,res) => {
    res.redirect('/')
});

router.get('/faillogin', (req,res) => {
    res.render('login-error', {});
});

router.get("/register", (req, res) => {
    res.render("register");
  });
  
router.post("/register",passport.authenticate("register", { failureRedirect: "/failregister" }),(req, res) => {
    res.redirect("/");
});
  
router.get("/failregister", (req, res) => {
    res.render("register-error", {});
});
  
router.get("/logout", (req, res) => {
    const { username } = req.user;
    req.logout();
    res.render("logout", { username });
});

const checkIsAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render("login");
    }
};
  
router.get("/login", checkIsAuthenticated, (req, res) => {
    res.render("login.hbs");
});
  
router.get("/", checkIsAuthenticated, (req, res) => {
    res.render("home", {
    username: req.user.username,
    });
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

// router.get ('/random', (req,res) =>{
//   cant = req.query.cant;
//   const random = fork('./src/random.js');
//   if(cant == undefined){
//     random.send(1);
//   }else {
//     random.send(cant);
//   }
//   random.on('message', sum => {
//     res.send(`Sum is: ${sum}`);
//   })
// })

router.get("/info", (req,res) => {
  info = {
    pid: process.pid,
    cpus: numCpus,
    os: process.platform,
    NodeVersion: process.version,
    ArgumentosDeEntrada: process.cwd(),
    ProcessTitle: process.title,
    MemoryUsage: process.memoryUsage()
  }
  //console.log(info);
  res.render("info", {info});
}) 


module.exports = router;