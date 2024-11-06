db.emp.bulkWrite([
    {
        insertOne:{
            document:{
                name:'Bhargav',
                course:'MongoDB'
            }
        }
    },{
        insertOne:{
            document:{
                name:'Miller',
                course:'NodeJs'
         }
        }
    },
    {
        updateOne:{
            filter:{
                name:'Miller'
            },
            update:{
                $set:{
                    course:"MongoDB"
                }
            },upsert:true
        }
    },
    {
        deleteOne:{
            filter:{
                name:'Miller'
            }
        }
    },
    {
        replaceOne:{
            filter:{
                name:'Miller'
            },
            replacement:{age:23}
        }
    }
])


/////////////////////////////////////////////////////////////////////////////////////////////////
// using Element Operator
//waqtd whether the department number field is present or Not
db.emp.find({skills:{$exists:true}})

//waqtd the documents based on skills field using type operator
db.emp.find({skills:{$type:"array"}})

//waqtd whether the employes number field is present or not
db.emp.find({empno:{$exists:true}})

//waqtd the documents based ons salary:35769.897 field using type operator
db.emp.find({salary:{$type:'double'}})

//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////  Data Modeling //////////////////////////////////////////
 /// Creating schema /////

 db.createCollection('chocolate',{
        validator:{
            $jsonSchema:{
                bsonType:'object',
                required:['name','price','descp'],
                properties:{
                    name:{
                        bsonType:'string',
                        description:'name should be string'
                    },
                    price:{
                        bsonType:'double',
                        description:'price should be double'
                    },
                    descp:{
                        bsonType:'string',
                        description:'description should be string'
                    },
                    status:{
                        bsonType:'string',
                        description:'should be string'
                    }
                }
            }
        }
    }
 )

 //insert values
 db.chocolate.insertMany([
    {
        name:'Fivestar',
        price:20.20,
        descp:'Eat Fivestar do nothing'
    },
    {
        name:'Snickers',
        price:35.50,
        descp:'Hungry..? Grab a Snicker'
    },
 ])

////////////////////////////////////////////////////////////////////////////////////////////////
// assignment
 db.createCollection('zomato',{
    validator:{
        $jsonSchema:{
            bsonType:'object',
            required:['orderid','ordername','price','quantity','rating','starters'],
            properties:{
                orderid:{
                    bsonType:'number',
                    description:'orderid should be in number'
                },
                ordername:{
                    bsonType:'string',
                    description:'ordername should be string'
                },
                price:{
                    bsonType:'double',
                    description:'price should be double'
                },
                quantity:{
                    bsonType:'number',
                    description:'quantity should be number'
                },
                rating:{
                    bsonType:'object',
                    required:['rate1','rate2'],
                    properties:{
                    rate1:{
                        bsonType:'double',
                        description:'rate1 should be in double'
                    },
                    rate2:{
                        bsonType:'double',
                        description:'rate2 should be in double'
                    }
                }
                },
                starters:{
                    bsonType:'array',
                }
            }
        }
    }
}
)

db.zomato.insertOne(
    {
        orderid:101,
        ordername:'Biryani',
        price:230.20,
        quantity:1,
        rating:{ 
             rate1:200.20,
             rate2:100.10
        },
        starters:['vada','mini idli']
    },
)

///////////////////////////////////////////////////////////////////////////////////////////////

//schema is there are not in a collection
db.getCollectionInfos([name:'collection name'])

///////////////////////////////////////////////////////////////////////////////////////////////

//to modify schema
db.runCommand({
    collMod:'chocolate',
    validator:{
        '$jsonSchema': {
          bsonType: 'object',
          required: [ 'name', 'price', 'descp' ],
          properties: {
            name: {
              bsonType: 'string',
              description: 'name should be string'
            },
            price: {
              bsonType: 'double',
              description: 'price should be double'
            },
            descp: {
              bsonType: 'string',
              description: 'description should be string'
            },
            isAvailable:{
                bsonType:'bool',
                description:'isAvailable should be true or false'
            }
          }
        }
    }
})
//insert values
db.chocolate.insertMany([
    {
        name:'Fivestar',
        price:20.20,
        descp:'Eat Fivestar do nothing',
        isAvailable:true
    },
    {
        name:'Snickers',
        price:35.50,
        descp:'Hungry..? Grab a Snicker',
        isAvailable:false
    },
 ])

 ///////////////////////////////////////////////////////////////////////////////////////////////////////

 //relationship
 // 1 to 1

 db.student.insertOne({
    name:'raju',
    age:20,
    phoneNumber:4567809876,
    address:{
        state:'Karnataka',
        city:'bangalore',
        pincode:570076
    },
    skills:['js','html','nodejs','mongodb','express']
 })

 //1 to 1 using reference document
 db.student1.insertOne({
    name:'raju',
    age:20,
    phoneNumber:8681553891,
    skills:['js','html','nodejs','mongodb','express']
 })

 db.studentAddress.insertOne({
    address:{
        state:'Karnataka',
        city:'bangalore',
        pincode:570076
    }
 })
