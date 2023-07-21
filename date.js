
// console.log(module);

// module.exports = "hello world";

exports.getDate = function () {


    
    const today = new Date();
    
    //1
    // var day = "";

    // if(today.getDay() === 0 || today.getDay() === 6) {
    //     day = "Weekend";
    // } else {
    //     day = "Weekday";
    // }

    //2
    //could have used SWITCH too
    // var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // var dayNumber = today.getDay();

    // var day = daysOfWeek[dayNumber];

    //3
    const options = {
        weekday: "long", 
        day: "numeric", 
        month: "long"
    }

    const day = today.toLocaleDateString("en-US", options)
    
    return day;

}

module.exports.getDay = getDay;

function getDay() {


    
    const today = new Date();
    
    const options = {
        weekday: "long", 
    }

    const day = today.toLocaleDateString("en-US", options)
    
    return day;

}
