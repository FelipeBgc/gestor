const inventoryKey = 'gestorInventory';
const inventorySearch = document.getElementById('inventory-search');
const inventoryItems = document.getElementById('inventory-items');
const inventoryCount = document.getElementById('inventory-count');
const addStockBtn = document.querySelector('.add-stock');
const orderNameInput = document.querySelector('.order-name');
const detailsInput = document.querySelector('.product-details');
const sizeInput = document.querySelector('.product-size');
const unitPriceInput = document.querySelector('.unit-price');
const quantityInput = document.querySelector('.quantity');
const totalValueInput = document.querySelector('.total-value');
const costPriceInput = document.querySelector('.cost-price');
const profitMarginInput = document.querySelector('.profit-margin');
const sellingPriceInput = document.querySelector('.selling-price');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const clientsKey = 'gestorClients';
const clientsSearch = document.getElementById('clients-search');
const clientList = document.getElementById('client-list');
const clientsCount = document.getElementById('clients-count');
const newClientBtn = document.querySelector('.new-client-btn');
const clientFormEl = document.getElementById('client-form');
const saveClientBtn = document.querySelector('.save-client');
const cancelClientBtn = document.querySelector('.cancel-client');
const clientNameInput = document.querySelector('.client-name');
const clientSourceInput = document.querySelector('.client-source');
const clientTypeInputs = document.getElementsByName('client-type');
const clientCpfInput = document.querySelector('.client-cpf');
const clientCnpjInput = document.querySelector('.client-cnpj');
const clientRazaoInput = document.querySelector('.client-razao');
const clientPhoneInput = document.querySelector('.client-phone');
const clientAddressInput = document.querySelector('.client-address');
const clientBirthdayInput = document.querySelector('.client-birthday');
const clientNotesInput = document.querySelector('.client-notes');
const ordersKey = 'gestorOrders';
const ordersSearch = document.getElementById('orders-search');
const orderList = document.getElementById('order-list');
const orderCount = document.getElementById('order-count');
const newOrderBtn = document.querySelector('.new-order-btn');
const orderFormEl = document.getElementById('order-form');
const orderCodeInput = document.querySelector('.order-code');
const orderDateInput = document.querySelector('.order-date');
const orderClientSelect = document.querySelector('.order-client-select');
const orderClientNameNew = document.querySelector('.order-client-name-new');
const orderClientNameRow = document.querySelector('.client-name-new-row');
const orderProductSelect = document.querySelector('.order-product');
const orderQuantityInput = document.querySelector('.order-quantity');
const orderDiscountInput = document.querySelector('.order-discount');
const orderFreightInput = document.querySelector('.order-freight');
const orderFeesInput = document.querySelector('.order-fees');
const orderTotalInput = document.querySelector('.order-total');
const orderPaymentInputs = document.getElementsByName('order-payment');
const orderSignalRow = document.querySelector('.order-signal-row');
const orderSignalAmountInput = document.querySelector('.order-signal-amount');
const orderSignalDateInput = document.querySelector('.order-signal-date');
const orderInstallmentsRow = document.querySelector('.order-installments-row');
const orderInstallmentsQtyInput = document.querySelector('.order-installments-qty');
const orderInstallmentValueInput = document.querySelector('.order-installment-value');
const orderNotesInput = document.querySelector('.order-notes');
const orderPaidInput = document.querySelector('.order-paid');
const calendarPrevBtn = document.querySelector('.calendar-prev');
const calendarNextBtn = document.querySelector('.calendar-next');
const calendarGrid = document.getElementById('calendar-grid');
const calendarTitle = document.querySelector('.calendar-title');
const agendaSelectedDateInput = document.querySelector('.agenda-selected-date');
const agendaNotesTextarea = document.querySelector('.agenda-notes');
const saveAgendaEventBtn = document.querySelector('.save-agenda-event');
const agendaEventsList = document.querySelector('.agenda-events-list');
const agendaPaymentList = document.querySelector('.agenda-payment-list');
const financePeriodSelect = document.getElementById('finance-period');
const financeMonthPicker = document.querySelector('.finance-month-picker');
const financeMonthField = document.querySelector('.finance-month-field');
const financeReceivedBtn = document.querySelector('.finance-received-btn');
const financeReceivableBtn = document.querySelector('.finance-receivable-btn');
const financeOverdueBtn = document.querySelector('.finance-overdue-btn');
const financeDetailList = document.querySelector('.finance-detail-list');
const financeCategoryTitle = document.querySelector('.finance-category-title');
const financeReceivedValue = document.getElementById('finance-received-value');
const financeReceivableValue = document.getElementById('finance-receivable-value');
const financeOverdueValue = document.getElementById('finance-overdue-value');
const financeTotalValue = document.querySelector('.finance-total-value');
const financeInvestmentValue = document.getElementById('finance-investment-value');
const financeCashValue = document.getElementById('finance-cash-value');
const financeChartCanvas = document.getElementById('finance-chart');
const saveOrderBtn = document.querySelector('.save-order');
const cancelOrderBtn = document.querySelector('.cancel-order');
const orderFormTitle = document.querySelector('#order-form h2');
let editingOrderCode = null;
let activeFinanceCategory = 'recebido';

function getInventoryData() {
    try {
        return JSON.parse(localStorage.getItem(inventoryKey) || '[]');
    } catch {
        return [];
    }
}