//joining studentAddress in student1
 db.student1.updateOne({name:'raju'},{$set:{currentplace:ObjectId('66eac09750bacdc7602710bf')}})

//if we use this aggregate method only we can see studentAddress data inside the student1
// if we use find() method means we will get only the Objectid of studentAddress collection
 db.student1.aggregate({
    $lookup:{
        from:"studentAddress",
        localField:"currentplace",
        foreignField:"_id",
        as:"place"
    }
 })
 //answer
 [
    {
      _id: ObjectId('66eabeff50bacdc7602710be'),
      name: 'raju',
      age: 20,
      phoneNumber: 8681553891,
      skills: [ 'js', 'html', 'nodejs', 'mongodb', 'express' ],
      currentplace: ObjectId('66eac09750bacdc7602710bf'),
      place: [
        {
          _id: ObjectId('66eac09750bacdc7602710bf'),
          address: { state: 'Karnataka', city: 'bangalore', pincode: 570076 }
        }
      ]
    }
  ]

/////////////////////////////////////////////////////////////////////////////////////////////////////

  // 1 to many relationship
  //reference document (or) original document
db.land.insertOne({
    price:300000,
    acres:3,
    owners:[
        {
            name:'Jamindar1',
            Money:100000
        },
        {
            name:'Jamindar2',
            Money:100000
        },
        {
            name:'Jamindar3',
            Money:100000
        }
    ]
})
//we are adding another one field
db.land.updateOne({acres:3},{$set:{
    place:{
        state:'karnataka',
        city:'bangalore'
    }
}})

//we are splitting the reference document into 2
db.land1.insertOne({
    price:600000,
    acres:6
})

db.owners.insertMany([
    {
        name:'Jamindar1',
        Money:200000
    },
    {
        name:'Jamindar2',
        Money:200000
    },
    {
        name:"Jamindar3",
        Money:200000
    }
])

//joining owners in land1 
db.land1.updateOne({acres:6},{$set:{ownersid:[
    ObjectId('66ead4be53d01882d52710be'),
    ObjectId('66ead4be53d01882d52710bf'),
    ObjectId('66ead4be53d01882d52710c0')
]}})

//if we use this aggregate method only we can see owners data inside the land1
// if we use find() method means we will get only the Objectid of owners collection
db.land1.aggregate([
    {
        $lookup:{
            from:"owners",
            localField:"ownersid",    //name givened for joining
            foreignField:"_id",
            as:"ownerdetail"   //alias name
        }
    }
])
//answer
[
    {
      _id: ObjectId('66ead43a53d01882d52710bd'),
      price: 600000,
      acres: 6,
      ownersid: [
        ObjectId('66ead4be53d01882d52710be'),
        ObjectId('66ead4be53d01882d52710bf'),
        ObjectId('66ead4be53d01882d52710c0')
      ],
      ownerdetail: [
        {
          _id: ObjectId('66ead4be53d01882d52710be'),
          name: 'Jamindar1',
          Money: 200000
        },
        {
          _id: ObjectId('66ead4be53d01882d52710bf'),
          name: 'Jamindar2',
          Money: 200000
        },
        {
          _id: ObjectId('66ead4be53d01882d52710c0'),
          name: 'Jamindar3',
          Money: 200000
        }
      ]
    }
  ]

//////////////////////////////////////////////////////////////////////////////////////////////////  

//many to many relationship
//here we don't have embedded (or) original document
db.books.insertMany([
    {
        bookName:'mongodb',
        pages:100
    },
    {
        bookName:'nodejs',
        pages:200
    },
    {
        bookName:'java',
        pages:300
    },
    {
        bookName:'javascript',
        pages:150
    }
])

db.authors.insertMany([
    {
        authorName:'Irfan',
        version:1
    },
    {
        authorName:'Anandh',
        version:2
    },
    {
        authorName:'Koushik',
        version:3
    },
    {
        authorName:'jakir',
        version:4
    }
])
alary
d
 
