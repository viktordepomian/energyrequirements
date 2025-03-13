/**
 * Energy Calculator - JavaScript Calculations
 * Implements Harris-Benedict, Mifflin, and Quick formulas for energy needs calculation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get form and result elements
    const calculatorForm = document.getElementById('calculator-form');
    const resultsSection = document.getElementById('results-section');
    const bmrResult = document.getElementById('bmr-result');
    const teeResult = document.getElementById('tee-result');
    const formulaExplanation = document.getElementById('formula-explanation');
    
    // Add event listener for form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateResults();
    });
    
    // Main calculation function
    function calculateResults() {
        // Get input values
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const age = parseInt(document.getElementById('age').value);
        const activity = parseFloat(document.getElementById('activity').value);
        const formula = document.querySelector('input[name="formula"]:checked').value;
        
        // Validate inputs
        if (!gender || isNaN(weight) || isNaN(height) || isNaN(age) || isNaN(activity)) {
            alert('Vänligen fyll i alla fält korrekt.');
            return;
        }
        
        // Calculate BMR based on selected formula
        let bmr = 0;
        let explanationText = '';
        
        if (formula === 'harris-benedict') {
            bmr = calculateHarrisBenedict(gender, weight, height, age);
            explanationText = getHarrisBenedictExplanation(gender, weight, height, age, bmr);
        } else if (formula === 'mifflin') {
            bmr = calculateMifflin(gender, weight, height, age);
            explanationText = getMifflinExplanation(gender, weight, height, age, bmr);
        } else if (formula === 'quick') {
            // Quick formula doesn't use BMR, it directly calculates TEE
            const tee = calculateQuick(weight);
            bmrResult.textContent = 'N/A';
            teeResult.textContent = Math.round(tee) + ' kcal/dag';
            formulaExplanation.innerHTML = getQuickExplanation(weight, tee);
            resultsSection.style.display = 'block';
            return;
        }
        
        // Calculate TEE (Total Energy Expenditure)
        const tee = bmr * activity;
        
        // Display results
        bmrResult.textContent = Math.round(bmr) + ' kcal/dag';
        teeResult.textContent = Math.round(tee) + ' kcal/dag';
        
        // Add PAL explanation to the formula explanation
        explanationText += getPalExplanation(activity, bmr, tee);
        
        // Update formula explanation
        formulaExplanation.innerHTML = explanationText;
        
        // Show results section
        resultsSection.style.display = 'block';
    }
    
    // Harris-Benedict formula calculation
    function calculateHarrisBenedict(gender, weight, height, age) {
        if (gender === 'male') {
            return 66.5 + (13.8 * weight) + (5 * height) - (6.8 * age);
        } else {
            return 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
        }
    }
    
    // Mifflin formula calculation
    function calculateMifflin(gender, weight, height, age) {
        const genderValue = (gender === 'male') ? 1 : 0;
        return 9.99 * weight + 6.25 * height - 4.92 * age + 166 * genderValue - 161;
    }
    
    // Quick formula calculation
    function calculateQuick(weight) {
        // Using average value of 27.5 kcal/kg/day (middle of 25-30 range for healthy adults)
        return weight * 27.5;
    }
    
    // Generate explanation text for Harris-Benedict formula
    function getHarrisBenedictExplanation(gender, weight, height, age, bmr) {
        let formula = '';
        if (gender === 'male') {
            formula = `66.5 + (13.8 × ${weight}) + (5 × ${height}) - (6.8 × ${age})`;
        } else {
            formula = `655 + (9.6 × ${weight}) + (1.8 × ${height}) - (4.7 × ${age})`;
        }
        
        return `<h4>Harris-Benedict formel (${gender === 'male' ? 'män' : 'kvinnor'}):</h4>
                <p>${formula} = ${Math.round(bmr)} kcal/dag</p>`;
    }
    
    // Generate explanation text for Mifflin formula
    function getMifflinExplanation(gender, weight, height, age, bmr) {
        const genderValue = (gender === 'male') ? 1 : 0;
        const formula = `9.99 × ${weight} + 6.25 × ${height} - 4.92 × ${age} + 166 × ${genderValue} - 161`;
        
        return `<h4>Mifflin formel:</h4>
                <p>${formula} = ${Math.round(bmr)} kcal/dag</p>`;
    }
    
    // Generate explanation text for Quick formula
    function getQuickExplanation(weight, tee) {
        return `<h4>Snabbformel:</h4>
                <p>${weight} kg × 27.5 = ${Math.round(tee)} kcal/dag</p>
                <p>Snabbformeln ger en direkt uppskattning av totalt energibehov utan att beräkna BMR separat.</p>`;
    }
    
    // Generate explanation text for PAL adjustment
    function getPalExplanation(activity, bmr, tee) {
        return `<h4>PAL-justering:</h4>
                <p>BMR (${Math.round(bmr)} kcal/dag) × PAL (${activity}) = ${Math.round(tee)} kcal/dag</p>`;
    }
});