function setInventoryData(data) {
    localStorage.setItem(inventoryKey, JSON.stringify(data));
}

function formatMoney(value) {
    return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateValues() {
    if (!unitPriceInput || !quantityInput || !totalValueInput || !costPriceInput || !profitMarginInput || !sellingPriceInput) {
        return;
    }

    const price = parseFloat(unitPriceInput.value) || 0;
    const quantity = parseInt(quantityInput.value, 10) || 0;
    const total = price * quantity;
    totalValueInput.value = formatMoney(total);

    const cost = parseFloat(costPriceInput.value) || 0;
    const margin = parseFloat(profitMarginInput.value) || 0;
    const selling = cost * (1 + margin / 100);
    sellingPriceInput.value = formatMoney(selling);
}

function resetForm() {
    if (!orderNameInput) return;
    orderNameInput.value = '';
    detailsInput.value = '';
    sizeInput.value = '';
    unitPriceInput.value = '';
    quantityInput.value = 1;
    costPriceInput.value = '';
    profitMarginInput.value = '';
    totalValueInput.value = formatMoney(0);
    sellingPriceInput.value = formatMoney(0);
    orderNameInput.focus();
}

function renderInventory(filter = '') {
    if (!inventoryItems || !inventoryCount) return;

    const query = filter.trim().toLowerCase();
    const inventoryData = getInventoryData();
    inventoryItems.innerHTML = '';

    const filteredItems = inventoryData.filter(item => {
        return item.product.toLowerCase().includes(query)
            || item.details.toLowerCase().includes(query)
            || item.size.toLowerCase().includes(query);
    });

    if (filteredItems.length === 0) {
        inventoryItems.innerHTML = `
            <tr class="inventory-empty">
                <td colspan="6">Nenhuma peça encontrada no estoque.</td>
            </tr>`;
    } else {
        filteredItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Produto">${item.product}</td>
                <td data-label="Detalhes">${item.details || '—'}</td>
                <td data-label="Tamanho">${item.size || '—'}</td>
                <td data-label="Qtd">${item.quantity}</td>
                <td data-label="Total">${formatMoney(item.total)}</td>
                <td data-label="Preço de venda">${formatMoney(item.sellingPrice)}</td>
            `;
            inventoryItems.appendChild(row);
        });
    }

    inventoryCount.textContent = filteredItems.length;
}

function addStock() {
    if (!orderNameInput) return;

    const product = orderNameInput.value.trim() || 'Produto não informado';
    const details = detailsInput.value.trim();
    const size = sizeInput.value.trim();
    const quantity = parseInt(quantityInput.value, 10) || 0;
    const total = parseFloat((parseFloat(unitPriceInput.value) || 0) * quantity);
    const sellingPrice = (parseFloat(costPriceInput.value) || 0) * (1 + (parseFloat(profitMarginInput.value) || 0) / 100);

    const inventoryData = getInventoryData();
    inventoryData.push({
        product,
        details,
        size,
        quantity,
        total,
        sellingPrice: sellingPrice || 0
    });

    setInventoryData(inventoryData);
    renderInventory(inventorySearch ? inventorySearch.value : '');
    populateProductOptions();
    resetForm();
    alert('Produto adicionado ao estoque.');
}

if (addStockBtn) {
    addStockBtn.addEventListener('click', addStock);
    [unitPriceInput, quantityInput, costPriceInput, profitMarginInput].forEach(input => {
        if (input) input.addEventListener('input', updateValues);
    });
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar?.classList?.add('open');
        sidebarOverlay?.classList?.add('open');
    });
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
        sidebar?.classList?.remove('open');
        sidebarOverlay?.classList?.remove('open');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar?.classList?.remove('open');
        sidebarOverlay?.classList?.remove('open');
    });
}

if (inventorySearch) {
    inventorySearch.addEventListener('input', () => renderInventory(inventorySearch.value));
}

// Clients storage and UI
function getClientsData() {
    try {
        return JSON.parse(localStorage.getItem(clientsKey) || '[]');
    } catch {
        return [];
    }
}

function setClientsData(data) {
    localStorage.setItem(clientsKey, JSON.stringify(data));
}

function renderClients(filter = '') {
    if (!clientList || !clientsCount) return;
    const q = (filter || '').trim().toLowerCase();
    const data = getClientsData();
    clientList.innerHTML = '';

    const filtered = data.filter(c => {
        return c.name.toLowerCase().includes(q)
            || (c.phone || '').toLowerCase().includes(q)
            || (c.source || '').toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
        clientList.innerHTML = `
            <tr class="inventory-empty">
                <td colspan="6">Nenhum cliente encontrado.</td>
            </tr>`;
    } else {
        filtered.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Nome">${c.name}</td>
                <td data-label="Origem">${c.source || '—'}</td>
                <td data-label="Tipo">${c.type === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}</td>
                <td data-label="Documento">${c.type === 'pj' ? (c.cnpj || '—') : (c.cpf || '—')}</td>
                <td data-label="Telefone">${c.phone || '—'}</td>
                <td data-label="Aniversário">${c.birthday ? new Date(c.birthday).toLocaleDateString('pt-BR') : '—'}</td>
            `;
            clientList.appendChild(row);
        });
    }

    clientsCount.textContent = filtered.length;
}

