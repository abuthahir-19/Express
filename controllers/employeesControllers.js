const data ={
    employees: require ('../model/employees.json'),
    setEmployees: function (data) {
        this.employees = data;
    }
};

const mysql = require ('mysql');
const uuid = require ('uuid');
const fsPromises = require ('fs').promises;
const path = require ('path');

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'registeredemployees',
});

db.connect (er => {
    if (er) throw er;
    else {
        console.log ('Connection to the database successfull !!');
    }
});

const getAllEmployees = (req, res) => {
    res.json (data.employees);
    var sql = 'SELECT * FROM Employee';
    db.query (sql, (er, result) => {
        if (er) throw er;
        else {
            if (result.length > 0) {
                console.log (result);
                res.json (result);
            }
        }
    });
};

const createNewEmployee = (req, res) => {
    const { name, role, phone, email } = req.body;
    const id = uuid.v4();

    //create the new user as objects
    var newEmployee = {
        empId: id,
        empName : name,
        empRole : role,
        empPhone : phone,
        empEmail : email
    };
    data.setEmployees ([...data.employees, newEmployee]);
    
    if (!name || !role || !phone || !email) res.json ({ "message" : "Please enter data in all required fields !!" });
    else {
        var sql = 'SELECT * FROM Employee WHERE empPhone = ? AND empEmail = ?';
        db.query (sql, [phone, email], async (er, result) => {
            if (er) throw er;
            else {
                if (result.length > 0) {
                    res.json ({"message" : "Employee with the given data already exists !!" });
                } else {
                    var insertQuery = 'INSERT INTO Employee (empId, empName, empRole, empPhone, empEmail) VALUES ?';
                    var values = [
                        [id, name, role, phone, email]
                    ]
                    db.query (insertQuery, [values], (err, result) => {
                        if (err) throw err;
                        else {
                            console.log ('Created a new employee !!');
                            res.json ({ "message" : `Created a new employee named ${name} successfully !!` });
                        }
                    });

                    await fsPromises.writeFile (
                        path.join (__dirname, '..', 'model', 'employees.json'),
                        JSON.stringify (data.employees)
                    );
                }
            }
        });
    }
};

const updateEmployee = (req, res) => {
    const { id, firstname, lastname } = req.body;
    const emp = data.employees.find (employee => employee.id === id);
    if (!emp) {
        res.status (404).json ({ 'message' : `Employee with the id ${id} not found !` });
    }
    emp.id = id;
    emp.firstname = firstname;
    emp.lastname = lastname;
    const filtered = data.employees.filter (empl => empl.id !== parseInt (id));
    const unsorted = [...filtered, emp]
    data.setEmployees (unsorted);
    res.json (data.employees);
};

const deleteEmployee = (req, res) => {
    const { id, firstname, lastname } = req.body;
    const filteredRecord = data.employees.filter (person => person.id !== id);
    data.setEmployees ([...filteredRecord]);
    res.send ('Deleted Employee Record !').json ({ 'message': `Employee record with an id ${id} has been deleted !!` });
};

const getEmployee = (req, res) => {
    res.json (data.employees.filter (employee => employee.id === req.body.id));
};

module.exports = { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee };