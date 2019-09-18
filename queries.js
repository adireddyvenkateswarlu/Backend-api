var express = require('express');
var router = express.Router();
// var pool=require('./config')
const Helper = require('./users');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'venky',
  host: 'localhost',
  database: 'api',
  password: 'venky',
  port: 5432,
})
// pool.connect(err=>(!err)?Database is connected:'Error while connecting with database');

pool.connect(function (err) {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});



router.register = (req, res) => {
  //   var password_pattern = /[a-z0-9_]{3,10}/i;
  // if (!password_pattern.test(password,confirmpassword)) {
  //   return res.status(200).send({  'message': 'please enater numaric alphabets' }); 
  // }

  if (!req.is('application/json')) {
  }

  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const confirmpassword = req.body.confirmpassword;
  if (!req.body.email || !req.body.password) {
    return res.status(200).send({ 'message': 'Invalid details' });
  }

  if (!Helper.isValidEmail(req.body.email)) {
    return res.status(200).send({ 'message': 'Please enter a valid email address' });
  }
  if (password !== confirmpassword) {
    return res.status(200).send({ 'message': 'please Enter same password' });
  }

 const psql='INSERT INTO register (email, password,username,confirmpassword) VALUES ($1, $2,$3,$4)';

  pool.query(psql,[email, password, username, confirmpassword], (error, result) => {

      if (error) {
        res.status(400).send({
          status: false,
          data: result,
          message: 'user register already'
        })
      }
      else {
        res.status(200).send({
          status: true,
          message: 'user registered sucessfully',
          // data: [{  email: result.rows[0].email, password: result.rows[0].password ,username:result.rows[0].username,confirmpassword:result.rows[0].confirmpassword }]
        })
      }

    });

}


// authintication
router.authenticate = (req, res) => {
  const email = req.body.email;
  const passWord = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  if (!req.body.email || !req.body.password) {
    return res.status(200).send({ 'message': 'Invalid details' });
  }
  const psql = "select * from register WHERE email = '" + email + "' ";

  pool.query(psql, function (err, result) {
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(200).send({ status: false, 'message': 'Please enter a valid email address' });
    }
    // if (!Helper.comparePassword(hashPassword,req.body.password )) {
    //   return res.status(200).send({ 'message': 'Please enter a valid email address' });
    // }
    if (err) {
      res.status(404).send({
        message: "login error",
        status: false
      })
    } else {
      if (result.rows.length > 0) {
        if (result.rows[0].password === passWord || result.rows[0].confirmpassword === confirmpassword) {
          res.status(200).send({
            status: true,
            message: "Login successful",
            data: [{ userid: result.rows[0].userid, email: result.rows[0].email, password: result.rows[0].password }]

          })
        } else {
          res.status(200).send({
            status: false,
            message: "Password wrong"
          })
        }

      } else {
        res.send({
          status: false,
          message: "Login Failed",
          statuscode: 200,
        })
      }
    }
  })
}

// player

router.players = (request, response) => {
  pool.query('SELECT * FROM account ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

// customers details
router.getUsers = (request, response) => {
  pool.query('SELECT * FROM customers ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

router.getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM customers WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// router.getUserByName = (request, response) => {
//const name =request.query.name;
// const id=request.query.id;
// console.log(name);
// pool.query("SELECT * FROM customers WHERE name = '"+id+"' OR id = '"+id+"'", (error, result) => {
//     if (error) {
//       console.log(error)
//       response.status(400).send(error);
//       throw error
//     }
//     response.status(200).json(result.rows)
//   })

// }

router.getUserByName = (request, response) => {
  const name = request.query.name;
  // const id=request.query.id;
  console.log(name);
  pool.query("SELECT * FROM customers WHERE name = '" + name + "'", (error, result) => {
    if (error) {
      console.log(error)
      response.status(400).send(error);
      throw error
    }
    response.status(200).json(result.rows)
  })

}


router.createUser = (request, response) => {
  if (!request.is('application/json')) {
  }
  const { name, email } = request.body

  pool.query('INSERT INTO customers (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send({ 'message': 'successfully added' });
  })
}

router.updateUser = (request, response) => {
  if (!request.is('application/json')) {
  }
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE customers SET name = $1, email = $2 WHERE id = $3', [name, email, id], (error, results) => {
      if (error) {
        response.status(400).send(error);
        throw error

      }
      response.status(200).send({ 'message': 'successfully updated', "data": 'true' });
    }
  )
}

router.deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM customers WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send({ 'message': 'successfully delete' })
  })
}

