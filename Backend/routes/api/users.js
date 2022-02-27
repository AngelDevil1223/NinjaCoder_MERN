const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");

const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateTaskpostinput = require("../../validation/ticketpost");
const validateBidpostinput = require("../../validation/bidpost");


const Messages = require("../../models/Messages");

const Task = require("../../models/Task");

const Message = require('../../models/Message');

// used by me
const Tickets = require('../../models/Tickets');
const Bids = require('../../models/Bids');
const Leaders = require('../../models/Leader');
const Avatars = require('../../models/Avatar');
const AuthUser = require("../../models/AuthUser");
const AvatarRequests = require("../../models/AvatarRequests");

const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');


router.post('/updatetask/:id',(req, res, next) => {

            Task.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },(error,data)=> {
                if(error){
                    return res.status(400).json(error);
               } else {
                    res.json(req.body)
                }
           })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// freelancer register
router.post("/auth/register", (req,res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    AuthUser.findOne({ user_skypeid: req.body.user_skypeid }).then(user => {
        if (user) {
            return res.status(400).json({ user_id: "User Id already exists"});
        } else {
            const newUser = new AuthUser({
                user_id: "",
                user_skypeid: req.body.user_skypeid,
                access: "false",
                password: "",
            });
            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
    
        }
    });
});

// freelancer login
router.post("/auth/login", (req, res) => {
    console.log("this is user_id" + req.body.user_id);
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const UserId = req.body.user_id;
    var UserName = "";
    AuthUser.findOne({ password: UserId }).then(user => {
        if(!user) {
            return res.status(404).json({ Usernotfound: "User not found"});
        }
        if(user.access != "true") {
            errors.role = "your account is inactive";
            return res.status(401).json(errors);
        }
        UserName = user.user_id;

        res.json({
            id:user.user_id,
            sucess:true,
        });
        Leaders.findOne({ Leader_id: UserId }).then(user => {
            if(user) {
                return ;
            }
            else {
                const newLeader = new Leaders({
                    Leader_id: UserId,
                    Leader_Name: UserName,
                    Leader_budget : 0,
                    Leader_success: 0,
                    Leader_avatar: "http://localhost:3000/images/contact.png",
                });
                newLeader
                    .save()
                    .catch(err => console.log(err));
            }
        })
    })
  
});

const reqFiles = [];
// client ticket post
router.post("/ticket/post", (req,res) => {
   
    const { errors, isValid } = validateTaskpostinput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    var uploadurl = ['none'];
    if(reqFiles[0])
        uploadurl = reqFiles;
    console.log(uploadurl + " uploadurl        " + typeof(uploadurl));
    Tickets.findOne({ ticket_name: req.body.ticket_name , ticket_description: req.body.ticket_description }).then(ticket => {
        if (ticket) {
            return res.status(400).json({ email: "That Ticket already exists"});
        } 
        else {
            const newticket = new Tickets({
                ticket_name: req.body.ticket_name,
                ticket_description: req.body.ticket_description,
                ticket_price: req.body.ticket_price,
                ticket_deadline: req.body.ticket_deadline,
                ticket_skills: req.body.ticket_skills,
                ticket_upload: uploadurl,
                ticket_status: "Not Assigned",
                ticket_winner: "none",
                ticket_budget: 0,
                feedback: "",
                review:"",
            });

            newticket
                .save()
                .then(ticket => res.json(ticket))
                .catch(err => console.log(err));
        }
    });
});

// client view all tickets
router.get("/admin/tickets", (req, res) => {
    Tickets.find()
        .then(tickets => {
            res.json(tickets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tickets "
            })
        })
})

//  freelancer view all tickets.
router.get("/freelancer/tickets", (req, res) => {
    Tickets.find()
        .then(tickets => {
            res.send(tickets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tickets "
            })
        })
})

//pagination tickets view
router.post("/get/tickets" , (req, res) => {
    var pagenum = Number(req.body.pagenum);
    var pagesize = Number(req.body.pagesize);
    var start = (pagenum - 1) * pagesize;
    var result1 = {};
    var j = 0 ;
    Tickets.find().then(tickets => {
        for(var i = start ; i <= start+pagesize-1 ; i ++)
        {

            result1[j] = tickets[i];
            j ++;
        }
        res.send(result1);
    })
})

