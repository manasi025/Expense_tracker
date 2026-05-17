const API = "http://localhost:5000/api";


// ================= SIGNUP =================

async function signup() {

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API}/auth/signup`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

        window.location.href = "login.html";

    } catch (error) {

        console.log(error);

        alert("Signup failed");
    }
}



// ================= LOGIN =================

async function login() {

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    try {

        const response = await fetch(`${API}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        console.log(data);

        if (data.token) {

            localStorage.setItem("token", data.token);

            alert("Login successful");

            window.location.href = "dashboard.html";

        } else {

            alert(data.message || "Login failed");
        }

    } catch (error) {

        console.log(error);

        alert("Login failed");
    }
}



// ================= ADD EXPENSE =================

async function addExpense() {

    const category = document.getElementById("category").value;

    const amount = document.getElementById("amount").value;

    const comments = document.getElementById("comments").value;

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please login first");

        window.location.href = "login.html";

        return;
    }

    try {

        const response = await fetch(`${API}/expenses`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                authorization: token
            },

            body: JSON.stringify({
                category,
                amount,
                comments
            })
        });

        const data = await response.json();

        console.log(data);

        document.getElementById("category").value = "";

        document.getElementById("amount").value = "";

        document.getElementById("comments").value = "";

        await loadExpenses();

    } catch (error) {

        console.log(error);

        alert("Failed to add expense");
    }
}



// ================= LOAD EXPENSES =================

async function loadExpenses() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(`${API}/expenses`, {

            headers: {
                authorization: token
            }
        });

        const data = await response.json();

        console.log(data);

        let rows = "";

        let categories = {};

        data.forEach(expense => {

            rows += `
            <tr>
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
                <td>${expense.comments || ""}</td>
                <td>${expense.created_at}</td>

                <td>
                    <button onclick="editExpense(
                        ${expense.id},
                        '${expense.category}',
                        '${expense.amount}',
                        '${expense.comments || ""}'
                    )">
                        Edit
                    </button>

                    <button onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </td>
            </tr>
            `;

            if (categories[expense.category]) {

                categories[expense.category] += Number(expense.amount);

            } else {

                categories[expense.category] = Number(expense.amount);
            }
        });

        document.getElementById("expenseTable").innerHTML = rows;

        createChart(categories);

    } catch (error) {

        console.log(error);

        alert("Failed to load expenses");
    }
}



// ================= DELETE EXPENSE =================

async function deleteExpense(id) {

    const token = localStorage.getItem("token");

    try {

        await fetch(`${API}/expenses/${id}`, {

            method: "DELETE",

            headers: {
                authorization: token
            }
        });

        await loadExpenses();

    } catch (error) {

        console.log(error);

        alert("Delete failed");
    }
}



// ================= EDIT EXPENSE =================

async function editExpense(id, oldCategory, oldAmount, oldComments) {

    const category = prompt("Enter category", oldCategory);

    const amount = prompt("Enter amount", oldAmount);

    const comments = prompt("Enter comments", oldComments);

    const token = localStorage.getItem("token");

    try {

        await fetch(`${API}/expenses/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                authorization: token
            },

            body: JSON.stringify({
                category,
                amount,
                comments
            })
        });

        await loadExpenses();

    } catch (error) {

        console.log(error);

        alert("Update failed");
    }
}



// ================= PIE CHART =================

let chart;

function createChart(categories) {

    const ctx = document.getElementById("myChart");

    if (!ctx) {
        return;
    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: Object.keys(categories),

            datasets: [{
                data: Object.values(categories)
            }]
        }
    });
}



// ================= AUTO LOAD DASHBOARD =================

if (window.location.pathname.includes("dashboard")) {

    loadExpenses();
}