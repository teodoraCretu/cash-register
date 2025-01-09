let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const CURRENCY_UNITS = [
  ["PENNY", 0.01],
  ["NICKEL", 0.05],
  ["DIME", 0.1],
  ["QUARTER", 0.25],
  ["ONE", 1],
  ["FIVE", 5],
  ["TEN", 10],
  ["TWENTY", 20],
  ["ONE HUNDRED", 100],
];
const changeDueElement = document.getElementById("change-due");
const cash = document.getElementById("cash");
const priceHTML = document.getElementById("total");
priceHTML.innerHTML += `${price}`;
const payBtn = document.getElementById("purchase-btn");
const registerContainer = document.querySelector(".register-container");

 const showRegister = () => {
    cid.forEach(([name, amount]) => {
    const registerParagraph = document.createElement("p");
   registerParagraph.innerHTML = `${name}: <strong>$${amount.toFixed(2)}</strong>`;
   registerContainer.appendChild(registerParagraph);
  });
  }

const calculateTotalRegister = (cid) => {
  let sumRegister = 0;
  cid.forEach(([name, amount]) => {
    sumRegister += parseFloat(amount);
  })
  return sumRegister.toFixed(2);
}

const calculateChange = (changeDue, cid) => {
  let remainingChange = changeDue;
  const change = [];

  for(let i = CURRENCY_UNITS.length - 1; i>= 0; i--){
    const [unitName, unitValue] = CURRENCY_UNITS[i];
    let unitTotal = cid[i][1];
    let unitCount = 0;

    while( remainingChange >= unitValue && unitTotal > 0){
      remainingChange = parseFloat((remainingChange - unitValue).toFixed(2));
      unitTotal -= unitValue;
      unitCount += unitValue;
    }

    if(unitCount > 0) {
      change.push([unitName, unitCount]);
    }
  }

  return remainingChange > 0 ? null : change;
}

const formatChange = (change) => {
  return change
  .map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join("<br>");
}

const updateRegister = (change) => {
  change.forEach(([unitName, amount]) => {
    const unitIndex = cid.findIndex(([name]) => name === unitName);
    cid[unitIndex][1] -= amount;
  })
  registerContainer.innerHTML = "";
  showRegister();
}

const handleButton = () => {

  changeDueElement.textContent = "";
  const cashAmount = parseFloat(cash.value).toFixed(2);
  const changeDue = cashAmount - price;
  const sumOfRegister = calculateTotalRegister(cid);
  const change = calculateChange(changeDue, cid);
  if(cashAmount < price){
    alert("Customer does not have enough money to purchase the item");
    return;
  }else if(cashAmount == price){
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    return;
  }else if(sumOfRegister < changeDue || change === null){
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }else if(price < cashAmount && sumOfRegister == changeDue){
    changeDueElement.innerHTML = `Status: CLOSED <br>${formatChange(change)}`;
    console.log("CLOSED")
    updateRegister(change);
    showRegister();
    return;
  }else if(cashAmount > price && sumOfRegister > changeDue){
  changeDueElement.innerHTML = `Status: OPEN <br>${formatChange(change)}`;
  updateRegister(change);
  return
  }
}

payBtn.addEventListener("click", handleButton);
showRegister();