/**
 * HQ Engine - UI Event Router & Data Management Pipeline
 * Controls dynamic tracking changes and synchronizes state updates with db.js.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Confirm Database Engine Link is active
    if (!window.DB) {
        console.error("Critical Failure: db.js storage interface script unrecognized.");
        return;
    }

    // Capture Core DOM Handle Nodes
    const ledgerForm = document.getElementById('ledger-form');
    const taskForm = document.getElementById('task-form');
    const billingForm = document.getElementById('billing-form');
    
    const ledgerContainer = document.getElementById('ledger-container');
    const tasksActive = document.getElementById('tasks-active');
    const tasksDone = document.getElementById('tasks-done');
    const billingContainer = document.getElementById('billing-container');

    // --- REFRESH DISPLAY CONTROLLERS ---

    async function refreshDashboard() {
        const transactions = await window.DB.getAllTransactions();
        const tasks = await window.DB.getAllTasks();
        const leads = await window.DB.getAllLeads();

        // 1. Compile Live Finance Metrics Summary
        let totalRevenue = 0;
        let totalExpenses = 0;

        ledgerContainer.innerHTML = '';
        if (transactions.length === 0) {
            ledgerContainer.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">No active records captured in local cache.</p>`;
        }

        transactions.forEach(tx => {
            const amt = parseFloat(tx.amount) || 0;
            if (tx.type === 'income') totalRevenue += amt;
            else totalExpenses += amt;

            // Render transaction row element card
            const item = document.createElement('div');
            item.className = `flex justify-between items-center p-3 rounded-lg bg-slate-900 border text-sm ${tx.type === 'income' ? 'border-emerald-500/30' : 'border-rose-500/30'}`;
            item.innerHTML = `
                <div>
                    <p class="font-medium text-slate-200">${tx.description}</p>
                    <p class="text-[10px] text-slate-500 font-mono">${tx.date}</p>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}">
                        ${tx.type === 'income' ? '+' : '-'} ₹${amt.toLocaleString('en-IN')}
                    </span>
                    <button data-id="${tx.id}" class="delete-tx-btn text-xs text-slate-500 hover:text-rose-400 transition-colors font-mono">×</button>
                </div>
            `;
            ledgerContainer.appendChild(item);
        });

        // Format and push statistics calculations to the screen panels
        document.getElementById('stat-revenue').innerText = `₹${totalRevenue.toLocaleString('en-IN')}`;
        document.getElementById('stat-expenses').innerText = `₹${totalExpenses.toLocaleString('en-IN')}`;
        const netPosition = totalRevenue - totalExpenses;
        const netElement = document.getElementById('stat-net');
        netElement.innerText = `₹${netPosition.toLocaleString('en-IN')}`;
        netElement.className = `text-2xl font-bold mt-1 ${netPosition >= 0 ? 'text-white' : 'text-rose-400'}`;

        // 2. Compile Productivity Board Layout
        tasksActive.innerHTML = '';
        tasksDone.innerHTML = '';

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = "bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-center text-sm shadow-sm";
            
            if (task.progress === 'active') {
                card.innerHTML = `
                    <span class="text-slate-300 font-medium">${task.title}</span>
                    <button data-id="${task.id}" data-title="${task.title}" class="complete-task-btn text-xs bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white px-2 py-1 rounded transition-all font-medium">Complete</button>
                `;
                tasksActive.appendChild(card);
            } else {
                card.innerHTML = `
                    <span class="line-through text-slate-500">${task.title}</span>
                    <button data-id="${task.id}" class="delete-task-btn text-xs text-slate-600 hover:text-rose-400 font-mono">×</button>
                `;
                tasksDone.appendChild(card);
            }
        });

        // 3. Compile Document Pipeline Leads List Registry
        billingContainer.innerHTML = '';
        if (leads.length === 0) {
            billingContainer.innerHTML = `<tr><td colspan="4" class="p-4 text-xs text-slate-500 text-center">No compiled client documents on record locally.</td></tr>`;
        }

        leads.forEach(lead => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-slate-800 hover:bg-slate-800/40 transition-colors";
            tr.innerHTML = `
                <td class="p-3 font-semibold text-slate-300">${lead.name}</td>
                <td class="p-3"><span class="px-2 py-0.5 text-[11px] font-mono rounded ${lead.type === 'Invoice' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">${lead.type}</span></td>
                <td class="p-3 font-mono font-bold text-slate-400">₹${parseFloat(lead.value).toLocaleString('en-IN')}</td>
                <td class="p-3">
                    <button data-name="${lead.name}" data-type="${lead.type}" data-value="${lead.value}" data-desc="${lead.description}" class="download-old-doc-btn text-xs text-purple-400 hover:underline font-medium">Re-Download PDF</button>
                </td>
            `;
            billingContainer.appendChild(tr);
        });

        setupDynamicEventListeners();
    }

    // --- EVENT ATTACHMENT DELEGATORS ---

    function setupDynamicEventListeners() {
        // Handle Action Event to Delete Transaction from Ledger
        document.querySelectorAll('.delete-tx-btn').forEach(btn => {
            btn.onclick = async (e) => {
                await window.DB.deleteTransaction(parseInt(e.target.dataset.id));
                refreshDashboard();
            };
        });

        // Handle Action Event to Advance Tasks Stage to Complete
        document.querySelectorAll('.complete-task-btn').forEach(btn => {
            btn.onclick = async (e) => {
                await window.DB.saveTask({
                    id: parseInt(e.target.dataset.id),
                    title: e.target.dataset.title,
                    progress: 'done',
                    timestamp: Date.now()
                });
                refreshDashboard();
            };
        });

        // Handle Action Event to Purge Task from History
        document.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.onclick = async (e) => {
                await window.DB.deleteTask(parseInt(e.target.dataset.id));
                refreshDashboard();
            };
        });

        // Handle Action Event to Re-download historical files without re-entry
        document.querySelectorAll('.download-old-doc-btn').forEach(btn => {
            btn.onclick = (e) => {
                const ds = e.target.dataset;
                window.generateDocumentPDF(ds.name, ds.type, parseFloat(ds.value), ds.desc);
            };
        });
    }

    // --- FORM INTERCEPTION EVENTS ---

    ledgerForm.onsubmit = async (e) => {
        e.preventDefault();
        await window.DB.addTransaction({
            type: document.getElementById('grid-type' ? 'grid-type' : 'ledg-type').value,
            amount: parseFloat(document.getElementById('ledg-amount').value),
            description: document.getElementById('ledg-desc').value,
            date: new Date().toLocaleDateString('en-IN')
        });
        ledgerForm.reset();
        refreshDashboard();
    };

    taskForm.onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('task-title');
        await window.DB.saveTask({
            title: input.value,
            progress: 'active',
            timestamp: Date.now()
        });
        input.value = '';
        refreshDashboard();
    };

    billingForm.onsubmit = async (e) => {
        e.preventDefault();
        const client = document.getElementById('bill-client').value;
        const type = document.getElementById('bill-type').value;
        const amount = parseFloat(document.getElementById('bill-amount').value);
        const desc = document.getElementById('bill-item-desc').value;

        // 1. Commit document parameters to local database registry pipeline
        await window.DB.saveLead({
            name: client,
            type: type,
            value: amount,
            description: desc,
            timestamp: Date.now()
        });

        // 2. Trigger Client Vector PDF compilation download instantly
        window.generateDocumentPDF(client, type, amount, desc);

        billingForm.reset();
        refreshDashboard();
    };

    // Initial load paint cycle
    await refreshDashboard();
});