// freelancer get selected ticket information
router.get("/freelancer/tickets/:id", (req, res) => {
    Tickets.findOne({ _id: req.params.id })
        .then(tickets => {
            res.send(tickets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tickets "
            })
        })

})

// freelancer get selected task biders
router.get("/freelancer/biders/:id" , (req, res) => {

    Bids.find({ ticket_id: req.params.id }).then( biders => {
        res.send(biders);
    }) 
    .catch(err => {
        res.status(500).send( {
            message: err.message || "some error occured while retrieving bids"
        })
    })
})

// freelancer can bid 
router.post("/freelancer/bid" , (req, res) => {

    const { errors, isValid } = validateBidpostinput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Bids.findOne({ ticket_id: req.body.ticket_id , bider_id: req.body.bider_id }).then(bid => {
        if (bid) {
            return res.status(400).json({ user_id: "You already bidded"});
        } else {
            const newBid = new Bids({
                ticket_id: req.body.ticket_id,
                bid_price: req.body.bid_price,
                bid_description: req.body.bid_description,
                bid_deadline: req.body.bid_deadline,
                bider_id: req.body.bider_id,
                bider_url: req.body.bider_url,
            });
            newBid
                .save()
                .then(Bids => res.json(Bids))
                .catch(err => console.log(err));
    
        }
    });

})

// freelancers can view 5 leaders 
router.get("/get/leaders" , (req, res) => {
    Leaders.find().sort({Leader_budget: -1}).limit(5)
    .then(biders => {
        res.send(biders);
    })
    .catch(err => {
        res.status(500).send( {
            message: err.message || "some error occured while retrieving bids"
        })
    })
       
})

// Insert avatars
router.post("/insert/avatars" , (req, res) => {
    Avatars.findOne({ ava_url : req.body.ava_url }).then(avatar => {
        if(avatar) {
            return res.status(400).json("That avatar is already exist");
        }
        else {
            const newAvatar = new Avatars({
                ava_url: req.body.ava_url ,
                ava_status: 0 ,
                ava_budget: req.body.ava_budget ,
                user_id: "",
                ava_level: req.body.ava_level,
            });
            newAvatar
                .save()
                .then(avatars => res.json(avatars))
                .catch(err => console.log(err));
        }
    })
})

// GET all avatars
router.get("/get/avatars" , (req, res) => {
    Avatars.find().then(avatar => {
        res.send(avatar);   
    });
})

//  get current users avatar 
router.get("/get/avatars/:id" , (req, res) => {
    Leaders.findOne({Leader_Name: req.params.id}).then(result => {
        res.send(result);
    })
    .catch(err=>res.send(err));
})

// Avatar Request from freelancers 

router.post("/sell/avatar" ,(req, res) => {
    console.log(req.body.avatar_url + req.body.request_id);
    var condition = {$and:[{Avatar_url: req.body.avatar_url} , {request_id: req.body.request_id}]};
    AvatarRequests.findOne(condition)
    .then(user => {
        if (!user) {
            // res.status(400).send("you are already requested");
            const newAvatarRequest = new AvatarRequests({
                Avatar_url: req.body.avatar_url ,
                request_id: req.body.request_id ,
                status: "false",
            });
            newAvatarRequest
                .save()
                .then(avatars => res.json(avatars))
                .catch(err => console.log(err));
        }
        else {
            res.status(400).send("you are already requested");
        }
    })
})


// when admin clicked true btn about avatar request

router.post("/permission/avatar", (req, res)=> {
    const filter = {$and:[ { Avatar_url: req.body.avatar_url  }, {request_id: req.body.request_id}]};
    var update = { $set: {status: "true"} };
    let doc =AvatarRequests.updateOne(filter, update , function(err, result) {
        if(err) 
            throw err;
        else {
            var condition = { Leader_Name: req.body.request_id };
            var newvalues = { $set: {Leader_avatar: req.body.avatar_url} };
            Leaders.updateOne(condition, newvalues , function(err1, res1) {
                if(err1) throw err1;
                else {
                    var condition1 = {ava_url: req.body.avatar_url};
                    var newvalues1 = {$set:{ava_status: 1}};
                    Avatars.updateOne(condition1 , newvalues1 , function(err2 , res2) {
                        if(err2) throw err2;
                        res.send(res2);
                    })
                }
            })
        }
    });
})


