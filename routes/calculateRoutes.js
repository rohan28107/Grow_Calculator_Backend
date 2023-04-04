const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {User} = require('../model/User.model');


userRouter.post('/calculate', async(req, res) =>{
    try {
        const { annualInstalmentAmount, annualInterestRate, totalNumberOfYears } = req.body;
        const rateOfInterest = annualInterestRate / 100;
        const totalNumberOfMonths = totalNumberOfYears * 12;
        const maturityValue = annualInstalmentAmount * ((Math.pow((1 + rateOfInterest), totalNumberOfMonths) - 1) / rateOfInterest);
        const totalInvestmentAmount = annualInstalmentAmount * totalNumberOfYears;
        const totalInterestGained = maturityValue - totalInvestmentAmount;
        return res.json({
            totalInvestmentAmount,
            totalInterestGained,
            maturityValue
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
})