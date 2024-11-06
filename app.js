// Schema:

db.createCollection('abc',{
    validator:{
        $jsonSchema:{
            bsonType:'object',
            required:['name','price','about',"status","rating"],
            properties:{
                name:{
                    bsonType:'string',
                    description:'name should be string'
                },
                price:{
                    bsonType:'double',
                    description:'price should be double'
                },
                about:{
                    bsonType:'string',
                    description:'about should be string'
                },
                rating:{
                    bsonType:'object',
                    required:['rate'],
                    properties:{
                        rate:{
                            bsonType:'double',
                            description:'rate should be double'
                        }
                    }
                },
                status:{
                    bsonType:'array',
                    items:{
                        bsonType:["string",'object',"number"]
                    }
                },
            }
        }
    }
})

db.chocolate1.insertMany([{
    name:'FiveStar',
    price:45.10,
    about:'Eat Five Star Do Nothing',
    status:['abc'],
    rating:{rate:4.5}
},
{
    name:'Snickers',
    price:90.90,
    about:'Hunger Can Change Anyone',
    status:[{name:'choco'}]
},
{
    name:'Dairy Milk',
    price:100.99,
    about:'sdfghjkrtyu',
    status:[123]
}
])

// --------------------------------------------------------------------------------------------------------------

db.createCollection('Zomato',{
    validator:{
        $jsonSchema:{
            bsonType:'object',
            required:['ordderid','ordername','price','quantity','rating','starters'],
            properties:{
                orderid:{
                    bsonType:'string',
                    description:'orderid should be string'
                },
                ordername:{
                    bsonType:'string',
                    description:'ordername should be string'
                },
                price:{
                    bsonType:'double',
                    description:'price should be double'
                },
                rating:{
                    bsonType:'object',
                    required:['rate'],
                    properties:{
                        rate:{
                            bsonType:'double',
                            description:'rate should be double'
                        }
                    }
                },
                starters:{
                    bsonType:'array',
                    items:{
                        bsonType:["string",'object',"number"]
                    }
                },
            }
        }
    }
})


db.Zomato.insertMany([{
    ordderid:'B123',
    ordername:'KFC',
    price:45.10,
    quality:4,
    rating:{rate:4.5},
    starters:['bucket','ricebowl']
}])

// ---------------------------------------------------------------------------------------------------

db.runCommand({
    collMod:'Zomato',
    validator:{
        $jsonSchema:{
            bsonType:'object',
            required:['ordderid','ordername','price','quantity','starters'],
            properties:{
                orderid:{
                    bsonType:'string',
                    description:'orderid should be string'
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
                    required:['rate'],
                    properties:{
                        rate:{
                            bsonType:['double','int'],
                            description:'rate should be double'
                        }
                    }
                },
                starters:{
                    bsonType:'array',
                    items:{
                        bsonType:["string",'object',"number"]
                    }
                },
                isAvailable:{
                    bsonType:'bool',
                    description:'isAvailable should be true or false'
                }
            }
        }
    }
})

db.Zomato.insertMany([{
    ordderid:'B124',
    ordername:'Pizza Hut',
    price:45.10,
    quantity:4,
    rating:{rate:4.5},
    starters:['Paprica(Extra Cheesy) ','Grill Chicken Pizza'],
    isAvailable: true
}])

//------------------------------------------------------RELATIONSHIPS------------------------------------------------------------------------

// one to one 

db.student.insertOne({
    name:'raja',
    age:20,
    phoneNumber:1234567891,
    address:{
        state:'Karnataka',
        city:'Bangalore',
        pincode:560078
    },
    skills:['js','html','nodejs','mongodb','express']
})

db.student1.insertOne({
    name:'raja',
    age:20,
    phoneNumber:1234567891,
    skills:['js','html','nodejs','mongodb','express']
})

db.studentAddress.insertOne({
    address:{
        state:'Karnataka',
        city:'Bangalore',
        pincode:560078
    }
})

db.student1.updateOne({name:'raja'},{$set:{nativePlace:ObjectId('66eabe900797cdf1572710c5')}})

db.student1.aggregate({
    $lookup:{
        from:'studentAddress',
        localField:'nativePlace',
        foreignField:'_id',
        as:'nativePlace'
    }
})

//----------------------------------------------------------------------------------------------------------
// One to Many Relationship

db.land.insertOne({
    price:300000,
    acres:3,
    owners:[
        {
            name:'jamindar1',
            Money:100000
        },
        {
            name:'jamindar2',
            Money:100000
        },
        {
            name:'jamindar3',
            Money:100000
        }
    ]
})





