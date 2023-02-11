const data ={
    employees: require ('../model/employees.json'),
    setEmployees: function (data) {
        this.employees = data;
    }
};

const getAllEmployees = (req, res) => {
    res.json (data.employees);
};

const createNewEmployee = (req, res) => {
    const { firstname, lastname } = req.body;
    const len = data.employees.length;
    const id = data.employees[len-1].id + 1 || 1;
    const newEmployee = {
        id : id,
        firstname : firstname,
        lastname: lastname,
    }

    if (!firstname || !lastname) res.status (400).json ({ 'message' : 'Firstname and lastname are required !' });
    data.setEmployees ([...data.employees, newEmployee]);
    res.status (201).json (data.employees);
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