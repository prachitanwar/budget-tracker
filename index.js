const form = document.querySelector(".add");
const income_list = document.querySelector("ul.income-list");
const expense_list = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
let transactions = [];

transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];


form.addEventListener("submit",event => {
    event.preventDefault(); 
    if(form.source.value.trim()==="" || form.amount.value.trim()==="")
    {
        return alert("Please add valid values");
    }
    addDataToLocalStorage(form.source.value.trim(),Number(form.amount.value.trim()),event);
    addStatistics();
    form.reset();
    
})

income_list.addEventListener("click",event=>{
    if(event.target.classList.contains("delete"))
    {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        addStatistics();

    }
})

expense_list.addEventListener("click",event=>{
    if(event.target.classList.contains("delete"))
    {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        addStatistics();

    }
})


function addDataToLocalStorage(source,amount,event){
    const time = new Date();
    const transaction={
        id: Math.floor(Math.random()*100000), 
        source: source, 
        amount: amount, 
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
   localStorage.setItem("transactions", JSON.stringify(transactions));
   updateTransactionDOM(transaction.id,source,amount,transaction.time);
}

function generateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}


function updateTransactionDOM(id,source,amount,time)
{
  if(amount >= 0)
   {
    income_list.innerHTML += generateTemplate(id, source, amount, time);
   }
   else if(amount < 0){
    expense_list.innerHTML += generateTemplate(id, source, amount, time);
   }
   else
   {
    ""("Please provide valid amount");
   }
}



function getTransactionfromDB()
{
    transactions.forEach(item => {
        if(item.amount >= 0)
        {
         income_list.innerHTML += generateTemplate(item.id, item.source, item.amount, item.time);
        }
        else if(item.amount < 0){
         expense_list.innerHTML += generateTemplate(item.id, item.source, item.amount, item.time);
        }
        else
        {
         console.log("Please provide valid amount");
        }
    });
}

function addStatistics()
{
    const updated_income = transactions
                            .filter(transaction=> transaction.amount > 0)
                            .reduce((total,transaction) => total += transaction.amount,0);
    const updated_expense = transactions
                          .filter(transaction=> transaction.amount < 0)
                          .reduce((total,transaction) => total += Math.abs(transaction.amount),0);
    const total_balance = updated_income - updated_expense;
    balance.textContent = total_balance;
    income.textContent = updated_income;
    expense.textContent = updated_expense;
}

function deleteTransaction(id){
    transactions = transactions.filter(transaction =>
        {
            return transaction.id != id;
        })
    localStorage.setItem("transactions",JSON.stringify(transactions));
}

addStatistics();
getTransactionfromDB();