db.land.updateOne({acres:3},{$set:{
    place:{
        state:'karnataka',
        city:'bangalore'
    }
}})





db.land1.insertOne({
    price:600000,
    acres:6
})





db.owners.insertMany([
   {
    name:'jamindar1',
    Money:200000
   },
   {
    name:'jamindar2',
    Money:200000
   },
   {
    name:'jamindar3',
    Money:200000
   }
])





db.land1.updateOne({acres:6},{$set:{owners:[
    ObjectId('66ec05f50797cdf1572710c8'),
    ObjectId('66ec05f50797cdf1572710c9'),
    ObjectId('66ec05f50797cdf1572710ca')
]}})





db.land1.aggregate([
    {
        $lookup:{
            from:'owners',
            localField:'owners',
            foreignField:'_id',
            as:'owners'
        }
    }
])

//-------------------------------------------------------------------------------------------------------
// Many to Many Relationship

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
        bookName:'js',
        pages:150
    }
])




db.authors.insertMany([
    {
        authorName:'koushik',
        version:1
    },
    {
        authorName:'adithys',
        version:2
    },
    {
        authorName:'varun',
        version:3
    },
    {
        authorName:'raju',
        version:4
    }
])



db.books.updateOne({bookName:'mongodb'},{$set:{authors:[ObjectId('66ec10510797cdf1572710cb'),ObjectId('66ec10510797cdf1572710cc')]}})
db.books.updateOne({bookName:'nodejs'},{$set:{authors:[ObjectId('66ec10610797cdf1572710d1'),ObjectId('66ec10610797cdf1572710d2')]}})
db.books.updateOne({bookName:'java'},{$set:{authors:[ObjectId('66ec10510797cdf1572710cb')]}})
db.books.updateOne({bookName:'js'},{$set:{authors:[ObjectId('66ec10510797cdf1572710cb'),ObjectId('66ec10610797cdf1572710d2'),ObjectId('66ec10510797cdf1572710cc')]}})



db.books.aggregate([{
    $lookup:{
        from:'authors',
        localField:'authors',
        foreignField:'_id',
        as:'authors'
    }
}])



db.authors.updateOne({authorName:'koushik'},{$set:{books_written:[ ObjectId('66ec10510797cdf1572710cb'),ObjectId('66ec10510797cdf1572710cc'),ObjectId('66ec10510797cdf1572710cd'),ObjectId('66ec10510797cdf1572710ce')]}})
db.authors.updateOne({authorName:'adithya'},{$set:{books_written:[ ObjectId('66ec10510797cdf1572710cb'),ObjectId('66ec10510797cdf1572710cc')]}})
db.authors.updateOne({authorName:'varun'},{$set:{books_written:[ ObjectId('66ec10510797cdf1572710cd'),ObjectId('66ec10510797cdf1572710ce')]}})
db.authors.updateOne({authorName:'raju'},{$set:{books_written:[ ObjectId('66ec10510797cdf1572710cd'),ObjectId('66ec10510797cdf1572710ce')]}})



db.authors.aggregate([{
    $lookup:{
        from:'books',
        localField:'books_written',
        foreignField:'_id',
        as:'books_written'
    }
}])

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Array Update Operators

