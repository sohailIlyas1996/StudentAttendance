const express = require('express');
const router = express.Router();
const studentModel = require('./users'); // Import your student model
const adminModel = require('./admin'); // Import your student model
const passport = require('passport');
const localStrategy=require('passport-local');

passport.use('student-local', new localStrategy(studentModel.authenticate()));

// Strategy for admin authentication
passport.use('admin-local', new localStrategy(adminModel.authenticate()));


router.get('/', async (req, res) => {

    // const allStudents = await studentModel.find({});
    res.render('index', ); // Render 'index.ejs' and pass fetched data
  
});

router.get('/login', async (req, res) => {
  const errorMsg =(req.flash('error')).toString();

  // const allStudents = await studentModel.find({});
  res.render('login',{error: errorMsg} ); // Render 'index.ejs' and pass fetched data

});

router.get('/adminSignup', async (req, res) => {

  // const allStudents = await studentModel.find({});
  res.render('adminsignup', ); // Render 'index.ejs' and pass fetched data

});

router.get('/adminLogin', async (req, res) => {
  const errorMsg =(req.flash('error')).toString();
  // const allStudents = await studentModel.find({});
  res.render('logAdmin',{error:errorMsg} ); // Render 'index.ejs' and pass fetched data

});

router.get('/allstudents',async (req, res) => {
  try {
    const allStudents = await studentModel.find({});
    console.log()
    res.render('studentData', { students: allStudents}); // Render 'index.ejs' and pass fetched data
  
  
  
  
  } catch (err) {
    console.error('Error fetching student data:', err);
    res.status(500).send('Error fetching student data');
  }
});



router.post('/markAttendance/:studentId', async (req, res) => {
  const { status } = req.body; // 'status' will be either 'present' or 'absent'
  const { studentId } = req.params;
  console.log(req.params);

  try {
    const student = await studentModel.findOne({ studentId });

    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Update attendance based on 'status' ('present' or 'absent')
    if (status === 'absent') {
      // Decrease attendance by 2% if marked as 'absent'
      student.attendance -= 2;
      if (student.attendance < 0) {
        student.attendance = 0; // Ensure attendance doesn't go below 0
      }
    } else {
      // Increase attendance if marked as 'present' (Optional)
      student.attendance += 1; // You can set your own logic for 'present'
      if (student.attendance > 100) {
        student.attendance = 100; // Ensure attendance doesn't exceed 100%
      }
    }

    await student.save(); // Save updated attendance

    res.redirect('/allstudents'); // Redirect to the student list page or any other page
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).send('Error marking attendance');
  }
});




router.post('/registerStudent', function(req, res) {
  const {  name,username,password,studentId,className } = req.body;
  console.log( name,username,password,studentId,className);
  const studentData = new studentModel({ name,username,password,studentId,className });
  

  studentModel.register(studentData, password, function(err, user) {
    if (err) {
    console.log(err)
      return res.redirect('/'); // Redirect to home page on registration error
    }

    passport.authenticate('student-local')(req, res, function () {
      res.redirect('/allstudents'); // Redirect to profile after successful registration
    });
  });
});


router.post('/registerAdmin', function(req, res) {
  const { name,username, email,password} = req.body;
  const adminData = new adminModel({name, username, email, password });

  adminModel.register(adminData, password, function(err) {
    if (err) {
console.log(err);
      return  res.send(err)
      //res.redirect('/adminSignup'); // Redirect to home page on registration error
    }

    passport.authenticate('admin-local')(req, res, function () {
      res.redirect('/allstudents'); // Redirect to profile after successful registration
    });
  });
});

router.post('/login',
passport.authenticate('student-local', {
  successRedirect: '/allstudents',
  failureRedirect: '/login',
  failureFlash: true,
}),
function (req, res) {
  console.log('Login Error:', req.flash('error'));
  res.redirect('/login'); // Redirect to login page on authentication error
}
);

router.post('/LoginAdmin',
passport.authenticate('admin-local', {
  successRedirect: '/allstudents',
  failureRedirect: '/adminlogin',
  failureFlash: true,
}),
function (req, res) {
  console.log('Login Error:', req.flash('error'));
  res.redirect('/login'); // Redirect to login page on authentication error
}
);


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  }
  // User is not authenticated, redirect them to the login page or handle as per your application logic
  res.send('/'); // Redirect to login page
}

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


module.exports = router;
