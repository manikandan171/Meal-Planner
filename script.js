// Simple functions
function add(a, b) {
  return a + b;
}

const mul = (a, b) => {
  return a * b;
};

console.log(mul(12, 11));  

// Object with method
const obj = {
  name: 'Mani',
  age: 40,
  message: function () {
    let name = this.name;  
    return `Hello I am ${name}`;
  }
};

console.log(obj.name);          
console.log(obj.message());      // Output: Hello I am Mani

// Array map, filter, reduce
const numbers = [1, 3, 4, 88, 21, -35, -26];

const mappednum = numbers.map(n => n * 3);
console.log(mappednum);         

const posNum = numbers.filter(n => n > 0);
console.log(posNum);            

const oddNum = numbers.filter(n => n % 2 !== 0 && n > 0);
console.log(oddNum);            

const total = numbers.reduce((sum, n) => sum + n, 0);
console.log(total);              // Sum of all numbers

// Array of objects
const products = [ 
  { name: 'tv', price: 8000 },
  { name: 'phone', price: 5000 },
  { name: 'lap', price: 7500 },
  { name: 'game', price: 2500 },
  { name: 'remote', price: 4500 },
  { name: 'ac', price: 9500 },
];

const totalPrice = products.reduce((sum, item) => sum + item.price, 0);
console.log(totalPrice);         // Output: 37000

const greatPrice = products.filter(item => item.price > 5000);
console.log(greatPrice);

// Object Destructuring
const user = { name: 'Mani', password: '1234567890' };
const { name, password } = user;
console.log(password);           // Output: 1234567890

// Array Destructuring
const number = [1, 2, 3, 4, 5, 6];
const [first, second, third, ...spread] = number;
console.log(spread);             // Output: [4, 5, 6]

// Spread Operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const copy = [...arr2, ...arr1];
console.log("Merged array:", copy); 

// Rest Parameters
function add2(...args) {
  return args.reduce((sum, n) => sum + n, 0);
}
console.log("Sum:", add2(1, 2, 3, 4, 5));  // Output: 15

// Callback Example
function function1() {
  console.log(`from inside callback`);
}

function fun(name, callback) {
  callback();
  return `${name} from outside callback`;
}

console.log(fun('function', () => {
  console.log(`from inside callback`);
}));


async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    data.map((a)=>console.log(a.name))
    
  } catch (error) {
    console.log(error);
  }
}

fetchUsers();