db.person.insertMany([{
    name:'sruthi',
    age:22,
    gender:'female',
    address:{
        stste:'KA',
        city:'BNG'
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
    age:22,
    gender:'male',
    address:{
        stste:'TN',
        city:'CHN'
    },
    experience:[
        {company:'apple',duration:5},
        {company:'black rock',duration:2},
        {company:'tyss',duration:8},
        {company:'alpha',duration:15}
    ]
},
{
    name:'koushik',
    age:21,
    gender:'male',
    address:{
        stste:'KA',
        city:'CHN'
    },
    experience:[
        {company:'samsung',duration:8},
        {company:'vivo',duration:1},
        {company:'24/7.ai',duration:7},
        {company:'cognizant',duration:20}
    ]
},
{
    name:'adithya',
    age:22,
    gender:'male',
    address:{
        stste:'AP',
        city:'HYD'
    },
    experience:[
        {company:'qualcomm',duration:12},
        {company:'concentrix',duration:6},
        {company:'jp morgan',duration:10},
        {company:'cloud nine',duration:15}
    ]
}])

// 1. $
// 2. $[]
// 3. $[identifier]
// 4. $pop
// 5. $push
// 6. $pull
// 7. $each
// 8. $addToSet

db.persons.updateMany({experience:{$elemMatch:{duration:{$gte:5}}}},{$set:{"experience.$.experiencedCandidate":true}})

db.persons.updateMany({experience:{$elemMatch:{duration:{$gte:20}}}},{$set:{"experience.$[].experiencedCandidate":true}})

db.persons.updateMany({gender:'female'},{$set:{'experience.$[ele].femaleCandidate':true}},{arrayFilters:[{'ele.duration':2}]})

db.emp.updateOne({ename:'smith'},{$push:{skills:['java','js','node']}})

db.emp.updateOne({ename:'smith'},{$push:{skills:{$each:['java','js','node']}}})

db.emp.updateOne({ename:'smith'},{$addToSet:{skills:['node']}})

db.emp.updateOne({ename:'smith'},{$addToSet:{skills:{$each:['node']}}})

db.emp.updateOne({ename:'smith'},{$pull:{skills:['java','js','node']}})

db.emp.updateOne({ename:'smith'},{$pullAll:{skills:['js','css']}})

db.emp.updateOne({ename:'smith'},{$pop:{skills:1}})

db.emp.updateOne({ename:'smith'},{$pop:{skills:-1}})

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//----------REGEX--------------------------------------

//whos's name starts with 's'
db.emp.find({ename:{$regex:/^s/}})

//who's name ends with 'r'
db.emp.find({ename:{$regex:/r$/}})

//exactly 5 characters
db.emp.find({ename:{$regex:/^.....$/}})

//last but one character is 'e'
db.emp.find({ename:{$regex:/e.$/}})

//two consecutive L's
db.emp.find({ename:{$regex:/ll/}})

// two L's that contain anywhere in the name
db.emp.find({ename:{$regex:/^.*l.*l.*$/}})

// who's name contains 'a'
db.emp.find({ename:{$regex:/.*a.*/}})



//Last question using or operator
db.emp.find({$or:[{ename:{$regex:/^a.*/}},{ename:{$regex:/^a.*/}}]},{ename:1,_id:0})

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//------------AGGREGATION--------------------------------

//Waqtd employee name and salary
db.emp.aggregate([
    {
        $project:{
            ename:1,
            sal:1,
            _id:0
        }
    }
])


// Waqtd ename and job of all the employees who is working as a manager
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

// waqtd ename , annual salary of all the employees
db.emp.aggregate([
    {
        $addFields:{
            annual_sal:{
                $multiply:['$sal',12]
            }
        }
    },
    {
        $project:{
            ename:1,
            annual_sal:1,
            _id:0
        }
    }
])

//waqtd employee names, their job and midterm salaries who are working as clerk and also their midterm salary less than 20000 //name starting with S
db.emp.aggregate([
    {
        $addFields:{
            midterm_sal:{
                $multiply:['$sal',6]
            }
        }
    },
    {
        $match:{
            $and:[{job:'clerk'},
                  {midterm_sal:{$lt:20000}},
                  {ename:{$regex:/.*s.*/}}
                ]
        }        
    },
    {
        $project:{
            ename:1,
            midterm_sal:1,
            _id:0
        }
    }
])

// waqtd who are all hired in the year 1982
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

//$month
//who are hired in the month of aug, september, april
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
            _id:0
        }
    }
])

//who are hired in the below dates 23, 03, 17
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
            _id:0
        }
    }
])

// Using IN operator
db.emp.aggregate([
    {
        $addFields:{day:{$dayOfMonth:'$hiredate'}}
    },
    {
        $match:{
            day:{$in:[23,03,17]} // IN operator
        }
    },
    {
        $project:{
            ename:1,
            day:1,
            _id:0
        }
    }
])

//--------------GROUP------------------------
db.emp.aggregate([
    {
        $group:{
            _id:null,
            Max_Sal:{$max:'$sal'},
            
        }
    },
    {
        $project:{
            Max_Sal:1,
            _id:0
        }
    }
])

db.emp.aggregate([
    {
        $group:{
            _id:null,
            Min_Sal:{$min:'$sal'},
            
        }
    },
    {
        $project:{
            Min_Sal:1,
            _id:0
        }
    }
])

// waqtd maximum salary of the employees who is working in deptno 10
db.emp.aggregate([
    {
        $match:{
            deptno:10
        }
    },
    {
        $group:{
            _id:null,
            Max_Sal:{$max:'$sal'},
            
        }
    },
    {
        $project:{

            Max_Sal:1,
        }
    }
])