// users details

router.getusers = (request, response) => {
  const psql = 'SELECT * FROM users ORDER BY id ASC';
  pool.query(psql, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

router.getusersid = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

router.getusersByName = (request, response) => {

  const name = request.query.name;
  const id = request.query.id;
  console.log(name);
  pool.query("SELECT name FROM users WHERE  name = '" + name + "'", (error, result) => {
    if (error) {
      console.log(error)
      response.status(400).send(error);
      throw error
    }
    response.status(200).json(result.rows)
  })

}


router.createusers = (request, response) => {
  if (!request.is('application/json')) {
  }
  const { name, email } = request.body;

  pool.query('INSERT INTO users (name,email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send({ 'message': 'successfully added' });
  })
}

router.updateusers = (request, response) => {
  if (!request.is('application/json')) {
  }
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], (error, results) => {
      if (error) {
        response.status(400).send(error);
        throw error

      }
      response.status(200).send({ 'message': 'successfully updated', "data": 'true' });
    }
  )
}

router.deleteUsers = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send({ 'message': 'successfully delete' })
  })
}



// reservation

router.getreservation = (request, response) => {
  pool.query('SELECT * FROM reservation  ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

router.getreservationid = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM reservation WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// router.getUserByName = (request, response) => {

//       const name =request.query.name;
//       const id=request.query.id;
//       console.log(name);
//       pool.query("SELECT * FROM customers WHERE  name = '"+name+"'", (error, result) => {
//     if (error) {
//       console.log(error)
//       response.status(400).send(error);
//       throw error
//     }
//     response.status(200).json(result.rows)
//   })

// }


router.createreservation = (request, response) => {
  if (!request.is('application/json')) {
  }
  const { check_in, check_out, made_by } = request.body

  pool.query('INSERT INTO reservation (check_in, check_out,made_by) VALUES ($1,$2,$3)', [check_in, check_out, made_by], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send({ 'message': 'successfully added' });
  })
}

router.updatereservation = (request, response) => {
  if (!request.is('application/json')) {
  }
  const id = parseInt(request.params.id)
  const { check_in, check_out, made_by } = request.body

  pool.query(
    'UPDATE reservation SET check_in = $1, check_out = $2,made_by = $3 WHERE id = $4', [check_in, check_out, made_by, id], (error, results) => {
      if (error) {
        response.status(400).send(error);
        throw error

      }
      response.status(200).send({ 'message': 'successfully updated', "data": 'true' });
    }
  )
}

router.deletereservation = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM reservation WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send({ 'message': 'successfully delete' })
  })
}

// reserverd_rooms
router.getreservedrooms = (request, response) => {
  pool.query('SELECT * FROM  reserved_room  ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

router.getreservedroomsid = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM  reserved_room WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

router.createreservedrooms = (request, response) => {
  if (!request.is('application/json')) {
  }
  const { number_of_rooms, reservation_id, status } = request.body

  pool.query('INSERT INTO  reserved_room (number_of_rooms,reservation_id,status ) VALUES ($1,$2,$3)', [number_of_rooms, reservation_id, status], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send({ 'message': 'successfully added' });
  })
}

router.updatereservedrooms = (request, response) => {
  if (!request.is('application/json')) {
  }
  const id = parseInt(request.params.id)
  const { number_of_rooms, reservation_id, status } = request.body


  pool.query(
    'UPDATE  reserved_room SET number_of_rooms = $1,reservation_id= $2,status= $3 WHERE id = $4', [number_of_rooms, reservation_id, status, id], (error, results) => {
      if (error) {
        response.status(400).send(error);
        throw error

      }
      response.status(200).send({ 'message': 'successfully updated', "data": 'true' });
    }
  )
}

router.deletereservedrooms = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM  reserved_room WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send({ 'message': 'successfully delete' })
  })
}


module.exports = router;
// {
//   getUsers,
//   getUserById,
//   getUserByName,
//   createUser,
//   updateUser,
//   deleteUser,
// }