db.books.updateOne({bookName:'javascript'},{$set:{authors:[ObjectId('66ec102b9fdd5793452710c0'),ObjectId('66ec102b9fdd5793452710c1')]}})

db.books.aggregate([
    {
        $lookup:{
            from:"authors",
            localField:"authors",
            foreignField:"_id",
            as:"authors"
        }
    }
])

//update in authors also
db.authors.updateOne({authorName:'Koushik'},{$set:{books_written:[ObjectId('66ec0fb19fdd5793452710bc'),ObjectId('66ec0fb19fdd5793452710be'),ObjectId('66ec0fb19fdd5793452710bd')]}})

db.authors.aggregate([{
    $lookup:{
        from:"books",
        localField:"books_written",
        foreignField:"_id",
        as:"books"
    }
}])

//field update operator
$inc: //it will increase the value {it will take only numerals}
$min: //updating value must be lesser than field value {it will take only numerals}
$max: //updating value must be greater than field value {it will take only numerals}
$set:  //we already used
$unset:
$rename:
$mul: //multiplication 

//$inc
//1.waqt update sal of smith to 1000
db.emp.updateMany({ename:'smith'},{$inc:{sal:1000}})

//2.waqt update commision of king to 500
db.emp.updateMany({ename:'king'},{$inc:{comm:500}})

//3.waqt update salary of jones to 3000 give as sb.emp.updateMany({ename:'jones'},{$inc:{salary:3000}})

//$min
//1.waqt update salary of james to 1000
db.emp.updateMany({ename:'james'},{$min:{sal:1000}})

//2.waqt update commision of james to 500 take commision as field name
db.emp.updateMany({ename:'james'},{$min:{commission:500}})

//$max
//1.waqt update the document of king salary to 6000
db.emp.updateMany({ename:'king'},{$max:{sal:6000}})

//2.waqt update the document of king comm as 1000 take commission as field name
db.emp.updateMany({ename:'king'},{$max:{commission:1000}})

//$mul
//1.waqt update Fivestar document in chocolate db price multiply by 5
db.chocolate.updateMany({name:'Fivestar'},{$mul:{price:5}})

//2.waqt update Fivestar document in chocolate db prices multiply by 2 take field name as price
db.chocolate.updateMany({name:'Fivestar'},{$mul:{prices:2}})
//it creates new field as prices and insert the value as 0

//$unset
//1.waqt delete salary field in jones document
db.emp.updateMany({ename:'jones'},{$unset:{salary:""}})
//we should not remove required field in schemaa
//we can remove only unrequired fields only

//$rename
//1.waqt rename king document commission field as comms
db.emp.updateMany({ename:'king'},{$rename:{commission:"comms"}})
//here we can rename only field names


//Array Update Operators

db.persons.insertMany([{
    name:'vignesh',
    age:22,
    gender:'male',
    empno:35462,
    address:{
        state:'KA',
        city:"BNG",
    },
    experience:[
        {company:'ibm',duration:2},
        {company:'accenture',duration:4},
        {company:'jp morgan',duration:10},
        {company:'zoho',duration:12}
    ]
},
{
    name:'anand',
    age:21,
    gender:'male',
    empno:67862,
    address:{
        state:'Bihar',
        city:"NLD",
    },
    experience:[
        {company:'apple',duration:5},
        {company:'black rock',duration:2},
        {company:'tyss',duration:8},
        {company:'alpha',duration:15}
    ]
},
{
    name:'akhilesh',
    age:24,
    gender:'male',
    empno:78962,
    address:{
        state:'Kerala',
        city:"KTY",
    },
    experience:[
        {company:'samsung',duration:8},
        {company:'vivo',duration:1},
        {company:'24/7.ai',duration:7},
        {company:'zoho',duration:20}
    ]
},
{
        name:'suraj',
        age:20,
        gender:'male',
        empno:89662,
        address:{
            state:'UP',
            city:"SLN",
        },
        experience:[
            {company:'qualcomm',duration:12},
            {company:'concentrix',duration:6},
            {company:'jp morgan',duration:10},
            {company:'cloud nine',duration:15}
        ]
}
])
// 1. $
// 2. $[]
// 3. $[identifier]
// 4. $pop
// 5. $push
// 6. $pull
// 7. $each
// 8. $addToSet

