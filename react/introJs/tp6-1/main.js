function isPalindrome(string) {
    const isString = typeof string === "string";
    if (isString) {
        string = string.toLocaleLowerCase().replace(/\s/g, "");
        const reversed = [...string].reverse().join('');
        return string === reversed;
    }
}

const string = "hello";
console.log(isPalindrome(string));