// get all document in tickets table 

router.get("/get/cnttickets", (req,res) => {
    Tickets.find().then(result => {
      var count = result.length;
      res.status(200).json(count);
    });
})


// Award the bider to task 

router.post("/award/ticket" , (req, res) => {
    const filter = { _id : req.body.ticket_id };
    var update = { $set: {ticket_status:"Assigned" , ticket_winner: req.body.bider_id , ticket_budget: req.body.bider_price , winner_avatar: req.body.bider_url , winner_deadline: req.body.bider_deadline }};
    let doc = Tickets.updateOne(filter , update , function(err , result) {
        if(err) 
            throw err;
        else
            res.send(result);
    });
})


// Select changed (Complete , InComplete) then updated status and insert leaders.leader_success and leaders.leader_budget

router.post("/status/changed", (req, res) => {
    const filter = { _id: req.body._id };
    var update = { $set: {ticket_status: req.body.value }};
    let doc = Tickets.updateOne(filter, update , function(err , result) {
        if(err)
            throw err;
        else {
            var donecnt = 0;
            var nocnt = 0;
            var budget = 0;
            var success = 0;
            Tickets.find({ticket_winner: req.body.user}).then(result1 => {
                for(var i = 0 ; i < result1.length ; i++){
                    if(result1[i].ticket_status == "Complete") {
                        budget = budget + result1[i].ticket_budget;
                        donecnt = donecnt + 1;
                    }
                    else if(result1[i].ticket_status == "InComplete") {
                        nocnt = nocnt + 1;
                    }
                }
                success = (donecnt / (donecnt + nocnt)) * 100;
                const filter1 = { Leader_Name : req.body.user };
                var update1 = { $set: {Leader_budget: budget , Leader_success: success }};
                let doc1 = Leaders.updateOne(filter1 , update1 , function(err1 , result1) {
                    res.send(result1);
                })
            })
        }
    });
})


//  selected avatar requests list view for admin user

router.post("/view/asklist" , (req, res) => {
    console.log(req.body.id);
    AvatarRequests.find({Avatar_url : req.body.id}).then(result=>{
        res.send(result);
    })
})



const DIR = './public'; 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (_req, file, cb) => {
        cb(null, true);
    }
});

// file upload part

router.post('/upload-images', upload.array('imgCollection', 36), (req, res, next) => {
    console.log("this is receivedd file" + req.files);

    if (req.files.length == 0) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
      }
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + '/public/' + req.files[i].filename)
    }
    res.send(reqFiles);



    // const user = new User({
    //     _id: new mongoose.Types.ObjectId(),
    //     imgCollection: reqFiles
    // });

    // user.save().then(result => {
    //     res.status(201).json({
    //         message: "Done upload!",
    //         userCreated: {
    //             _id: result._id,
    //             imgCollection: result.imgCollection
    //         }
    //     })
    // }).catch(err => {
    //     console.log(err),
    //         res.status(500).json({
    //             error: err
    //         });
    // })

})

router.post("/submit/result" , (req, res)=> {
    console.log(req.body.id + req.body.feedback + req.body.review);
    const filter = { _id: req.body.id };
    var update = { $set: {feedback: req.body.feedback , review: req.body.review }};
    let doc = Tickets.updateOne(filter, update , function(err , result) {
        res.send(result);
    })
});





































router.delete("/delete-user/:id", (req, res)=> {
    User.findByIdAndRemove(req.params.id)
        .then(user=>{
            if (!user) {
                return res.status(404).send({
                    message:"User not found with id" + req.params.id
                })
            }
            //res.send({message:"User deleted sucessfully"});
            User.find()
                .then(users => {
                    res.send(users);
                })
        }).catch(err=>{
            if(err.kind === 'ObjectId' || err.name === 'UserFound'){
                return res.status(404).send({
                    message:"User not found with id"+req.params.users
                })
            }
            return res.status(500).send({
                message:"Could not delete user  with id"+req.params.id
            })
        })
})