function resetClientForm() {
    if (!clientNameInput) return;
    clientNameInput.value = '';
    if (clientSourceInput) clientSourceInput.value = '';
    if (clientTypeInputs) {
        for (const r of clientTypeInputs) {
            if (r.value === 'pf') r.checked = true;
        }
    }
    if (clientCpfInput) clientCpfInput.value = '';
    if (clientCnpjInput) clientCnpjInput.value = '';
    if (clientRazaoInput) clientRazaoInput.value = '';
    if (clientPhoneInput) clientPhoneInput.value = '';
    if (clientAddressInput) clientAddressInput.value = '';
    if (clientBirthdayInput) clientBirthdayInput.value = '';
    if (clientNotesInput) clientNotesInput.value = '';
    toggleClientType();
}

function toggleClientType() {
    if (!clientTypeInputs) return;
    let type = 'pf';
    for (const r of clientTypeInputs) {
        if (r.checked) { type = r.value; break; }
    }
    document.querySelectorAll('.client-pf-row').forEach(el => {
        if (type === 'pf') el.classList.remove('hidden-field'); else el.classList.add('hidden-field');
    });
    document.querySelectorAll('.client-pj-row').forEach(el => {
        if (type === 'pj') el.classList.remove('hidden-field'); else el.classList.add('hidden-field');
    });
}

function addClient() {
    if (!clientNameInput) return;
    const name = clientNameInput.value.trim();
    if (!name) { alert('Nome do cliente é obrigatório.'); clientNameInput.focus(); return; }
    const source = clientSourceInput ? clientSourceInput.value : '';
    let type = 'pf';
    if (clientTypeInputs) {
        for (const r of clientTypeInputs) if (r.checked) { type = r.value; break; }
    }
    const cpf = clientCpfInput ? clientCpfInput.value.trim() : '';
    const cnpj = clientCnpjInput ? clientCnpjInput.value.trim() : '';
    const razao = clientRazaoInput ? clientRazaoInput.value.trim() : '';
    const phone = clientPhoneInput ? clientPhoneInput.value.trim() : '';
    const address = clientAddressInput ? clientAddressInput.value.trim() : '';
    const birthday = clientBirthdayInput ? clientBirthdayInput.value : '';
    const notes = clientNotesInput ? clientNotesInput.value.trim() : '';

    const clients = getClientsData();
    clients.push({ name, source, type, cpf, cnpj, razao, phone, address, birthday, notes, created: new Date().toISOString() });
    setClientsData(clients);
    renderClients(clientsSearch ? clientsSearch.value : '');
    populateClientOptions();
    resetClientForm();
    if (clientFormEl) clientFormEl.classList.add('hidden-field');
    alert('Cliente salvo.');
}

function getOrdersData() {
    try {
        const data = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        if (!Array.isArray(data)) return [];
        return data.map(order => ({
            ...order,
            paid: order.paid === true || order.paid === 'true',
        }));
    } catch {
        return [];
    }
}

function setOrdersData(data) {
    localStorage.setItem(ordersKey, JSON.stringify(data));
}

function generateOrderCode() {
    return 'PED-' + new Date().getTime();
}

function parseOrderDate(value) {
    if (!value) return null;
    if (typeof value !== 'string') return new Date(value);
    const parts = value.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
    }
    return new Date(value);
}

function getFinanceRange() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const period = financePeriodSelect?.value || 'current-month';
    if (period === 'today') {
        return { start: today, end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999) };
    }
    if (period === 'current-month') {
        return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999) };
    }
    if (period === 'last-month') {
        const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
        const month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
        return { start: new Date(year, month, 1), end: new Date(year, month + 1, 0, 23, 59, 59, 999) };
    }
    if (period === 'last-3-months') {
        const startMonth = today.getMonth() - 2;
        return { start: new Date(today.getFullYear(), startMonth, 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999) };
    }
    if (period === 'custom') {
        const monthValue = financeMonthPicker?.value;
        if (monthValue) {
            const [year, month] = monthValue.split('-').map(Number);
            return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0, 23, 59, 59, 999) };
        }
    }
    return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999) };
}

function getFilteredFinanceOrders() {
    const { start, end } = getFinanceRange();
    return getOrdersData().filter(order => {
        const orderDate = parseOrderDate(order.date);
        return orderDate instanceof Date && !Number.isNaN(orderDate.getTime()) && orderDate >= start && orderDate <= end;
    });
}

function sumValues(items, selector) {
    return items.reduce((sum, item) => sum + (selector(item) || 0), 0);
}

function getFinanceTotals() {
    const orders = getFilteredFinanceOrders();
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const receivedOrders = orders.filter(order => order.paid);
    const receivableOrders = orders.filter(order => {
        const signalDate = parseOrderDate(order.signalDate);
        return !order.paid && order.paymentCondition === 'sinal' && signalDate instanceof Date && !Number.isNaN(signalDate.getTime()) && signalDate >= startOfToday;
    });
    const overdueOrders = orders.filter(order => {
        const signalDate = parseOrderDate(order.signalDate);
        return !order.paid && order.paymentCondition === 'sinal' && signalDate instanceof Date && !Number.isNaN(signalDate.getTime()) && signalDate < startOfToday;
    });
    const receivedTotal = sumValues(receivedOrders, order => parseFloat(order.total) || 0);
    const receivableTotal = sumValues(receivableOrders, order => Math.max(0, (parseFloat(order.total) || 0) - (parseFloat(order.signalAmount) || 0)));
    const overdueTotal = sumValues(overdueOrders, order => Math.max(0, (parseFloat(order.total) || 0) - (parseFloat(order.signalAmount) || 0)));
    return { receivedOrders, receivableOrders, overdueOrders, receivedTotal, receivableTotal, overdueTotal, totalRevenue: receivedTotal + receivableTotal + overdueTotal };
}

