
function isNumberOfCharGreatenThan(nbr, string) {
    if (string != null) {
        return string.length >= nbr;
    }
    return false;
}
function hasNumber(string) {
    const regex = new RegExp(/\d/);

    if (string != null) return regex.test(string);
    return false;
}
function hasUperCase(string) {
    const regex = new RegExp(/[A-Z]/);

    if (string != null) return regex.test(string);
    return false;
}
function validatePassWord(passWord) {
    let response = { 'message': "Password validate", 'isValidate': true };
    if (!isNumberOfCharGreatenThan(8, passWord)) {
        response.message = "password at least has 8 caractere",
            response.isValidate = false;
    }
    else if (!hasNumber(passWord)) {
        response.message = "password at least has a number";
        response.isValidate = false;

    }
    else if (!hasUperCase(passWord)) {
        response.message = "password at upercase";
        response.isValidate = false;

    }
    return response;

}
console.log(validatePassWord("edsdsd2Pfaf"))