// waqtd number of employees getting salary less than 2000 in deptno 10
db.emp.aggregate([
    {
        $match:{
            $and:[{deptno:10},{sal:{$lt:2000}}]
        }
    },
    {
        $group:{
            _id:null,
            Number_of_emp:{$sum:1},
            
        }
    },
    {
        $project:{
            _id:0,
            Number_of_emp:1,

        }
    }
])

//waqtd max salary of all the employees in each deptno along with designation
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            job:{$push:'$job'},
            Max_sal:{$max:'$sal'},
            job_without_repeat:{$addToSet:'$job'}
        }
    },
    {
        $project:{
            Max_sal:1,
            job:1,
            deptno:'$_id',
            _id:0,
            job_without_repea:1

        }
    }
])

// waqtd no of employees in each dept
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            count:{$count:{}}
        }
    }
])

// waqtd deptno,job and count no of employees
db.emp.aggregate([
    {
        $group:{
            _id:{
                deptno:'$deptno',
                job:'$job'
            }
        }
    },{
        $project:{
            count:1
        }
    }
])

// waqtd minimum salary of emp



















// waqtd number of employees in each deptno atleast 4 members
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },{
        $match:{
            count:{$gte:4}
        }
    },{
        $project:{
            count:1,
            deptno:'$_id'
        }
    }
])

// waqtd max salary of the employees where there are atleast 2 members in each designation
db.emp.aggregtaion([
    {
        $group:{
            _id:'$job',
            MaxSal:{$max:'$sal'},
            Count:{$sum:1}
        }
    },{
        $match:{
            count:{$gte:2}
        }
    },{
        $project:{

        }
    }
])

// waqtd the employees names in ascending order
db.emp.aggregate([
    {
        $project:{
            ename:1,
            _id:0
        }
    },{
        $sort:{
            ename:1
        }
    },{
        $limit:6
    },{
        $skip:3
    }
])

// waqtd to find the second highest salary
db.emp.aggregate([
    {
        $project:{
            sal:1,
            _id:0
        }
    },{
        $sort:{sal:-1}
    },{
        $skip:1
    },{
        $limit:1
    }
])

//waqtd minimum salary of emp
db.emp.aggregate([
    {
        $project:{
            sal:1,
            _id:0
        }
    },{
        $sort:{sal:-1}
    },{
        $limit:1
    }
])

// waqtd deptno and number of emp working in each dept if there are atleast 2 clerks in each dept
db.emp.aggregate([
    {
        $match:{
            job:'clerk'
        }
    },{
        $group:{
            _id:'$deptno',
            count:{$sum:2}
        }
    },{
        $match:{
            count:{$gte:2}
        }
    },{
        $project:{
            deptno:'$_id',
            count:1,
            _id:0
        }
    }
])

//waqtd number of employees working as manager in each department
db.emp.aggregate([
    {
        $match:{
            job:'manager'
        }
    },{
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },{
        $project:{
            count:1
        }
    }
])

//waqtd max salary of the employees where there are atleast 2 members in each designation
db.emp.aggregate([
    {
        $group:{
            _id:'$job',
            maxsal:{$max:'$sal'},
            count:{$sum:1}
        }
    },{
        $match:{
            count:{$gte:2}
        }
    },{
        $project:{
            maxsal:1,
            count:1,
            job:"$_id"
        }
    }
])

//waqtd number of employees working in each deptno atleast 4 members
db.emp.aggregate([
    {
        $group:{
            _id:'$deptno',
            count:{$sum:1}
        }
    },{
        $match:{
            count:{$gte:4}
        }
    },{
        $project:{
            count:1,
            deptno:"$_id"
        }
    }
])

//waqtd emp details of 2nd maximum salary
db.emp.aggregate([
    {
        $sort:{
            _id:-1
        }
    },{
        $skip:1
    },{
        $limit:1
    },{
        $lookup:{
            from:'emp',
            localField:'_id',
            foreignField:'sal',
            as:'2nd_largest_sal'
        }
    }
])




//todo------------------------------------------$lookup-------------------------------

//----> $lookup is also called as join
//----> $lookup is used to join the multiple collection/table
//----> $lookup is used to display the data from different collections to single output

// syntax:
{
    $lookup:{
        from:"collection"        // new collection name
        localField:""            // new collection field name
        foreignField:""          // current collection field name
        as:"alias_name"          // storing field name
    }
}

//waqtd details of all the employees and depts
db.emp.aggregate([
    {
        $lookup:{
            from:"dept",
            localField:"deptno",
            foreignField:"deptno",
            as:"dept_details"
        }
    },{
        $unwind:"$dept_details"
    }
])