function getInvestmentTotal() {
    const items = getInventoryData();
    return sumValues(items, item => parseFloat(item.total) || 0);
}

function getCashBalance() {
    const totals = getFinanceTotals();
    return totals.receivedTotal - getInvestmentTotal();
}

function getFinanceChartData() {
    const totals = getFinanceTotals();
    return {
        labels: ['Recebido', 'A receber', 'Em atraso', 'Investimento total'],
        values: [totals.receivedTotal, totals.receivableTotal, totals.overdueTotal, getInvestmentTotal()],
        colors: ['#16a34a', '#f59e0b', '#ef4444', '#2563eb'],
    };
}

function drawFinanceChart() {
    if (!financeChartCanvas) return;
    const data = getFinanceChartData();
    const ctx = financeChartCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = financeChartCanvas.getBoundingClientRect();
    financeChartCanvas.width = rect.width * dpr;
    financeChartCanvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    const maxValue = Math.max(...data.values, 1);
    const barWidth = chartWidth / data.values.length * 0.6;
    const barGap = chartWidth / data.values.length;

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.fillText('Valores em R$', padding, padding - 10);

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.16)';
    ctx.lineWidth = 1;
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i += 1) {
        const y = padding + (chartHeight / yTicks) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
        const tickValue = Math.round(maxValue - (maxValue / yTicks) * i);
        ctx.fillStyle = '#475569';
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillText(formatFinanceValue(tickValue), 4, y + 4);
    }

    data.labels.forEach((label, index) => {
        const value = data.values[index];
        const x = padding + index * barGap + (barGap - barWidth) / 2;
        const barHeight = (value / maxValue) * chartHeight;
        const y = padding + chartHeight - barHeight;

        ctx.fillStyle = data.colors[index];
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#0f172a';
        ctx.font = '600 12px Inter, system-ui, sans-serif';
        ctx.fillText(label, x, padding + chartHeight + 22);

        ctx.fillStyle = '#0f172a';
        ctx.font = '700 13px Inter, system-ui, sans-serif';
        ctx.fillText(formatFinanceValue(value), x, y - 8);
    });
}

function formatFinanceValue(value) {
    return formatMoney(value || 0);
}

function toggleFinanceMonthPicker() {
    if (!financePeriodSelect || !financeMonthField) return;
    financeMonthField.classList.toggle('hidden-field', financePeriodSelect.value !== 'custom');
}

function setFinanceActiveCategory(category) {
    if (!financeReceivedBtn || !financeReceivableBtn || !financeOverdueBtn) return;
    activeFinanceCategory = category;
    financeReceivedBtn.classList.toggle('active', category === 'recebido');
    financeReceivableBtn.classList.toggle('active', category === 'receber');
    financeOverdueBtn.classList.toggle('active', category === 'atraso');
    if (financeCategoryTitle) {
        financeCategoryTitle.textContent = category === 'recebido' ? 'Recebido' : category === 'receber' ? 'A receber' : 'Em atraso';
    }
}

function renderFinanceDetails(category) {
    if (!financeDetailList) return;
    const totals = getFinanceTotals();
    let items = [];
    if (category === 'recebido') items = totals.receivedOrders;
    if (category === 'receber') items = totals.receivableOrders;
    if (category === 'atraso') items = totals.overdueOrders;
    financeDetailList.innerHTML = items.length === 0 ? '<p>Nenhum pedido encontrado para este tipo.</p>' : items.map(order => {
        const amount = category === 'recebido'
            ? parseFloat(order.total) || 0
            : Math.max(0, (parseFloat(order.total) || 0) - (parseFloat(order.signalAmount) || 0));
        const dueDate = order.signalDate ? `Vencimento: ${order.signalDate}` : '';
        return `
            <div class="finance-detail-item">
                <strong>${order.code || 'Pedido'}</strong>
                <span><strong>Cliente:</strong> ${order.clientName || '—'}</span>
                <span><strong>Produto:</strong> ${order.productName || '—'}</span>
                <span><strong>Valor:</strong> ${formatMoney(amount)}</span>
                <span>${dueDate}</span>
            </div>`;
    }).join('');
}

function renderFinance() {
    const totals = getFinanceTotals();
    if (financeReceivedValue) financeReceivedValue.textContent = formatFinanceValue(totals.receivedTotal);
    if (financeReceivableValue) financeReceivableValue.textContent = formatFinanceValue(totals.receivableTotal);
    if (financeOverdueValue) financeOverdueValue.textContent = formatFinanceValue(totals.overdueTotal);
    if (financeInvestmentValue) financeInvestmentValue.textContent = formatFinanceValue(getInvestmentTotal());
    if (financeTotalValue) financeTotalValue.textContent = formatFinanceValue(totals.totalRevenue);
    if (financeCashValue) financeCashValue.textContent = formatFinanceValue(getCashBalance());
    const category = activeFinanceCategory || 'recebido';
    setFinanceActiveCategory(category);
    renderFinanceDetails(category);
    drawFinanceChart();
}