//1. $
db.persons.updateMany({experience:{$elemMatch:{duration:{$gte:5}}}},{$set:{'experience.$.experiencedCandidate':true}})

//2. $[]
db.persons.updateMany({experience:{$elemMatch:{duration:{$gte:20}}}},{$set:{'experience.$[].experienced':true}})

db.persons.insertMany([{
    name:'shruthi',
    age:23,
    gender:'female',
    empno:76513,
    address:{
        state:'KA',
        city:"BNG",
    },
    experience:[
        {company:'deloitte',duration:2},
        {company:'accenture',duration:4},
        {company:'jp morgan',duration:10},
        {company:'hcltech',duration:12}
    ]
}
])
//3. $[identifier]
db.persons.updateMany({gender:'female'},{$set:{'experience.$[ele].femaleCandidate':true}},{arrayFilters:[{'ele.duration':2}]})

//4. $push //it creates nested array inside a array
db.emp.updateone({ename:'smith'},{$push:{skills:['java','js','node']}})

//5. $each  //it will not create a nested array inside a array
db.emp.updateOne({ename:'smith'},{$push:{skills:{$each:['java','js','nodejs']}}})

//6. $addToSet //it is also use to insert elements inside array but, it will not accept duplicate values
db.emp.updateOne({ename:'smith'},{$addToSet:{skills:['java','js','node']}})
// here this data is already present so it will not insert

db.emp.updateOne({ename:'smith'},{$addToSet:{skills:['node']}})
//it will insert along with array and to remove array we need $each

db.emp.updateOne({ename:'smith'},{$addToSet:{skills:{$each:['node']}}})

//7. $pull
db.emp.updateOne({ename:'smith'},{$pull:{skills:'css'}})

db.emp.updateOne({ename:'smith'},{$pull:{skills:[ 'java', 'js', 'node']}})

//if i want to delete values in nested array i can use $pullAll 


//Regex

//who's name starts with 's'
db.emp.find({ename:{$regex:/^s/}},{ename:1,_id:0})

// who's name ends with 'r'
db.emp.find({ename:{$regex:/r$/}},{ename:1,_id:0})

// exactly 5 characters
db.emp.find({ename:{$regex:/^.....$/}},{ename:1,_id:0})

// last but one character is 'e'
db.emp.find({ename:{$regex:/e.$/}},{ename:1,_id:0})

// two consecutive l's
db.emp.find({ename:{$regex:/ll/}},{ename:1,_id:0})

//two l's that contain anywhere in the name
db.emp.find({ename:{$regex:/^.*l.*l$/}},{ename:1,_id:0})

//who's name is contains 'a'
db.emp.find({ename:{regex:/.*a.*a/}})

assignment

//who's name starts with 'a' and ends with 's'
db.emp.find({ename:{regex:/^a.*s$/}})

//who's name contain character 'a' name and sal
db.emp.find({ename:{$regex:/.*a.*/}},{ename:1,sal:1,_id:0})

//name and salary who's name contain atleast 2 'a'
db.emp.find({ename:{$regex:/.*a.*a.*/}},{ename:1,sal:1,_id:0})

//name and job who's designation contain "man"
db.emp.find({job:{$regex:/.*man.*/}},{ename:1,job:1,_id:0})

//who's name contain exactly 4 characters
db.emp.find({ename:{$regex:/^....$/}})

//name and salary who's name exactly 3rd character is "l"
db.emp.find({ename:{$regex:/^..l.*/}},{ename:1,sal:1,_id:0})

// name and job who's name start with "t" and last but one character is "e" and the name contain exactly 6
//   characters and 4th letter of the name is "n"
db.emp.find({ename:{$regex:/^t..ne.$/}},{ename:1,job:1,_id:0})

//name, who's name start with "a" or "m"
db.emp.find({ename:{$regex:/^a.*|^m.*/}},{ename:1,_id:0})
db.emp.find({$or:[{ename:{$regex:/^a.*/}},{ename:{$regex:/^m.*/}}]},{ename:1,_id:0})


//-----------------------------------------------Aggregation----------------------------------------------------//

//waqtd employee name and salary
db.emp.aggregate([
    {
        $project:{
            ename:1,
            sal:1,
            _id:0
        }
    }
])

//waqtd ename and job of the employes who is working as a manager
db.emp.aggregate([
    {
        $match:{
            job:'manager'
        }
    },
    {
        $project:{
            ename:1,
            job:1,
            _id:0
        }
    }
])