// waqtd ename and dname of all the employees
db.emp.aggregate([
    {
        $lookup:{
            from:"dept",
            localField:"deptno",
            foreignField:"deptno",
            as:"dept_details"
        }
    },{
        $unwind:"$dept_details"
    },{
        $project:{
            ename:1,
            'dept_details.dname':1,
            _id:0
        }
    }
])

// waqtd name and location of the employees 
db.emp.aggregate([
    {
        $lookup:{
            from:"dept",
            localField:"deptno",
            foreignField:"deptno",
            as:"dept_details"
        }
    },{
        $unwind:"$dept_details"
    },{
        $project:{
            ename:1,
            location:'$dept_details.loc',
            _id:0
        }
    }
])

// waqtd all the employees and managers details
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"manager_details"
        }
    },{
        $unwind:"$manager_details"
    }
])

// waqtd ename and manager name of all the employees
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"manager_details"
        }
    },{
        $unwind:"$manager_details"
    },{
        $project:{
            ename:1,
            manager:'$manager_details.ename',
            _id:0
        }
    }
])


//------------Assignment ------------

// waqtd dname and salary of all the emp who are working in accounting
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"dname",
            foreignField:"deptno",
            as:"dept_dname"
        }
    },{
        $unwind:"$dept_dname"
    },{
        $match:{
            job:"accounting"
        }
    },{
        $project:{
            sal:1,
            Dept_name:'$dept_dname.dname',
            _id:0
        }
    }
])

// ename and mgr name if emp is working as clerk
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"manager_details"
        }
    },{
        $unwind:"$manager_details"
    },{
        $match:{
            job:'clerk'
        }
    },{
        $project:{
            ename:1,
            manager:'$manager_details.ename',
            _id:0
        }
    }
])

// ename and mgr designation if emp is working in dept 10 or 20 
db.emp.aggregate([
    {
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"manager_details"
        }
    },{
        $unwind:"$manager_details"
    },{
        $match:{
            $or:[{deptno:10},{deptno:20}]
        }
    },{
        $project:{
            ename:1,
            designation:'$manager_details.job',
            _id:0,
            mgr_deptno:'$manager_details.deptno'

        }
    }
])


// waqtd ename and no of emp reporting to 7839
db.emp.aggregate([
    {
        $match:{
            mgr:7839
        }
    },{
        $lookup:{
            from:"emp",
            localField:"empno",
            foreignField:"mgr",
            as:"employee_details"
        }
    },{
        $unwind:"$employee_details"
    },{
        $group:{
            _id:null,
            count:{$sum:1},
            ename:{$push:'$employee_details.ename'}
        }
    },{
        $project:{
            ename:1,
            count:1,
            _id:0
        }
    }
])

db.emp.aggregate([
    {
        $match:{
            $and:[{sal:{$lt:2000}},{}]
        }
    },{
        $group:{
            
        }
    }
])

// waqtd details of employee who is getting repeated salary or same salary
db.emp.aggregate([
    {
        $group:{
            _id:'$sal',
            count:{$sum:1}
        }
    },{
        $match:{
            count:{$gt:1}
        }
    },{
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



db.emp.aggregate([
    {
        $match:{
            ename:'miller'
        }
    },{
        $group:{
            _id:'$job'
        }
    },{
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

//waqtd name of the employee hired before the last employee
db.emp.aggregate([
    {
        $lookup:{
            from:'emp',
            localField:'_id',
            foreignField:'hiredate',
            as:'2nd_hired_emp'
        }
    },{
        $group:{
            _id:"2nd_hired_emp"
        }
    },{
        $sort:{
            _id:-1
        }
    },{
        $skip:1
    },{
        $limit:1
    },{
        $project:{
            ename:1,
            _id:0
        }
    }
])

//--sorted using hiredate
db.emp.aggregate([
    {
        $sort:{
            hiredate:-1
        }
    },{
        $skip:1
    },{
        $limit:1
    },{
        $project:{
            ename:1,
            _id:0
        }
    }
])

//waqtd enames of employees who are reporting to blakes manager
db.emp.aggregate([
    {
        $match:{
            ename:'blake'
        }
    },{
        $lookup:{
            from:"emp",
            localField:"mgr",
            foreignField:"empno",
            as:"manager_details"
        }
    },{
        $unwind:"$manager_details"
    },{
        $lookup:{
            from:"emp",
            localField:"manager_details.empno",
            foreignField:"mgr",
            as:"manager's_manager_details"
        }
    },{
        $project:{
            _id:0,
            Manager:"$manager_details.ename",
            Employee:"$manager's_manager_details.ename"
        }
    }
])

