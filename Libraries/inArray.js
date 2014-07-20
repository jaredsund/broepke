/*
functionality: Determines if the passed value is an element of the passed Array
input   : passedArray - simple array
        : matchObject - test value
return  : boolean - true, item exists in array - false, item not found
*/

function inArray(passedArray, matchObject) {

    for(var arrayIndex in passedArray){
        if(passedArray[arrayIndex] === matchObject) return true;
    }
    
    return false;
}