const agendaKey = 'gestorAgenda';
let agendaCurrentMonth = new Date().getMonth();
let agendaCurrentYear = new Date().getFullYear();
let selectedAgendaDate = new Date();

function getAgendaData() {
    try {
        return JSON.parse(localStorage.getItem(agendaKey) || '[]');
    } catch {
        return [];
    }
}

function setAgendaData(data) {
    localStorage.setItem(agendaKey, JSON.stringify(data));
}

function getAgendaKey(date) {
    return date.toISOString().slice(0, 10);
}

function formatAgendaDate(date) {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getEventsForDate(date) {
    const key = getAgendaKey(date);
    return getAgendaData().filter(event => event.date === key);
}

function addAgendaEvent(date, note) {
    const events = getAgendaData();
    events.push({ date: getAgendaKey(date), note, created: new Date().toISOString() });
    setAgendaData(events);
}

function deleteAgendaEvent(date, eventIndex) {
    const key = getAgendaKey(date);
    let removeIndex = -1;
    const events = getAgendaData().filter(event => {
        if (event.date !== key) return true;
        removeIndex += 1;
        return removeIndex !== eventIndex;
    });
    setAgendaData(events);
}

function getPaymentDueEvents() {
    return getOrdersData()
        .filter(order => order.signalDate && !order.paid)
        .map(order => ({
            date: order.signalDate,
            label: `${order.clientName} — ${formatMoney(order.signalAmount || 0)} (${order.code})`,
            code: order.code,
        }));
}

function renderCalendar() {
    if (!calendarGrid || !calendarTitle) return;
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const firstDay = new Date(agendaCurrentYear, agendaCurrentMonth, 1);
    const daysInMonth = new Date(agendaCurrentYear, agendaCurrentMonth + 1, 0).getDate();
    const startWeekday = firstDay.getDay();
    const todayKey = getAgendaKey(new Date());
    const selectedKey = getAgendaKey(selectedAgendaDate);
    const eventKeys = new Set(getAgendaData().map(event => event.date));
    const paymentKeys = new Set(getPaymentDueEvents().map(event => event.date));

    calendarTitle.textContent = `${monthNames[agendaCurrentMonth]} ${agendaCurrentYear}`;
    calendarGrid.innerHTML = '';

    for (let i = 0; i < startWeekday; i += 1) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        empty.style.visibility = 'hidden';
        calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(agendaCurrentYear, agendaCurrentMonth, day);
        const key = getAgendaKey(date);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'calendar-day';
        cell.dataset.date = key;
        cell.innerHTML = `<span class="date-number">${day}</span>`;
        if (key === todayKey) cell.classList.add('today');
        if (key === selectedKey) cell.classList.add('selected');
        if (eventKeys.has(key)) cell.insertAdjacentHTML('beforeend', '<span class="date-marker event"></span>');
        if (paymentKeys.has(key)) cell.insertAdjacentHTML('beforeend', '<span class="date-marker payment"></span>');
        cell.addEventListener('click', () => selectAgendaDate(date));
        calendarGrid.appendChild(cell);
    }
}

function selectAgendaDate(date) {
    selectedAgendaDate = date;
    if (agendaSelectedDateInput) agendaSelectedDateInput.value = formatAgendaDate(date);
    if (agendaNotesTextarea) agendaNotesTextarea.value = '';
    renderEventList();
    renderCalendar();
}

function renderEventList() {
    if (!agendaEventsList || !agendaPaymentList) return;
    const events = getEventsForDate(selectedAgendaDate);
    const payments = getPaymentDueEvents().filter(payment => payment.date === getAgendaKey(selectedAgendaDate));

    agendaEventsList.innerHTML = events.length
        ? events.map((event, index) => `
            <div class="agenda-event-item">
                <div>${event.note}</div>
                <button type="button" data-index="${index}">Excluir</button>
            </div>`).join('')
        : '<p>Nenhum evento para esta data.</p>';

    agendaPaymentList.innerHTML = payments.length
        ? payments.map(payment => `
            <div class="agenda-payment-item">${payment.label}</div>`).join('')
        : '<p>Sem vencimentos para esta data.</p>';
}

function saveAgendaEvent() {
    if (!agendaNotesTextarea) return;
    const note = agendaNotesTextarea.value.trim();
    if (!note) {
        alert('Escreva uma anotação antes de salvar.');
        agendaNotesTextarea.focus();
        return;
    }
    addAgendaEvent(selectedAgendaDate, note);
    agendaNotesTextarea.value = '';
    renderEventList();
    renderCalendar();
}

function changeAgendaMonth(delta) {
    agendaCurrentMonth += delta;
    if (agendaCurrentMonth < 0) {
        agendaCurrentMonth = 11;
        agendaCurrentYear -= 1;
    }
    if (agendaCurrentMonth > 11) {
        agendaCurrentMonth = 0;
        agendaCurrentYear += 1;
    }
    renderCalendar();
}

function initializeAgenda() {
    if (!agendaSelectedDateInput) return;
    selectAgendaDate(selectedAgendaDate);
}