//waqtd name and annual salary of all the employes
db.emp.aggregate([
    {
        $addFields:{annual_sal:{$multiply:['$sal',12]}}
    },
    {
        $project:{
            ename:1,
            annual_sal:1,
            _id:0
        }
    }
])

//waqtd employe name, their job and midterm salaries who are working as clerk and also their midterm salary 
//less than 20000 and having 's' in their names
db.emp.aggregate([
   {
    $addFields:{midTerm_sal:{$multiply:['$sal',6]}}
   },
   {
    $match:{
        $and:[
            {job:'clerk'},
            {midTerm_sal:{$lt:20000}},
            {ename:{$regex:/.*s.*/}}
        ]
    }
   },
   {
     $project:{
          ename:1,
          job:1,
          midTerm_sal:1,
          _id:0
   }
}
])

//waqtd who are all hired in the year 1982
db.emp.aggregate([
    {
        $addFields:{year:{$year:'$hiredate'}}
    },
   {
      $match:{
        year:1982
    }
   },
   {
    $project:{
        ename:1,
        year:1,
        _id:0
    }
   }
])

//who are hired in the month of aug
db.emp.aggregate([
    {
        $addFields:{month:{$month:'$hiredate'}}
    },
    {
        $match:{
            month:8
        }
    },
    {
        $project:{
              ename:1,
              month:1,
              job:1,
              _id:0
        }
    }
])

//who are hired in the month of september
db.emp.aggregate([
    {
        $addFields:{month:{$month:'$hiredate'}}
    },
    {
        $match:{
            month:9
        }
    },
    {
        $project:{
              ename:1,
              month:1,
              job:1,
              _id:0
        }
    }
])

//who are hired in the month of april
db.emp.aggregate([
    {
        $addFields:{month:{$month:'$hiredate'}}
    },
    {
        $match:{
            month:4
        }
    },
    {
        $project:{
              ename:1,
              month:1,
              job:1,
              _id:0
        }
    }
])

//who are hired in the date of 23
db.emp.aggregate([
    {
        $addFields:{day:{$dayOfMonth:'$hiredate'}}
    },
    {
        $match:{
            day:23
        }
    },
    {
        $project:{
              ename:1,
              day:1,
              hiredate:1,
              _id:0
        }
    }
])

// who are all hired in the month september, april, august
db.emp.aggregate([
    {
        $addFields:{month:{$month:'$hiredate'}}
    },
    {
        $match:{
            month:{$in:[09,04,08]}
        }
    },
    {
        $project:{
              ename:1,
              month:1,
              job:1,
              _id:0
        }
    }
])



//group OPerators 
//        $min
//        $max
//        $avg
//        $count
//        $sum
 

db.emp.aggregate([
    {
        $group:{
            _id:null,
            Sum:{$max:'$sal'},
            count:{$sum:1},
            Name:{$push:'$ename'}
        }
    },
    {
        $project:{
            Sum:1,
            Name:1,
            count:1,
            _id:0
        }
    }
])

//WAQTD maximun salary of the employees who is deptno 10
db.emp.aggregate([
    {
        $match:{
            deptno:10
        }
    },
    {
        $group:{
            _id:"$deptno",
            max_sal:{$max:'$sal'},
        }
    },
    
    {
        $project:{
            deptno:'$_id',
            max_sal:1,
        }
    }
])

//WAQTD number of employee getting salary less than 2000 in deptno 10.
db.emp.aggregate([
    {
        $match:{
            deptno:10,
            sal:{$lt:2000}           
        }
    },
    {
        $group:{
            _id:null,
            count:{$sum:1}            
        }
    },
    {
        $project:{
            _id:0,
            count:1          
        }
    }
])

//WAQTD max salary of all the employee in each deptno along with designation
db.emp.aggregate([
    {
        $group:{
            _id:"$deptno",
            job:{$push:'$job'},
            job_wihout_repeat:{$addToSet:'$job'},
            max_sal:{$max:'$sal'}


        }
    },
    {
        $project:{
            _id:0,
            deptno:'$_id',
            job:1,
            max_sal:1 ,
            job_wihout_repeat:1         
        }
    }
])


// WAQTD no.of emp and deptno in which the emp count is aleast 4.
db.emp.aggregate([
    
    {
        $group:{
            _id:"$deptno",
          COunt:{$sum:1}
        }
    },
    {
        $match:{COunt:{$gte:4}}
    },
    {
        $project:{
            _id:1,
            COunt:1,

        }
    }
])

