const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-LengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; //string of symbols

// setting some default values in the UI
let password="";
let passwordLength=10;
let checkCount=0;
//let strength indicator is grey



// slider function-> the below functions sets the length of the password
function handleSlider(){
    inputSlider.value=passwordLength; //sets slider position on 10th step
    lengthDisplay.innerText=passwordLength;
}
handleSlider();




// setting strength indicator color and shadow
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`
}
setIndicator("#ccc")




// creating a function that checks the password strength
function calculateStrength(){
    let upperCase=false;
    let lowerCase=false;
    let numbers=false;
    let symbols=false;
    if(uppercaseCheck.checked){
        upperCase=true;
    }
    if(lowercaseCheck.checked){
       lowerCase=true;
    }
    if(numbersCheck.checked){
        numbers=true;
    }
    if(symbolsCheck.checked){
        symbols=true;
    }

    if(upperCase && lowerCase && (numbers || symbols) && passwordLength>=8){
        setIndicator("#0f0")
    }
    else if((upperCase || lowerCase) && (numbers || symbols) && passwordLength>=6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00") 
    }
}




// creating a function that copies the generated password
async function copyPassword(){
        try{
            await navigator.clipboard.writeText(passwordDisplay.value)
            copyMsg.innerText="Copied"
        }
        catch(e){
            copyMsg.innerText="Failed"
        }
        // now in order to make the copied text visible, I'm using below code
        // copyMsg.classList.add("active")
        // setTimeout(()=>{
        //     copyMsg.classList.remove("active")
        // },2000)
        copyMsg.style.scale=1;
        setTimeout(() => {
            copyMsg.style.scale=0;
        }, 2000);
}



// adding event listner on the slider to change the password strength
inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})


// adding event listener to the copy button
copyBtn.addEventListener("click",(e)=>{
    if(passwordDisplay.value!==""){
        copyPassword();
    }
})



// adding event listeners to checkboxes, to monitor any changes made on those checkboxes
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBoxes.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
        // special case
        if(passwordLength < checkCount){
            passwordLength=checkCount;
            handleSlider();
        }
    })
}
allCheckBoxes.forEach((checbox)=>{
    checbox.addEventListener("change", handleCheckBoxChange)
})



// password generation phase starts from here
// creating a random integer
function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}
// generate random number(single digit)
function getRandomNumber(){
    return getRandomInteger(0,9);
}
// generate random lowercase alphabet
function getRandomLowercase(){
   return String.fromCharCode(getRandomInteger(97, 123));
}
// generate random uppercase alphabet
function getRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
// generate random symbol
function getRandomSymbol(){
    const num = getRandomInteger(0, symbols.length);
    return symbols.charAt(num);
}
// password shuffling function
// shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// Shuffle the array randomly - Fisher Yates Method
function shufflePassword(array){
     for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
// adding event listener on generate password button to generate a password using the above functions
generateBtn.addEventListener("click",(e)=>{
    // if none of the check boxes are clicked
    if(checkCount<=0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // new password generation
    // step-1  remove old password
    password="";

    // putting the stuff mentioned in the check boxes
    // if(uppercaseCheck.checked){
    //     password+= getRandomUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+= getRandomLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+= getRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+= getRandomSymbol();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(getRandomUppercase)
    }
    if(lowercaseCheck.checked){
        funcArr.push(getRandomLowercase)
    }
    if(numbersCheck.checked){
        funcArr.push(getRandomNumber)
    }
    if(symbolsCheck.checked){
        funcArr.push(getRandomSymbol)
    }
    // putting the stuff mentioned in the check boxes
    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }
    // remaining character additions
    for(let i=0; i<passwordLength-funcArr.length;i++){
        let randomIndex = getRandomInteger(0, funcArr.length);
        password+= funcArr[randomIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password)); // here we passed the password in form of an array
    // showing the password in UI
    passwordDisplay.value=password;

    // showing the strength of the password
    calculateStrength();


})
 