function clickAgendaEventList(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() !== 'button') return;
    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) return;
    deleteAgendaEvent(selectedAgendaDate, index);
    renderEventList();
    renderCalendar();
}

function populateClientOptions() {
    if (!orderClientSelect) return;
    const clients = getClientsData();
    const current = orderClientSelect.value;
    orderClientSelect.innerHTML = '<option value="">-- selecione cliente --</option><option value="_new">Novo cliente</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.name;
        option.textContent = client.name;
        orderClientSelect.appendChild(option);
    });
    if (current) orderClientSelect.value = current;
}

function populateProductOptions() {
    if (!orderProductSelect) return;
    const products = getInventoryData();
    const current = orderProductSelect.value;
    orderProductSelect.innerHTML = '<option value="">-- selecione produto --</option>';
    products.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${item.product}${item.size ? ` (${item.size})` : ''} - ${formatMoney(item.sellingPrice)}`;
        orderProductSelect.appendChild(option);
    });
    if (current) orderProductSelect.value = current;
}

function updateOrderTotal() {
    if (!orderTotalInput) return;
    const items = getInventoryData();
    const selectedIndex = parseInt(orderProductSelect?.value, 10);
    const product = !Number.isNaN(selectedIndex) ? items[selectedIndex] : null;
    const quantity = parseFloat(orderQuantityInput?.value) || 1;
    const base = product ? (product.sellingPrice || 0) * quantity : 0;
    const discount = parseFloat(orderDiscountInput?.value) || 0;
    const freight = parseFloat(orderFreightInput?.value) || 0;
    const fees = parseFloat(orderFeesInput?.value) || 0;
    const total = base - discount + freight + fees;
    orderTotalInput.value = formatMoney(total < 0 ? 0 : total);
}

function getOrderPaymentLabel(order) {
    if (!order) return '—';
    if (order.paymentCondition === 'sinal') {
        return `Sinal R$ ${formatMoney(order.signalAmount).replace('R$ ', '')}`;
    }
    if (order.paymentCondition === 'parcelas') {
        return `${order.installmentsQty || 0}x de R$ ${formatMoney(order.installmentValue).replace('R$ ', '')}`;
    }
    return 'À vista';
}

function toggleOrderPayment() {
    if (!orderPaymentInputs) return;
    let payment = 'avista';
    for (const r of orderPaymentInputs) {
        if (r.checked) { payment = r.value; break; }
    }
    if (orderSignalRow) orderSignalRow.classList.toggle('hidden-field', payment !== 'sinal');
    if (orderInstallmentsRow) orderInstallmentsRow.classList.toggle('hidden-field', payment !== 'parcelas');
}

function showOrderClientInput() {
    if (!orderClientSelect || !orderClientNameRow) return;
    const isNew = orderClientSelect.value === '_new';
    orderClientNameRow.classList.toggle('hidden-field', !isNew);
}

function closeOrderForm() {
    if (!orderFormEl) return;
    orderFormEl.classList.add('hidden-field');
    resetOrderForm();
    if (newOrderBtn) newOrderBtn.textContent = 'Novo pedido';
}

function setOrderFormButtonState(isEditing) {
    if (!saveOrderBtn) return;
    saveOrderBtn.textContent = isEditing ? 'Atualizar pedido' : 'Salvar pedido';
}

function showOrderForm() {
    if (!orderFormEl) return;
    populateClientOptions();
    populateProductOptions();
    resetOrderForm();
    orderFormEl.classList.remove('hidden-field');
    if (newOrderBtn) newOrderBtn.textContent = 'Novo pedido';
}

function resetOrderForm() {
    if (orderCodeInput) orderCodeInput.value = generateOrderCode();
    if (orderDateInput) orderDateInput.value = new Date().toLocaleDateString('pt-BR');
    if (orderClientSelect) orderClientSelect.value = '';
    if (orderClientNameNew) orderClientNameNew.value = '';
    if (orderClientNameRow) orderClientNameRow.classList.add('hidden-field');
    if (orderProductSelect) orderProductSelect.value = '';
    if (orderQuantityInput) orderQuantityInput.value = 1;
    if (orderDiscountInput) orderDiscountInput.value = '';
    if (orderFreightInput) orderFreightInput.value = '';
    if (orderFeesInput) orderFeesInput.value = '';
    if (orderNotesInput) orderNotesInput.value = '';
    if (orderPaidInput) orderPaidInput.checked = false;
    if (orderSignalAmountInput) orderSignalAmountInput.value = '';
    if (orderSignalDateInput) orderSignalDateInput.value = '';
    if (orderInstallmentsQtyInput) orderInstallmentsQtyInput.value = 1;
    if (orderInstallmentValueInput) orderInstallmentValueInput.value = '';
    updateOrderTotal();
    if (orderPaymentInputs) for (const r of orderPaymentInputs) {
        if (r.value === 'avista') r.checked = true;
    }
    if (orderFormTitle) orderFormTitle.textContent = 'Novo Pedido';
    editingOrderCode = null;
    toggleOrderPayment();
}

function saveOrder() {
    if (!orderCodeInput) return;
    const code = orderCodeInput.value || generateOrderCode();
    const date = (orderDateInput?.value && orderDateInput.value.trim()) || new Date().toLocaleDateString('pt-BR');
    const selectedClient = orderClientSelect?.value || '';
    const clientName = selectedClient === '_new' ? (orderClientNameNew?.value.trim() || 'Cliente não informado') : selectedClient || 'Cliente não informado';
    const productIndex = parseInt(orderProductSelect?.value, 10);
    const products = getInventoryData();
    const product = !Number.isNaN(productIndex) ? products[productIndex] : null;
    const productName = product ? product.product : 'Produto não informado';
    const quantity = parseInt(orderQuantityInput?.value, 10) || 1;
    const discount = parseFloat(orderDiscountInput?.value) || 0;
    const freight = parseFloat(orderFreightInput?.value) || 0;
    const fees = parseFloat(orderFeesInput?.value) || 0;
    const total = parseFloat(orderTotalInput?.value.replace('R$','').replace('.','').replace(',','.')) || 0;
    let paymentCondition = 'avista';
    if (orderPaymentInputs) for (const r of orderPaymentInputs) if (r.checked) { paymentCondition = r.value; break; }
    const signalAmount = orderSignalAmountInput?.value ? parseFloat(orderSignalAmountInput.value) : 0;
    const signalDate = orderSignalDateInput?.value || '';
    const installmentsQty = parseInt(orderInstallmentsQtyInput?.value, 10) || 0;
    const installmentValue = parseFloat(orderInstallmentValueInput?.value) || 0;
    const notes = orderNotesInput?.value.trim() || '';
    const paid = orderPaidInput?.checked || false;

    const orders = getOrdersData();
    if (editingOrderCode) {
        const index = orders.findIndex(o => o.code === editingOrderCode);
        if (index >= 0) {
            orders[index] = { code, date, clientName, productName, quantity, discount, freight, fees, total, paymentCondition, signalAmount, signalDate, installmentsQty, installmentValue, notes, paid, created: orders[index].created };
        } else {
            orders.push({ code, date, clientName, productName, quantity, discount, freight, fees, total, paymentCondition, signalAmount, signalDate, installmentsQty, installmentValue, notes, paid, created: new Date().toISOString() });
        }
    } else {
        orders.push({ code, date, clientName, productName, quantity, discount, freight, fees, total, paymentCondition, signalAmount, signalDate, installmentsQty, installmentValue, notes, paid, created: new Date().toISOString() });
    }
    setOrdersData(orders);
    renderOrders(ordersSearch ? ordersSearch.value : '');
    resetOrderForm();
    if (orderFormEl) orderFormEl.classList.add('hidden-field');
    alert(editingOrderCode ? 'Pedido atualizado.' : 'Pedido salvo.');
}

function renderOrders(filter = '') {
    if (!orderList || !orderCount) return;
    const q = (filter || '').trim().toLowerCase();
    const orders = getOrdersData();
    orderList.innerHTML = '';
    const filtered = orders.filter(o => {
        return o.code.toLowerCase().includes(q)
            || o.clientName.toLowerCase().includes(q)
            || o.productName.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
        orderList.innerHTML = `
            <tr class="inventory-empty">
                <td colspan="12">Nenhum pedido cadastrado.</td>
            </tr>`;
    } else {
        filtered.forEach(o => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Código">${o.code || '—'}</td>
                <td data-label="Data">${o.date || '—'}</td>
                <td data-label="Cliente">${o.clientName}</td>
                <td data-label="Produto">${o.productName}</td>
                <td data-label="Qtd">${o.quantity}</td>
                <td data-label="Total">${formatMoney(o.total)}</td>
                <td data-label="Desconto">${formatMoney(o.discount || 0)}</td>
                <td data-label="Frete">${formatMoney(o.freight || 0)}</td>
                <td data-label="Taxas">${formatMoney(o.fees || 0)}</td>
                <td data-label="Pagamento">${getOrderPaymentLabel(o)}</td>
                <td data-label="Pago">${o.paid ? 'Sim' : 'Não'}</td>
                <td data-label="Ações">
                    <button type="button" class="table-action-btn edit-order" data-code="${o.code}">Editar</button>
                    <button type="button" class="table-action-btn delete-order" data-code="${o.code}">Excluir</button>
                </td>
            `;
            orderList.appendChild(row);
        });
    }

    orderCount.textContent = filtered.length;
}