router.delete("/delete-task/:id", (req, res)=> {
    Task.findByIdAndRemove(req.params.id)
        .then(task=>{
            if (!task) {
                return res.status(404).send({
                    message:"User not found with id" + req.params.id
                })
            }
            //res.send({message:"User deleted sucessfully"});
            Task.find()
                .then(tasks => {
                    res.send(tasks);
                })
        }).catch(err=>{
            if(err.kind === 'ObjectId' || err.name === 'UserFound'){
                return res.status(404).send({
                    message:"User not found with id"+req.params.users
                })
            }
            return res.status(500).send({
                message:"Could not delete user  with id"+req.params.id
            })
        })
})
  
router.get("/user/:id", (req, res)=> {
  
    const id = req.params.id; 
    User.findOne({_id:id})
        .then(user=>{
            if (!user) {
                return res.status(404).send({
                    message:"User not found with id" + req.params.id
                })
            }
            res.send(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving users "
            })
        })
}) 

router.route('/update-user/:id').put((req, res, next)=>{
    const data = req.body;
    const oldpassword = data.oldpassword;
    User.findOne({_id:req.params.id})
        .then(user=>{
            //  bcrypt.compare(oldpassword, user.password).then(isMatch => {
            //      if (!isMatch) {
                      let errors = {};
            //          errors.oldpassword = "Current  password is not matched";
            //          return res.status(404).json( errors);
            //      } else{
            //          const { errors, isValid } = validateRegisterInput(req.body);
            //          if (!isValid) {
            //              return res.status(400).json(errors);
            //          }

                     user.userid = data.userid;
                     user.name = data.name;
                     user.email = data.email;
                    //  const password = data.password;
                     user.formdata = data.formData;
                    //console.log(user.formdata)
                    // bcrypt.genSalt(10, (err, salt)=>{
                    //     bcrypt.hash(password, salt, (err,hash) => {
                    //         if (err) throw err;
                    //         password = hash;
                    //     });
                    // })
                     //data.password = password;
                    // console.log(data)
                     User.findByIdAndUpdate(req.params.id,{
                          $set:user
                      },(error,data)=> {
                          if(error){
                              return res.status(400).json(error);
                         } else {
                              res.json(data)
                          }
                     })

                 })
              })   
// })})


router.route('/change-action/:id').put((req, res, next)=>{
    const data = req.body;
    //console.log(data)
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error)
            console.log(error)
        } else {
            res.json(data)
        }
    })
}
)

// const DIR = 'public'; 

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.toLowerCase().split(' ').join('-');
//         cb(null, uuidv4() + '-' + fileName)
//     }
// });

// var upload = multer({
//     storage: storage,
//     fileFilter: (_req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         }
//     }
// })

// router.post('/updateuser/:id',upload.array('imgCollection',6),(req, res, next) => {
    
//     // const reqFiles = [];
//     // if (req.files.length == 0) {
//     //     const error = new Error('Please choose files')
//     //     error.httpStatusCode = 400
//     //     return next(error)
//     //   }
//     // //const url = req.protocol + '://' + req.get('host')
//     // const url = 'http://10.10.10.193:5000';
//     // for (var i = 0; i < req.files.length; i++) {
//     //     reqFiles.push(url + '/public/' + req.files[i].filename)
//     // }
//     User.findOne({_id:req.params.id})
//         .then(user=>{
//             const reqFiles = [];
//             if (req.files.length == 0) {
//                 // const error = new Error('Please choose files')
//                 // error.httpStatusCode = 400
//                 // return next(error)
//               } else {
//                 const url = req.protocol + '://' + req.get('host');
//                 const url1 = 'http://10.10.10.193:5000';
//                 for (var i = 0; i < req.files.length; i++) {
//                     reqFiles.push(url + '/public/' + req.files[i].filename)
//                 }
//                 user.imgurl = reqFiles;                  
//               }

//             user.name = req.body.name;
//             user.userid = req.body.userid;
//             User.findByIdAndUpdate(req.params.id,{
//                 $set:user
//             },(error,data)=> {
//                 if(error){
//                     return res.status(400).json(error);
//                } else {
//                     res.json(data)
//                 }
//            })
//         })
// })