// WAQTD total sal needed to pay employee who are working as ' salesman '
db.emp.aggregate([
    {
        $match:{
            job:'salesman'
        }
    },
    {
        $group:{
            _id:null,
            Total_sal:{$sum:'$sal'},
            job:{$push:'$job'}
        }
    },
    {
        $project:{
            _id:0,
            Total_sal:1,
            job:1
        }
    }

])

job:{$push:'$job'}

// WAQTD name of employee whose max sal is more than 2000 in each job
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            name:{$push:'$ename'},
            max_sal:{$max:'$sal'},

        }
    },
    {
        $match:{max_sal:{$gt:2000}}
    },
    {
        $project:{
            _id:0,
            name:1,
            max_sal:1,
            job:1
        }
    }    
])


// WAQTD no.of employee in each dept
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}          

        }
    },
    {
        $project:{
            _id:'$deptno',
            count:1
        }
    }   
])


// WAQTD deptno, job and count of employee in it,
db.emp.aggregate([
    {
        $group:{
            _id:{
                deptno:'$deptno',
                job:'$job'
            },
            count:{$sum:1}
        }
    },
    {
        $project:{
            count:1
        }
    }
    
])


//WAQTD min sal of emp
db.emp.aggregate([
    {
        $project:{
            sal:1,
            _id:0
        }
    },
    {$sort:{sal:1}},
    {$skip:2},
    {$limit:1}
])

//WAQTD number of employees working in each department atleast 4 members
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },
    {
        $match:{
            count:{$gte:4}
        }
    },
    {
        $project:{
            count:1,
            deptno:'$_id'
        }
    }
])

//WAQTD max salary of the employes where there are atleast 2 members in each designation
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            Maxsal:{$max:'$sal'},
            count:{$sum:1}
        }
    },
    {
        $match:{
            count:{$gte:2}
        }
    },
    {
        $project:{
            _id:0,
            Maxsal:1,
            count:1,
            job:'$_id'
        }
    }
])

//WAQTD no. of employees working as manager in each department
db.emp.aggregate([
    {
            $match:{
                job:'manager'
            }
    },
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },
    {
        $project:{
            deptno:'$_id',
            count:1,
            job:1
        }
    }
])

//WAQTD deptno and number of emp working in each dept if there are atleast 2 clerks in each dept
db.emp.aggregate([
    {
        $match:{
            job:'clerk'
        }
    },
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },
    {
        $match:{
            count:{$gte:2}
        }
    },
    {
        $project:{
            deptno:'$_id',
            count:1,
            job:1
        }
    }
])

//WAQTD unique salary of the employes and arrange the salary in descending order
db.emp.aggregate([
    {
        $group:{
            _id:'$sal'
        }
    },
    {
        $sort:{
            _id:-1
        }
    }
])

//WAQTD emp details of 2nd maximum salary
db.emp.aggregate([
    {
        $group:{
            _id:'$sal'
        }
    },
    {
        $sort:{
            _id:-1
        }
    },
    {$skip:1},
    {$limit:1},
    {
        $lookup:{
            from:'emp',
            localField:'_id',
            foreignField:'sal',
            as:'2nd_maximum_salary'
        }
    }
])

//--------------------------------ASSIGNMENT-------------------------------------
//1.Group employees by job title and count the numbers of employees in each job title
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            count:{$sum:1}
        }
    },
    {
        $project:{
            job:1,
            count:1
        }
    }
])

//2.Group employees by department no. and calculate the average salary in each department
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            average:{$avg:'$sal'}
        }
    },
    {
        $project:{
            deptno:'$_id',
            average:1
        }
    }
])

//3.Group employees by manager and calculate the total salary managed by each manager.
db.emp.aggregate([
    {
        $group:{
            _id:'$mgr',
            total:{$sum:'$sal'}
        }
    },
    {
        $project:{
            mgr:1,
            total:1
        }
    }
])

//4. Group employees by deptno and find the maximum salary in each department
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            MaxSal:{$max:'$sal'}
        }
    },
    {
        $project:{
            deptno:1,
            MaxSal:1
        }
    }
])

//5. Group Employees by deptno and find the minimum salary in each department
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            MaxSal:{$min:'$sal'}
        }
    },
    {
        $project:{
            deptno:1,
            MaxSal:1
        }
    }
])

//6. Group employees by job title and calculate the total commision for each job title
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            Commission:{$sum:'$comm'}
        }
    },
    {
        $project:{
            job:1,
            Commission:1
        }
    }
])