function editOrder(code) {
    const orders = getOrdersData();
    const order = orders.find(o => o.code === code);
    if (!order) return;
    if (!orderFormEl) return;
    populateClientOptions();
    populateProductOptions();
    resetOrderForm();
    editingOrderCode = code;
    if (orderFormTitle) orderFormTitle.textContent = `Editar Pedido ${code}`;
    if (orderCodeInput) orderCodeInput.value = order.code;
    if (orderDateInput) orderDateInput.value = order.date;
    if (orderClientSelect) {
        const option = Array.from(orderClientSelect.options).find(opt => opt.value === order.clientName);
        if (option) {
            orderClientSelect.value = order.clientName;
            if (orderClientNameRow) orderClientNameRow.classList.add('hidden-field');
        } else {
            orderClientSelect.value = '_new';
            if (orderClientNameRow) orderClientNameRow.classList.remove('hidden-field');
            if (orderClientNameNew) orderClientNameNew.value = order.clientName;
        }
    }
    if (orderProductSelect) {
        const products = getInventoryData();
        const productIndex = products.findIndex(item => item.product === order.productName);
        orderProductSelect.value = productIndex >= 0 ? String(productIndex) : '';
    }
    if (orderQuantityInput) orderQuantityInput.value = order.quantity || 1;
    if (orderDiscountInput) orderDiscountInput.value = order.discount || '';
    if (orderFreightInput) orderFreightInput.value = order.freight || '';
    if (orderFeesInput) orderFeesInput.value = order.fees || '';
    if (orderTotalInput) orderTotalInput.value = formatMoney(order.total);
    if (orderNotesInput) orderNotesInput.value = order.notes || '';
    if (orderPaymentInputs) {
        for (const r of orderPaymentInputs) {
            r.checked = r.value === order.paymentCondition;
        }
    }
    if (orderSignalAmountInput) orderSignalAmountInput.value = order.signalAmount || '';
    if (orderSignalDateInput) orderSignalDateInput.value = order.signalDate || '';
    if (orderInstallmentsQtyInput) orderInstallmentsQtyInput.value = order.installmentsQty || 1;
    if (orderInstallmentValueInput) orderInstallmentValueInput.value = order.installmentValue || '';
    if (orderPaidInput) orderPaidInput.checked = !!order.paid;
    toggleOrderPayment();
    updateOrderTotal();
    orderFormEl.classList.remove('hidden-field');
    setOrderFormButtonState(true);
}

