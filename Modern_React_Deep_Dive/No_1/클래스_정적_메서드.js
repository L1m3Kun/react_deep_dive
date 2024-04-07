class Car{
    static hello(){
        console.log('안녕하세요!')
    }
}

const myCar = new Car()

// myCar.hello()   // Uncaught TypeError: myCar.hello is not a function
// Car.hello()     // 안녕하세요!
console.log(Object.getPrototypeOf(Car))