const { default: mongoose } = require("mongoose");

const calculationSchema = new mongoose.Schema({
    annualInstalmentAmount: Number,
    annualInterestRate: Number,
    totalNumberOfYears: Number,
    totalInterestGained: Number,
    totalInvestmentAmount: Number,
    maturityValue: Number,
    createdAt: { type: Date, default: Date.now },
});

const Calculation = mongoose.model("Calculation", calculationSchema);

module.exports = {
    Calculation
}