function deleteOrder(code) {
    if (!confirm('Deseja realmente excluir este pedido?')) return;
    const orders = getOrdersData();
    const filtered = orders.filter(o => o.code !== code);
    setOrdersData(filtered);
    renderOrders(ordersSearch ? ordersSearch.value : '');
}

if (orderList) {
    orderList.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.classList.contains('edit-order')) {
            const code = target.dataset.code;
            if (code) editOrder(code);
        }
        if (target.classList.contains('delete-order')) {
            const code = target.dataset.code;
            if (code) deleteOrder(code);
        }
    });
}

if (newOrderBtn) newOrderBtn.addEventListener('click', showOrderForm);
if (cancelOrderBtn) cancelOrderBtn.addEventListener('click', closeOrderForm);
if (saveOrderBtn) saveOrderBtn.addEventListener('click', saveOrder);
if (orderProductSelect) orderProductSelect.addEventListener('change', updateOrderTotal);
if (orderQuantityInput) orderQuantityInput.addEventListener('input', updateOrderTotal);
if (orderDiscountInput) orderDiscountInput.addEventListener('input', updateOrderTotal);
if (orderFreightInput) orderFreightInput.addEventListener('input', updateOrderTotal);
if (orderFeesInput) orderFeesInput.addEventListener('input', updateOrderTotal);
if (orderClientSelect) orderClientSelect.addEventListener('change', showOrderClientInput);
if (orderPaymentInputs) for (const r of orderPaymentInputs) r.addEventListener('change', toggleOrderPayment);
if (saveAgendaEventBtn) saveAgendaEventBtn.addEventListener('click', saveAgendaEvent);
if (calendarPrevBtn) calendarPrevBtn.addEventListener('click', () => changeAgendaMonth(-1));
if (calendarNextBtn) calendarNextBtn.addEventListener('click', () => changeAgendaMonth(1));
if (agendaEventsList) agendaEventsList.addEventListener('click', clickAgendaEventList);
if (ordersSearch) ordersSearch.addEventListener('input', () => renderOrders(ordersSearch.value));

if (newClientBtn) newClientBtn.addEventListener('click', () => { if (clientFormEl) clientFormEl.classList.toggle('hidden-field'); });
if (cancelClientBtn) cancelClientBtn.addEventListener('click', () => { if (clientFormEl) clientFormEl.classList.add('hidden-field'); resetClientForm(); });
if (saveClientBtn) saveClientBtn.addEventListener('click', addClient);
if (clientTypeInputs) for (const r of clientTypeInputs) r.addEventListener('change', toggleClientType);
if (clientsSearch) clientsSearch.addEventListener('input', () => renderClients(clientsSearch.value));

if (calendarGrid) initializeAgenda();
if (orderFormEl) {
    orderFormEl.classList.add('hidden-field');
}
if (newOrderBtn) {
    newOrderBtn.textContent = 'Novo pedido';
}
if (financePeriodSelect) {
    financePeriodSelect.addEventListener('change', () => {
        toggleFinanceMonthPicker();
        renderFinance();
    });
}
if (financeMonthPicker) {
    financeMonthPicker.addEventListener('change', renderFinance);
}
if (financeReceivedBtn) {
    financeReceivedBtn.addEventListener('click', () => {
        setFinanceActiveCategory('recebido');
        renderFinance();
    });
}
if (financeReceivableBtn) {
    financeReceivableBtn.addEventListener('click', () => {
        setFinanceActiveCategory('receber');
        renderFinance();
    });
}
if (financeOverdueBtn) {
    financeOverdueBtn.addEventListener('click', () => {
        setFinanceActiveCategory('atraso');
        renderFinance();
    });
}
if (financePeriodSelect) {
    toggleFinanceMonthPicker();
}

// initial renders
renderInventory(inventorySearch ? inventorySearch.value : '');
renderClients(clientsSearch ? clientsSearch.value : '');
renderOrders(ordersSearch ? ordersSearch.value : '');
renderFinance();
