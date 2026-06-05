function calculator(a, b, operation) {
    switch (operation) {
        case "+":
            return a + b
        case "-":
            return a - b
        case "*":
            return a * b
        case "/":
            return a / b
        default:
            throw new Error("Opération inconnue");
    }
}
try {
    const resp = calculator (10,5 , "%");
    console.log (resp);
} catch (error) {
    console.log ("erreur: " + error.message);
}