//7. Group employees by job title and calculate the average comm for each job title
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            Commission:{$avg:'$comm'}
        }
    },
    {
        $project:{
            job:1,
            Commission:1
        }
    }
])

//8. Group employees by hire year and count the number of employees hired each year 
db.emp.aggregate([
    {
        $addFields:{
               Year:{$year:'$hiredate'}
        }
    },
    {
        $group:{
            _id:'$Year',
            count:{$sum:1}
        }
    },
    {
        $project:{
            _id:0,
            hiredate:1,
            Year:1,
            count:1
        }
    }
])

//9. Group employees by deptno and calculate the total no. of employess in each dept.
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },
    {
        $project:{
            _id:0,
            deptno:'$_id',
            count:1
        }
    }
])

//10. Group employees by job title and find the max comm in each job title
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            MaxComm:{$max:'$comm'}
        }
    },
    {
        $project:{
            _id:0,
            job:'$_id',
            MaxComm:1
        }
    }
])

//11. Find the total salary of employees in department number 30
db.emp.aggregate([

])


//----------------------------------------------------------------------------------
//using lookup
//1. WAQTD details of all the employeesand depts.
db.emp.aggregate([
    {
        $lookup:{
            from:"dept",
            localField:"deptno",
            foreignField:"deptno",
            as:"dept_details"
        }
    },
    {
        $unwind:"$dept_details"
    }
])

//2.WAQTD ename and dname of all the employees
db.emp.aggregate([
    {
        $lookup:{
            from:"dept",
            localField:"deptno",
            foreignField:"deptno",
            as:"dept_details"
        }
    },
    {
        $unwind:"$dept_details"
    },
    {
        $project:{
            ename:1,
            'dept_details.dname':1,
            _id:0
        }
    }
])

//3.WAQTD name and location of the employees
db.emp.aggregate([
    {
        $lookup:{
             from:"dept",
             localField:"deptno",
             foreignField:"deptno",
             as:"dept_details"
        }
    },
    {
        $unwind:"$dept_details"
    },
    {
        $project:{
            ename:1,
            location:'$dept_details.loc',
            _id:0
        }
    }
])

//4. WAQTD all the employees and managers details
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"Manager_details"
       }
    },
    {
        $unwind:'$Manager_details'
    }
])

//5. WAQTD ename and manager name of all the employees
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"Manager_details"
       }
    },
    {
        $unwind:'$Manager_details'
    },
    {
        $project:{
            _id:0,
            ename:1,
            Manager:'$Manager_details.ename'
        }
    }
])

//Assignments
//7. WAQTD ename,no of emp reporting to 7839
db.emp.aggregate([
    {
        $match:{ename:'king'}
    },
    {
        $lookup:{
            from:"emp",
            foreignField:"mgr",
            localField:"empno",
            as:"Reporting_Employees"
        }
    },
    {
        $unwind:"$Reporting_Employees"
    },
    {
        $group:{
            _id:null,
            count:{$sum:1},
            ename:{$push:'$Reporting_Employees.ename'}
        }
    },
    {
        $project:{
            ename:1,
            count:1,
            _id:0
        }
    }
])

//WATQD ename, manager name, manager's manager name.
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            foreignField:"empno",
            localField:"mgr",
            as:"managerDetails"
        }
    },
    {
        $unwind:'$managerDetails'
    },
    {
        $lookup:{
            from:"emp",
            foreignField:"empno",
            localField:"managerDetails.mgr",
            as:"Manager's managerDetails"
        }
    },
    {
        $project:{
            _id:0,
            ename:1,
            manager_name:'$managerDetails.ename',
            "Manager's managerName":"$Manager's managerDetails.ename"
        }
    }
])

//1. WAQTD name of the employe and his manager's name if employee is working as 'clerk'
db.emp.aggregate([
    {
        $match:{
            job:'clerk'
        }
    },
    {
        $lookup:{
            from:"emp",
            foreignField:"empno",
            localField:"mgr",
            as:"managerDetails"
        }
    },
    {
        $unwind:'$managerDetails'
    },
    {
        $project:{
            _id:0,
            ename:1,
            job:1,
            Mname:"$managerDetails.ename"
        }
    }
])

//WAQTD details of the employes having commission more than salary
db.emp.find({$expr:{$gt:['$comm','$sal']}})

db.emp.aggregate([
    {
        $match:{
            $expr:{$gt:['$comm','$sal']}
        }
    }
])