// router.post('/upload-images/',upload.array('imgCollection',6),(req, res, next) => {
//     const reqFiles = [];
//     if (req.files.length == 0) {
//         const error = new Error('Please choose files')
//         error.httpStatusCode = 400
//         return next(error)
//       }
//     const url = req.protocol + '://' + req.get('host')
//     //const url = 'http://10.10.10.193:5000';
//     for (var i = 0; i < req.files.length; i++) {
//         reqFiles.push(url + '/public/' + req.files[i].filename)
//     }

//     const { errors, isValid } = validateRegisterInput(req.body);

//     if (!isValid) {
//         return res.status(400).json(errors);
//     }

//     User.findOne({ email: req.body.email }).then(user => {
//         if (user) {
//             return res.status(400).json({ email: "Email already exists"});
//         } else {
//             const newUser = new User({
//                 name: req.body.name,
//                 userid: req.body.userid,
//                 email: req.body.email,
//                 password: req.body.password,
//                 imgurl: reqFiles,
//                 role: req.body.role,   
//                 admin: "user"             
//             });

//             bcrypt.genSalt(10, (err, salt)=>{
//                 bcrypt.hash(newUser.password, salt, (err,hash) => {
//                     if (err) throw err;
//                     newUser.password = hash;
//                     newUser
//                         .save()
//                         .then(user => res.json(user))
//                         .catch(err => console.log(err));
//                 });
//             });
//         }
//     });
    
// })

router.get("/search/:id", (req, res)=> {
    if (req.params.id == ''){
        User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving users "
            })
        })
    } else{
    const searchname = req.params.id;
    User.find({ name: searchname})
        .then(user => {
            if(user){
                res.json(user);
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving users "
            })
        })
    }
})

router.post('/addtask/',upload.array('imgCollection',6),(req, res, next) => {
    const reqFiles = [];

    if (req.files.length == 0) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
      }
    const url = req.protocol + '://' + req.get('host')
    //const url = 'http://10.10.10.193:5000';
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + '/public/' + req.files[i].filename)
    }

    // const { errors, isValid } = validateRegisterInput(req.body);

    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    // Task.findOne({ email: req.body.email }).then(user => {
    //     if (user) {
    //         return res.status(400).json({ email: "Email already exists"});
    //     } else {

            const now = new Date();
            const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Oug', 'Sep', 'Oct', 'Nov', 'Dec']
            const date = month[now.getMonth()]+" "+now.getDate()+","+now.getFullYear(); 


            const newTask = new Task({
                client: req.body.client,
                tasktitle: req.body.tasktitle,
                country: req.body.country,
                level: req.body.level,
                imgurl: reqFiles,
                type: req.body.type,
                budget: req.body.budget,
                deadline: req.body.deadline,
                description: req.body.description,
                payment: req.body.payment,
                date: date,
                progress: 0,
                active: "active",
                id: req.body.id

            });

            // bcrypt.genSalt(10, (err, salt)=>{
            //     bcrypt.hash(newUser.password, salt, (err,hash) => {
            //         if (err) throw err;
            //         newUser.password = hash;
                    newTask
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
    //             });
    //         });
    //     }
    // });
    
})

// Post global message
router.post('/addGlobalMessage', (req, res) => {
    let message = new GlobalMessage({
        from: mongoose.Types.ObjectId(req.body.from),
        body: req.body.message
    });
    req.io.sockets.emit('messages', req.body.message);

    message.save(err => {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Failure' }));
            res.sendStatus(500);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Success' }));
        }
    });
});

// Post private message
router.post('/addPrivateMessage', (req, res) => {
    let from = mongoose.Types.ObjectId(req.body.from);
    let to = mongoose.Types.ObjectId(req.body.to);

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [req.body.from, req.body.to],
            lastMessage: req.body.message,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function(err, conversation) {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: req.body.from,
                    body: req.body.message,
                });

                req.io.sockets.emit('messages', req.body.message);

                message.save(err => {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Failure' }));
                        res.sendStatus(500);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        );
                    }
                });
            }
        }
    );
});

// Get conversations list
router.get('/conversations/:id', (req, res) => {
    
    let from = mongoose.Types.ObjectId(req.params.id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});

// Get global messages
router.get('/global_messages', (req, res) => {
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .project({
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

// Get messages from conversation
// based on to & from
router.get('/private_conversations/query', (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.query.from);
    let user2 = mongoose.Types.ObjectId(req.query.to);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

module.exports = router;