//WAQTD name of the emp, emp salary and manager name, managers salary if employee and manager both earb more than 2300
db.emp.aggregate([
    {
        $lookup:{
             from:"emp",
             foreignField:"empno",
             localField:"mgr",
             as:"managerDetails"
        }
    },
    {
        $unwind:'$managerDetails'
    },
    {
        $match:{
            $and:[{sal:{$gt:2300}},{'managerDetails.sal':{$gt:2300}}]
        }
    },
    {
        $project:{
            ename:1,
            _id:0,
            sal:1,
            M_sal:"$managerDetails.sal",
            M_name:"$managerDetails.ename"
        }
    }
])

//WAQTD details of employees where the Hiredate is earlier than their Manager's Hiredate
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            foreignField:"empno",
            localField:"mgr",
            as:"managerDetails"
        }
    },
    {
        $unwind:'$managerDetails'
    },
    {
        $match:{
            $expr:{$lt:['$hiredate',"$managerDetails.hiredate"]}
        }
    },
    {
        $project:{
            _id:0,
            ename:1,
            hiredate:1,
            M_name:"$managerDetails.ename",
            M_hiredate:"$managerDetails.hiredate"
        }
    }
])

//--------------------------------PIPELINE---------------------------------------
//important///  WAQTD details of emp who is getting repeated saalry or same salary
db.emp.aggregate([
    {
        $group:{
            _id:'$sal',
            count:{$sum:1}
        }
    },
    {
        $match:{
            count:{$gt:1}
        }
    },
    {
        $lookup:{
            from:'emp',
            let:{sameSal:'$_id'},
            pipeline:[{
                $match:{$expr:{$eq:['$sal','$$sameSal']}}
            }],
            as:'SameSalary'
        }
    }
])

//WAQTD the details of emp whose hiredate is same as 'ford' along with 'ford' details
db.emp.aggregate([
    {
        $match:{
            ename:'ford'
        }
    },
    {
        $group:{
            _id:'$hiredate'
        }
    },
    {
        $lookup:{
            from:'emp',
            let:{sameDate:'$_id'},
            pipeline:[{
                $match:{$expr:{$eq:['$hiredate','$$sameDate']}}
            }],
            as:'SameHiredate'
        }
    }
])

//WAQTD details of the employee whose job is same as 'miller'
db.emp.aggregate([
    {
        $match:{
            ename:'miller'
        }
    },
    {
        $group:{
            _id:'$job'
        }
    },
    {
        $lookup:{
            from:'emp',
            let:{sameJob:'$_id'},
            pipeline:[{
                $match:{$expr:{$eq:['$job','$$sameJob']}}
            }],
            as:'SameJob'
        }
    }
])

//---------------------------------------------------------------------------------

//WAQTD name of the employee hired before the last employee.
db.emp.aggregate([
    {
        $sort:{_id:-1}
    },
    {
        $skip:1
    },
    {
        $limit:1
    },
    {

    },
    {
        $project:{
            ename:1,
            _id:0
        }
    }
])

//WAQTD ename who are reporting to blake's manager.
db.emp.aggregate([
    {
        $match:{
            ename:'blake'
        }
    },
    {
        $group:{
            _id:'$mgr'
        }
    },
    {
        $lookup:{
            from:'emp',
            let:{sameJob:'$_id'},
            pipeline:[{$match:{$expr:{$eq:['$mgr','$$sameJob']}}}],
            as:'doc1'
        }
    },
    {
        $project:{
            _id:0,
            mgrNo:'$doc1.mgr',
            employs:'$doc1.ename'
        }
    }
])

//WAQTD ename who are reporting to blake's manager.
db.emp.aggregate([
    {
        $match:{
            ename:'blake'
        }
    },
    {
        $lookup:{
            from:'emp',
            localField:'mgr',
            foreignField:'empno',
            as:'doc1'
        }
    },
    {
        $lookup:{
            from:'emp',
            localField:'doc1.empno',
            foreignField:'mgr',
            as:'doc2'
        }
    },
    {
        $project:{
            _id:0,
            Manager:'$doc1.ename',
            employs:'$doc2.ename'
        }
    }
])



db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            min_sal:{$min:'$sal'},
            max_sal:{$max:'$sal'}
        }
    },{
        $match:{
            $and:[{min_sal:{$gt:1000}},{max_sal:{$lt:5000}}]
        }
    },{
        $project:{
            job:'$_id',
            min_sal:1,
            max_sal:1
        }
    }
])

