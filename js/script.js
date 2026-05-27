const inventoryKey = 'gestorInventory';
const productImagesKey = 'gestorProductImages';
const inventorySearch = document.getElementById('inventory-search');
const inventoryItems = document.getElementById('inventory-items');
const inventoryCount = document.getElementById('inventory-count');
const inventoryWarning = document.getElementById('inventory-warning');
const addStockBtn = document.querySelector('.add-stock');
const orderNameInput = document.querySelector('.order-name');
const detailsInput = document.querySelector('.product-details');
const purchaseLocationInput = document.querySelector('.purchase-location');
const existingPurchaseLocationInput = document.querySelector('.existing-purchase-location');
const sizeInput = document.querySelector('.product-size');
const unitPriceInput = document.querySelector('.unit-price');
const quantityInput = document.querySelector('.quantity');
const totalValueInput = document.querySelector('.total-value');
const costPriceInput = document.querySelector('.cost-price');
const profitMarginInput = document.querySelector('.profit-margin');
const sellingPriceInput = document.querySelector('.selling-price');
const existingCostPriceInput = document.querySelector('.existing-cost-price');
const existingProfitMarginInput = document.querySelector('.existing-profit-margin');
const existingSellingPriceInput = document.querySelector('.existing-selling-price');
const productImageInput = document.querySelector('.product-image-input');
const productPreview = document.getElementById('product-preview');
let currentProductImageData = null;
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
const investmentKey = 'gestorInvestment';
const ordersSearch = document.getElementById('orders-search');
const orderList = document.getElementById('order-list');
const orderCount = document.getElementById('order-count');
const orderUnpaidInfo = document.getElementById('order-unpaid-info');
const newOrderBtn = document.querySelector('.new-order-btn');
const orderFormEl = document.getElementById('order-form');
const orderCodeInput = document.querySelector('.order-code');
const orderDateInput = document.querySelector('.order-date');
const orderClientSelect = document.querySelector('.order-client-select');
const orderClientNameNew = document.querySelector('.order-client-name-new');
const orderClientNameRow = document.querySelector('.client-name-new-row');
const orderProductSelect = document.querySelector('.order-product');
const orderBatchSelect = document.querySelector('.order-batch');
const orderBatchField = document.querySelector('.order-batch-field');
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

import { supabase } from './supabase-config.js';
import {
    initializeShopData,
    getInventoryFromDB,
    getAllProductImagesFromDB,
    getClientsFromDB,
    getOrdersFromDB,
    getScheduleEventsFromDB,
    getInvestmentsFromDB,
    replaceInventoryForShop,
    replaceProductImagesForShop,
    replaceClientsForShop,
    replaceOrdersForShop,
    replaceScheduleEventsForShop,
    saveInvestmentToDB
} from './supabase-sync.js';
import { updateShopNameInPage } from './display-shop-name.js';

// atomic operations
import {
    addInventoryLotToDB,
    deleteInventoryLotFromDB,
    saveProductImageToDB,
    deleteProductImageFromDB,
    saveClientToDB,
    saveOrderToDB,
    saveScheduleEventToDB,
    updateInventoryLotInDB,
    updateOrderInDB,
    deleteOrderFromDB,
    updateClientInDB,
    deleteClientFromDB,
    updateScheduleEventInDB,
    deleteScheduleEventFromDB
} from './supabase-sync.js';

const currentPage = window.location.pathname.split('/').pop();
let currentUserEmail = '';

const authKey = 'gestorLoggedIn';
const currentUserKey = 'gestorCurrentUser';
const currentShopKey = 'gestorCurrentShop';

function getCurrentUser() {
    return currentUserEmail || localStorage.getItem(currentUserKey) || '';
}

// Image input handling (pré-visualização e leitura como base64)
if (productImageInput) {
    productImageInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            currentProductImageData = null;
            if (productPreview) {
                productPreview.src = '';
                productPreview.style.display = 'none';
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            currentProductImageData = reader.result;
            if (productPreview) {
                productPreview.src = currentProductImageData;
                productPreview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    });
}

function getUserKeySuffix() {
    const user = getCurrentUser().trim();
    return user ? encodeURIComponent(user.toLowerCase()) : '';
}

function getUserStorageKey(baseKey) {
    const suffix = getUserKeySuffix();
    if (!suffix) return baseKey;
    const userKey = `${baseKey}:${suffix}`;
    if (localStorage.getItem(userKey) === null && localStorage.getItem(baseKey) !== null) {
        localStorage.setItem(userKey, localStorage.getItem(baseKey));
        localStorage.removeItem(baseKey);
    }
    return userKey;
}

const loginPage = 'login.html';


function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(button => {
        button.addEventListener('click', async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Erro no signOut:', error);
                    alert('Erro ao sair. Tente novamente.');
                    return;
                }
                // double-check session cleared
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    console.warn('Session ainda presente após signOut:', session);
                }
            } catch (e) {
                console.error('Erro no signOut:', e);
                alert('Erro ao sair. Tente novamente.');
            }
            window.location.replace(loginPage);
        });
    });
}

async function displayLoggedUser() {
    const loggedUserElements = document.querySelectorAll('#logged-user-name');
    const shopNameElements = document.querySelectorAll('#shop-name');

    try {
        const shop = await initializeShopData();
        const userResp = await supabase.auth.getUser();
        const user = userResp?.data?.user;

        const userName = user?.email || '';
        const shopName = shop?.shop_name || '';
        currentUserEmail = userName;

        loggedUserElements.forEach(el => { if (userName) el.textContent = userName; });
        shopNameElements.forEach(el => { if (shopName) el.textContent = shopName; });
        // atualizar badge fixo do nome da loja
        if (shopName) updateShopNameInPage(shopName);
    } catch (err) {
        console.error('Erro ao carregar usuário/loja para cabeçalho:', err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    setupLogoutButtons();
    await displayLoggedUser();
    await loadAllData();
    migrateLotImagesToProductImages();
    initializeInvestment();
    if (currentPage === 'cadastrar.html') {
        initializeProductMode();
    }
    // Inicializa listener para abrir modal de imagem no estoque
    if (currentPage === 'estoque.html') {
        initializeImageModalHandlers();
    }
    // Garantir listeners do formulário de cadastro (compatibilidade desktop e mobile)
    if (addStockBtn) {
        const onAdd = (ev) => {
            try { ev.preventDefault(); } catch (e) {}
            addStock();
        };
        addStockBtn.addEventListener('click', onAdd);
        addStockBtn.addEventListener('touchend', onAdd, { passive: true });
    }
    [unitPriceInput, quantityInput, costPriceInput, profitMarginInput].forEach(input => {
        if (input) input.addEventListener('input', updateValues);
    });
    [existingCostPriceInput, existingProfitMarginInput].forEach(input => {
        if (input) input.addEventListener('input', updateExistingValues);
    });
});

function getInventoryData() {
    return inventoryCache.slice();
}

function setInventoryData(data) {
    inventoryCache = Array.isArray(data) ? data.slice() : [];
    (async () => {
        try {
            await replaceInventoryForShop(inventoryCache);
        } catch (err) {
            console.error('Erro ao persistir estoque no Supabase:', err);
        }
    })();
}

function getProductImagesData() {
    return { ...productImagesCache };
}

function setProductImagesData(data) {
    productImagesCache = Object.assign({}, data || {});
    (async () => {
        try {
            await replaceProductImagesForShop(productImagesCache);
        } catch (err) {
            console.error('Erro ao persistir imagens no Supabase:', err);
        }
    })();
}

function getProductImageKey(product, size) {
    return `${(product || '').trim().toLowerCase()}||${(size || '').trim().toLowerCase()}`;
}

function saveProductImage(product, size, imageData) {
    if (!imageData) return;
    const key = getProductImageKey(product, size);
    productImagesCache[key] = imageData;
    (async () => {
        try {
            await saveProductImageToDB({ product_name: product, size, image_data: imageData });
        } catch (err) {
            console.error('Erro ao salvar imagem no Supabase:', err);
        }
    })();
}

function getProductImage(product, size) {
    const key = getProductImageKey(product, size);
    return productImagesCache[key] || null;
}

function migrateLotImagesToProductImages() {
    const inventoryData = getInventoryData();
    const images = getProductImagesData();
    let updated = false;

    inventoryData.forEach(item => {
        const imageData = item.image;
        if (!imageData) return;
        const key = getProductImageKey(item.product, item.size);
        if (!images[key]) {
            images[key] = imageData;
            updated = true;
        }
    });

    if (updated) {
        setProductImagesData(images);
        // optional: keep lot image if desired, but we no longer rely on it
    }
}

function getInvestmentData() {
    return Number.isFinite(investmentsCache) ? investmentsCache : 0;
}

function setInvestmentData(value) {
    investmentsCache = Number(value || 0);
    (async () => {
        try {
            await saveInvestmentToDB({ amount: investmentsCache, date: new Date().toISOString() });
        } catch (err) {
            console.error('Erro ao salvar investimento no Supabase:', err);
        }
    })();
}

function addInvestment(amount) {
    const current = getInvestmentData();
    setInvestmentData(current + (parseFloat(amount) || 0));
}

function initializeInvestment() {
    if (Number.isFinite(investmentsCache) && investmentsCache > 0) return;
    const inventoryData = getInventoryData();
    const initialInvestment = inventoryData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    setInvestmentData(initialInvestment);
}

function checkInventoryWarning() {
    if (!inventoryWarning) return;

    const inventoryData = getInventoryData();
    const groupedItems = getGroupedInventoryData(inventoryData);
    const lowStockGroups = groupedItems.filter(group => parseInt(group.quantity, 10) === 1);

    if (lowStockGroups.length > 0) {
        inventoryWarning.textContent = `Atenção: há ${lowStockGroups.length} peça${lowStockGroups.length === 1 ? '' : 's'} com apenas 1 unidade no estoque.`;
        inventoryWarning.classList.add('show');
    } else {
        inventoryWarning.classList.remove('show');
    }
}

function formatMoney(value) {
    return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateExistingValues() {
    if (!existingCostPriceInput || !existingProfitMarginInput || !existingSellingPriceInput) return;
    const cost = parseFloat(existingCostPriceInput.value) || 0;
    const margin = parseFloat(existingProfitMarginInput.value) || 0;
    existingSellingPriceInput.value = formatMoney(cost * (1 + margin / 100));
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
    if (purchaseLocationInput) purchaseLocationInput.value = '';
    if (existingPurchaseLocationInput) existingPurchaseLocationInput.value = '';
    sizeInput.value = '';
    unitPriceInput.value = '';
    quantityInput.value = 1;
    costPriceInput.value = '';
    profitMarginInput.value = '';
    totalValueInput.value = formatMoney(0);
    sellingPriceInput.value = formatMoney(0);
    if (existingCostPriceInput) existingCostPriceInput.value = '';
    if (existingProfitMarginInput) existingProfitMarginInput.value = '';
    if (existingSellingPriceInput) existingSellingPriceInput.value = formatMoney(0);
    if (productImageInput) productImageInput.value = '';
    currentProductImageData = null;
    if (productPreview) {
        productPreview.src = '';
        productPreview.style.display = 'none';
    }
    orderNameInput.focus();
}

function getGroupedInventoryData(inventoryData, query = '') {
    const groups = {};
    const normalizedQuery = query.trim().toLowerCase();

    inventoryData.forEach((item, index) => {
        const itemQty = parseInt(item.quantity, 10) || 0;
        if (itemQty <= 0) return; // ignore empty batches
        const productKey = `${(item.product || '').trim().toLowerCase()}||${(item.size || '').trim().toLowerCase()}`;
        if (!groups[productKey]) {
            groups[productKey] = {
                product: item.product,
                details: item.details,
                purchaseLocation: item.purchaseLocation || '',
                size: item.size,
                quantity: 0,
                total: 0,
                batches: []
            };
        }
        groups[productKey].quantity += itemQty;
        groups[productKey].total += parseFloat(item.total) || 0;
        groups[productKey].batches.push({ ...item, batchIndex: index });
    });

    return Object.values(groups).filter(group => {
        return group.product.toLowerCase().includes(normalizedQuery)
            || (group.details || '').toLowerCase().includes(normalizedQuery)
            || (group.size || '').toLowerCase().includes(normalizedQuery);
    });
}

function renderInventory(filter = '') {
    if (!inventoryItems || !inventoryCount) return;

    const query = filter.trim().toLowerCase();
    const inventoryData = getInventoryData();
    inventoryItems.innerHTML = '';

    const groupedItems = getGroupedInventoryData(inventoryData, query);

    if (groupedItems.length === 0) {
        inventoryItems.innerHTML = `
            <tr class="inventory-empty">
                <td colspan="7">Nenhuma peça encontrada no estoque.</td>
            </tr>`;
    } else {
        groupedItems.forEach(group => {
            const row = document.createElement('tr');
            const lowStock = parseInt(group.quantity, 10) === 1;
            if (lowStock) {
                row.classList.add('low-stock');
            }
            const thumbSrc = getProductImage(group.product, group.size) || '';
            row.innerHTML = `
                <td data-label="Foto"><img src="${thumbSrc}" class="inventory-thumb" alt="Foto"/></td>
                <td data-label="Produto">${group.product}</td>
                <td data-label="Detalhes">${group.details || '—'}</td>
                <td data-label="Tamanho">${group.size || '—'}</td>
                <td data-label="Qtd">${group.quantity}</td>
                <td data-label="Total">${formatMoney(group.total)}</td>
            `;
            const priceCell = document.createElement('td');
            priceCell.setAttribute('data-label', 'Preço de venda');
            if (group.batches.length > 1) {
                const viewLotsButton = document.createElement('button');
                viewLotsButton.type = 'button';
                viewLotsButton.className = 'table-action-btn';
                viewLotsButton.textContent = 'Ver lotes';
                viewLotsButton.addEventListener('click', () => showBatchSellingPrices(group.product, group.size, { allowDelete: true }));
                priceCell.appendChild(viewLotsButton);
            } else if (group.batches.length === 1) {
                const sellingPrice = parseFloat(group.batches[0].sellingPrice) || 0;
                priceCell.textContent = formatMoney(sellingPrice);
            } else {
                priceCell.textContent = '—';
            }
            row.appendChild(priceCell);

            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'table-action-btn delete-btn';
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteGroupedInventoryItem(group.product, group.size));
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            inventoryItems.appendChild(row);
        });
    }

    inventoryCount.textContent = groupedItems.length;
    checkInventoryWarning();
}

function initializeImageModalHandlers() {
    if (!inventoryItems) return;
    inventoryItems.addEventListener('click', (e) => {
        const img = e.target.closest && e.target.closest('.inventory-thumb');
        if (!img) return;
        const src = img.getAttribute('src');
        if (!src) return;
        showImageModal(src, img.alt || 'Foto do produto');
    });
}

function showImageModal(src, alt) {
    // evitar múltiplos modais
    if (document.querySelector('.image-modal-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'image-modal-overlay';
    overlay.tabIndex = -1;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Fechar imagem');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => close());

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    function close() {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
    }

    function onKey(ev) {
        if (ev.key === 'Escape') close();
    }

    overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);
}

function hideBatchPanel() {
    // Sem painel de lote ativo.
}

function showBatchSellingPrices(product, size, options = {}) {
    // Redireciona para o modal de lotes (com possibilidade de exclusão via options.allowDelete)
    showBatchListPage(product, size, options);
}

function showBatchListPage(product, size, options = {}) {
    const inventoryData = getInventoryData();
    const batches = inventoryData
        .map((item, index) => ({ ...item, batchIndex: index }))
        .filter(item => item.product === product && item.size === size && (parseInt(item.quantity, 10) || 0) > 0);

    if (batches.length === 0) {
        alert('Nenhum lote encontrado para este produto.');
        return;
    }

    // Evitar múltiplos modais
    if (document.querySelector('.batches-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'batches-modal-overlay';

    const container = document.createElement('div');
    container.className = 'batches-modal-container';

    const header = document.createElement('div');
    header.className = 'batches-modal-header';
    header.innerHTML = `<strong>Lotes de ${product}${size ? ` (${size})` : ''}</strong>`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Fechar lista de lotes');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => overlay.remove());

    const list = document.createElement('div');
    list.className = 'batches-list';

    function renderList() {
        list.innerHTML = '';
        const fresh = getInventoryData()
            .map((item, index) => ({ ...item, batchIndex: index }))
            .filter(item => item.product === product && item.size === size && (parseInt(item.quantity, 10) || 0) > 0);

        if (fresh.length === 0) {
            list.innerHTML = '<p>Nenhum lote disponível.</p>';
            return;
        }

        fresh.forEach((batch, idx) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'batch-item';
            itemEl.innerHTML = `
                <div class="batch-info">
                    <div><strong>Lote ${idx + 1}</strong></div>
                    <div>Qtd: ${batch.quantity}</div>
                    <div>Total: ${formatMoney(batch.total)}</div>
                    <div>Custo/unid: ${batch.costPrice ? formatMoney(batch.costPrice) : '—'}</div>
                    <div>Compra: ${batch.purchaseLocation || '—'}</div>
                </div>
            `;

            if (options.allowDelete) {
                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'table-action-btn delete-btn';
                delBtn.textContent = 'Excluir lote';
                delBtn.addEventListener('click', () => {
                    const confirmed = confirm(`Deseja excluir o Lote ${idx + 1} (Qtd ${batch.quantity})?`);
                    if (!confirmed) return;
                    (async () => {
                        try {
                            const inv = getInventoryData();
                            const realIndex = batch.batchIndex;
                            if (realIndex == null) return;
                            const item = inv[realIndex];
                            if (item && item.id) {
                                const ok = await deleteInventoryLotFromDB(item.id);
                                if (!ok) throw new Error('Erro ao deletar lote no Supabase');
                                // remover do cache
                                inventoryCache.splice(realIndex, 1);
                            } else {
                                // fallback local
                                inv.splice(realIndex, 1);
                                inventoryCache = inv.slice();
                                await replaceInventoryForShop(inventoryCache);
                            }
                            renderInventory(inventorySearch ? inventorySearch.value : '');
                            renderFinance();
                            renderList();
                        } catch (err) {
                            console.error('Erro ao excluir lote:', err);
                            alert('Erro ao excluir lote. Veja o console.');
                        }
                    })();
                });
                itemEl.appendChild(delBtn);
            }

            list.appendChild(itemEl);
        });
    }

    container.appendChild(header);
    container.appendChild(closeBtn);
    container.appendChild(list);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    renderList();

    // fechar ao clicar fora
    overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) overlay.remove();
    });
}

function deleteGroupedInventoryItem(product, size) {
    const inventoryData = getInventoryData();
    const batches = inventoryData
        .map((item, index) => ({ ...item, batchIndex: index }))
        .filter(item => item.product === product && item.size === size);

    if (batches.length === 0) return;

    const productLabel = `${product}${size ? ` (${size})` : ''}`;

    if (batches.length === 1) {
        const confirmed = confirm(`Deseja excluir o produto ${productLabel} do estoque?`);
        if (!confirmed) return;
        inventoryData.splice(batches[0].batchIndex, 1);
        setInventoryData(inventoryData);
        hideBatchPanel();
        renderInventory(inventorySearch ? inventorySearch.value : '');
        populateProductOptions();
        renderFinance();
        alert('✅ Produto removido do estoque.');
        return;
    }

    // Quando houver múltiplos lotes, abrir o painel com botões de lixeira
    showBatchSellingPrices(product, size, { allowDelete: true });
    return;
}

function deleteInventoryItem(index) {
    const inventoryData = getInventoryData();
    if (index < 0 || index >= inventoryData.length) return;

    const item = inventoryData[index];
    const itemLabel = `${item.product}${item.size ? ' - ' + item.size : ''}`;
    const confirmed = confirm(`Tem certeza que deseja excluir ${itemLabel} do estoque?`);
    if (!confirmed) return;

    (async () => {
        try {
            if (item && item.id) {
                const ok = await deleteInventoryLotFromDB(item.id);
                if (!ok) throw new Error('Erro ao deletar lote no Supabase');
                inventoryCache.splice(index, 1);
            } else {
                inventoryData.splice(index, 1);
                inventoryCache = inventoryData.slice();
                await replaceInventoryForShop(inventoryCache);
            }
            renderInventory(inventorySearch ? inventorySearch.value : '');
            populateProductOptions();
            renderFinance();
            alert('✅ Produto excluído do estoque.');
        } catch (err) {
            console.error('Erro ao excluir item:', err);
            alert('Erro ao excluir item. Veja o console.');
        }
    })();
}

// Product Mode Management
let currentProductMode = null; // 'new' or 'existing', null until user selects
let selectedExistingProductIndex = null;

// In-memory caches to keep existing synchronous flows working
let inventoryCache = [];
let productImagesCache = {};
let clientsCache = [];
let ordersCache = [];
let agendaCache = [];
let investmentsCache = 0;

async function loadAllData() {
    try {
        await initializeShopData();

        const [inv, images, clients, orders, schedule, investments] = await Promise.all([
            getInventoryFromDB(),
            getAllProductImagesFromDB(),
            getClientsFromDB(),
            getOrdersFromDB(),
            getScheduleEventsFromDB(),
            getInvestmentsFromDB()
        ]);

        inventoryCache = (inv || []).map(item => ({
            id: item.id,
            product: item.product_name,
            details: item.details,
            purchaseLocation: item.purchase_location,
            size: item.size,
            unitPrice: item.unit_price,
            quantity: item.quantity,
            total: item.total_value,
            costPrice: item.cost_price,
            profitMargin: item.profit_margin,
            sellingPrice: item.selling_price
        }));

        productImagesCache = {};
        (images || []).forEach(img => {
            const key = `${(img.product_name||'').trim().toLowerCase()}||${(img.size||'').trim().toLowerCase()}`;
            productImagesCache[key] = img.image_data;
        });

        clientsCache = clients || [];
        ordersCache = orders || [];
        agendaCache = schedule || [];
        investmentsCache = (investments || []).reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);

        // Re-render dependent views
        renderInventory(inventorySearch ? inventorySearch.value : '');
        populateProductOptions();
        renderClients();
        renderOrders();
        renderAgenda();
        renderFinance();
    } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
    }
}

function initializeProductMode() {
    currentProductMode = null;
    selectedExistingProductIndex = null;
    
    const newForm = document.getElementById('new-product-form');
    const existingForm = document.getElementById('existing-product-form');
    const newBtn = document.querySelector('.new-product-mode-btn');
    const existingBtn = document.querySelector('.existing-product-mode-btn');
    const modeSelector = document.querySelector('.product-mode-selector');
    const selectedInfo = document.getElementById('selected-product-info');
    const existingSelector = document.querySelector('.existing-product-selector');
    const productListEl = document.getElementById('existing-product-list');
    const modeButtonsEl = document.querySelector('.mode-buttons');
    
    // Hide both forms
    if (newForm) newForm.classList.add('hidden-section');
    if (existingForm) existingForm.classList.add('hidden-section');
    
    // Remove active state from both buttons
    if (newBtn) newBtn.classList.remove('active');
    if (existingBtn) existingBtn.classList.remove('active');
    
    // Restore the main selector and reset any existing-product selection view
    if (modeSelector) modeSelector.classList.remove('hidden-section');
    if (selectedInfo) selectedInfo.classList.add('hidden-section');
    if (existingSelector) existingSelector.classList.remove('hidden-section');
    if (productListEl) productListEl.classList.remove('hidden-section');
    if (modeButtonsEl) modeButtonsEl.classList.remove('hidden-section');
}

function switchToNewProduct() {
    currentProductMode = 'new';
    selectedExistingProductIndex = null;
    
    const newForm = document.getElementById('new-product-form');
    const existingForm = document.getElementById('existing-product-form');
    const newBtn = document.querySelector('.new-product-mode-btn');
    const existingBtn = document.querySelector('.existing-product-mode-btn');
    
    if (newForm) newForm.classList.remove('hidden-section');
    if (existingForm) existingForm.classList.add('hidden-section');
    if (newBtn) newBtn.classList.add('active');
    if (existingBtn) existingBtn.classList.remove('active');
    
    resetForm();
}

function switchToExistingProduct() {
    currentProductMode = 'existing';
    selectedExistingProductIndex = null;
    
    const newForm = document.getElementById('new-product-form');
    const existingForm = document.getElementById('existing-product-form');
    const newBtn = document.querySelector('.new-product-mode-btn');
    const existingBtn = document.querySelector('.existing-product-mode-btn');
    const selectedInfo = document.getElementById('selected-product-info');
    
    if (newForm) newForm.classList.add('hidden-section');
    if (existingForm) existingForm.classList.remove('hidden-section');
    if (newBtn) newBtn.classList.remove('active');
    if (existingBtn) existingBtn.classList.add('active');
    if (selectedInfo) selectedInfo.classList.add('hidden-section');
    
    // Ensure the selector label and list are visible
    const existingSelector = document.querySelector('.existing-product-selector');
    if (existingSelector) existingSelector.classList.remove('hidden-section');

    populateExistingProductList();
}

function populateExistingProductList() {
    const productList = document.getElementById('existing-product-list');
    if (!productList) return;
    
    const inventoryData = getInventoryData();
    const groupedProducts = getGroupedInventoryData(inventoryData);
    
    if (groupedProducts.length === 0) {
        productList.innerHTML = '<p class="no-products-msg">Nenhum produto no estoque ainda.</p>';
        return;
    }
    
    productList.innerHTML = '';
    groupedProducts.forEach((group, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'existing-product-btn compact';
        btn.innerHTML = `
            <div class="compact-line"><strong>${group.product}</strong> ${group.size ? `<small>(${group.size})</small>` : ''}</div>
            ${group.details ? `<div class="compact-sub"><small>${group.details}</small></div>` : ''}
            <div class="compact-sub"><small>Vend.: ${formatMoney(group.batches[0]?.sellingPrice || 0)} · Qtd: ${group.quantity}</small></div>
        `;
        btn.addEventListener('click', () => selectExistingProduct(index));
        productList.appendChild(btn);
    });
}

function selectExistingProduct(productIndex) {
    const inventoryData = getInventoryData();
    const groupedProducts = getGroupedInventoryData(inventoryData);
    if (productIndex < 0 || productIndex >= groupedProducts.length) {
        alert('Produto não encontrado.');
        return;
    }
    
    const product = groupedProducts[productIndex];
    selectedExistingProductIndex = productIndex;
    
    // Display product info
    document.getElementById('info-product-name').textContent = product.product || '—';
    document.getElementById('info-product-details').textContent = product.details || '—';
    document.getElementById('info-product-size').textContent = product.size || '—';
    document.getElementById('info-product-qty').textContent = product.quantity || 0;
    
    // Reset quantity input for adding units
    const qtyInput = document.querySelector('.existing-product-quantity');
    if (qtyInput) qtyInput.value = 1;
    if (existingPurchaseLocationInput) existingPurchaseLocationInput.value = '';
    
    const representative = product.batches[0] || {};
    if (existingCostPriceInput) {
        const itemCost = parseFloat(representative.costPrice) || (product.quantity > 0 ? product.total / product.quantity : 0);
        existingCostPriceInput.value = itemCost.toFixed(2);
    }
    if (existingProfitMarginInput) {
        existingProfitMarginInput.value = parseFloat(representative.profitMargin) || 0;
    }
    if (existingSellingPriceInput) {
        const costValue = parseFloat(existingCostPriceInput?.value) || 0;
        const profitValue = parseFloat(existingProfitMarginInput?.value) || 0;
        existingSellingPriceInput.value = formatMoney(costValue * (1 + profitValue / 100));
    }
    
    // Show selected product info
    const selectedInfo = document.getElementById('selected-product-info');
    if (selectedInfo) selectedInfo.classList.remove('hidden-section');
    // Hide the product selector (label + list) and mode buttons to show only selected info
    const productListEl = document.getElementById('existing-product-list');
    if (productListEl) productListEl.classList.add('hidden-section');
    const existingSelector = document.querySelector('.existing-product-selector');
    if (existingSelector) existingSelector.classList.add('hidden-section');
    const modeButtonsEl = document.querySelector('.mode-buttons');
    if (modeButtonsEl) modeButtonsEl.classList.add('hidden-section');
    // Also hide the whole mode selector container
    const modeSelector = document.querySelector('.product-mode-selector');
    if (modeSelector) modeSelector.classList.add('hidden-section');
}

function selectAnotherProduct() {
    // Clear selection and show the list again
    selectedExistingProductIndex = null;
    const selectedInfo = document.getElementById('selected-product-info');
    if (selectedInfo) selectedInfo.classList.add('hidden-section');
    const productListEl = document.getElementById('existing-product-list');
    if (productListEl) productListEl.classList.remove('hidden-section');
    const modeButtonsEl = document.querySelector('.mode-buttons');
    if (modeButtonsEl) modeButtonsEl.classList.remove('hidden-section');
    const existingSelector = document.querySelector('.existing-product-selector');
    if (existingSelector) existingSelector.classList.remove('hidden-section');
    // Show the product-mode-selector again
    const modeSelector = document.querySelector('.product-mode-selector');
    if (modeSelector) modeSelector.classList.remove('hidden-section');
}

function addStock() {
    // Se o usuário não escolheu modo (comportamento observado em alguns dispositivos móveis),
    // assumir "novo produto" como fallback para que o botão funcione previsivelmente.
    if (currentProductMode === null) {
        switchToNewProduct();
    }

    if (currentProductMode === 'new') {
        addNewProduct();
    } else if (currentProductMode === 'existing') {
        addUnitsToExistingProduct();
    }
}

function addNewProduct() {
    if (!orderNameInput) return;

    const product = orderNameInput.value.trim() || 'Produto não informado';
    const details = detailsInput.value.trim();
    const purchaseLocation = purchaseLocationInput ? purchaseLocationInput.value.trim() : '';
    const size = sizeInput.value.trim();
    const quantity = parseInt(quantityInput.value, 10) || 0;
    const total = parseFloat((parseFloat(unitPriceInput.value) || 0) * quantity);
    const sellingPrice = (parseFloat(costPriceInput.value) || 0) * (1 + (parseFloat(profitMarginInput.value) || 0) / 100);

    if (!purchaseLocation) {
        alert('❌ Informe onde o produto foi comprado.');
        return;
    }

    const inventoryData = getInventoryData();
    
    // Verificar duplicatas por nome/tamanho
    const sameNameItems = inventoryData.filter(item => item.product.toLowerCase() === product.toLowerCase());
    if (sameNameItems.length > 0) {
        // Se já existe produto com mesmo nome, exigir que o campo tamanho seja informado
        if (!size) {
            alert('❌ Erro: já existe produto com esse nome. Informe o Tamanho para salvar como nova variação.');
            return;
        }

        // Se existe item com mesmo nome e mesmo tamanho, não permitir salvar
        const sameNameSameSize = sameNameItems.some(item => (item.size || '').toLowerCase() === size.toLowerCase());
        if (sameNameSameSize) {
            alert(`❌ Erro: já existe um produto com o mesmo nome e tamanho ("${product}" - "${size}"). Use a opção "Produto Existente" para adicionar unidades.`);
            return;
        }
        // Caso exista mesmo nome mas tamanhos diferentes, permite salvar (variação)
    }

    inventoryData.push({
        product,
        details,
        purchaseLocation,
        size,
        quantity,
        total,
        costPrice: parseFloat(costPriceInput.value) || 0,
        profitMargin: parseFloat(profitMarginInput.value) || 0,
        sellingPrice: sellingPrice || 0
    });
    // Persistar lote individualmente no Supabase
    (async () => {
        try {
            const lot = {
                product_name: product,
                details,
                purchase_location: purchaseLocation,
                size,
                unit_price: parseFloat(unitPriceInput.value) || null,
                quantity,
                total_value: total,
                cost_price: parseFloat(costPriceInput.value) || null,
                profit_margin: parseFloat(profitMarginInput.value) || null,
                selling_price: sellingPrice || null
            };
            const created = await addInventoryLotToDB(lot);
            if (created) {
                // Atualizar cache local
                inventoryCache.unshift({
                    id: created.id,
                    product: created.product_name,
                    details: created.details,
                    purchaseLocation: created.purchase_location,
                    size: created.size,
                    unitPrice: created.unit_price,
                    quantity: created.quantity,
                    total: created.total_value,
                    costPrice: created.cost_price,
                    profitMargin: created.profit_margin,
                    sellingPrice: created.selling_price
                });
                if (currentProductImageData) {
                    await saveProductImageToDB({ product_name: product, size, image_data: currentProductImageData });
                    const key = getProductImageKey(product, size);
                    productImagesCache[key] = currentProductImageData;
                }
                addInvestment(total);
                renderInventory(inventorySearch ? inventorySearch.value : '');
                populateProductOptions();
                resetForm();
                initializeProductMode();
                renderFinance();
                alert('✅ Produto adicionado ao estoque com sucesso!');
            } else {
                alert('Erro ao salvar produto. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao adicionar produto:', err);
            alert('Erro ao adicionar produto. Veja o console.');
        }
    })();
}

function addUnitsToExistingProduct() {
    if (selectedExistingProductIndex === null) {
        alert('Selecione um produto primeiro.');
        return;
    }
    
    const quantityInput = document.querySelector('.existing-product-quantity');
    const quantity = parseInt(quantityInput.value, 10) || 0;
    const purchaseLocationValue = existingPurchaseLocationInput?.value.trim();
    
    if (!purchaseLocationValue) {
        alert('❌ Informe onde o produto foi comprado.');
        return;
    }
    
    if (quantity <= 0) {
        alert('Informe uma quantidade válida.');
        return;
    }

    const inventoryData = getInventoryData();
    const groupedProducts = getGroupedInventoryData(inventoryData);
    const selectedGroup = groupedProducts[selectedExistingProductIndex];
    if (!selectedGroup) {
        alert('Selecione um produto primeiro.');
        return;
    }

    const representative = selectedGroup.batches[0] || {};
    const unitCost = selectedGroup.quantity > 0 ? selectedGroup.total / selectedGroup.quantity : 0;
    const existingCost = parseFloat(existingCostPriceInput?.value) || unitCost;
    const existingProfitMargin = parseFloat(existingProfitMarginInput?.value) || parseFloat(representative.profitMargin) || 0;
    const purchaseLocation = purchaseLocationValue || selectedGroup.purchaseLocation || '';
    const addedTotal = existingCost * quantity;
    const updatedSellingPrice = existingCost * (1 + existingProfitMargin / 100);

    inventoryData.push({
        product: selectedGroup.product,
        details: selectedGroup.details,
        purchaseLocation,
        size: selectedGroup.size,
        quantity,
        total: addedTotal,
        costPrice: existingCost,
        profitMargin: existingProfitMargin,
        sellingPrice: updatedSellingPrice
    });
    // Persistir lote criado para produto existente
    (async () => {
        try {
            const lot = {
                product_name: selectedGroup.product,
                details: selectedGroup.details,
                purchase_location: purchaseLocation,
                size: selectedGroup.size,
                unit_price: existingCost,
                quantity,
                total_value: addedTotal,
                cost_price: existingCost,
                profit_margin: existingProfitMargin,
                selling_price: updatedSellingPrice
            };
            const created = await addInventoryLotToDB(lot);
            if (created) {
                inventoryCache.unshift({
                    id: created.id,
                    product: created.product_name,
                    details: created.details,
                    purchaseLocation: created.purchase_location,
                    size: created.size,
                    unitPrice: created.unit_price,
                    quantity: created.quantity,
                    total: created.total_value,
                    costPrice: created.cost_price,
                    profitMargin: created.profit_margin,
                    sellingPrice: created.selling_price
                });
                addInvestment(addedTotal);
                renderInventory(inventorySearch ? inventorySearch.value : '');
                populateProductOptions();
                initializeProductMode();
                renderFinance();
                alert(`${quantity} unidade(s) adicionada(s) ao estoque.`);
            } else {
                alert('Erro ao salvar lote. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao adicionar lote:', err);
            alert('Erro ao adicionar unidade(s). Veja o console.');
        }
    })();
}

if (addStockBtn) {
    // listeners serão adicionados no DOMContentLoaded para compatibilidade mobile
}

// Mode selector buttons
const newProductModeBtn = document.querySelector('.new-product-mode-btn');
const existingProductModeBtn = document.querySelector('.existing-product-mode-btn');
const selectOtherBtn = document.querySelector('.select-other-btn');

if (newProductModeBtn) {
    newProductModeBtn.addEventListener('click', switchToNewProduct);
}

if (existingProductModeBtn) {
    existingProductModeBtn.addEventListener('click', switchToExistingProduct);
}

if (selectOtherBtn) {
    selectOtherBtn.addEventListener('click', selectAnotherProduct);
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
    return clientsCache.slice();
}

function setClientsData(data) {
    clientsCache = Array.isArray(data) ? data.slice() : [];
    (async () => {
        try {
            await replaceClientsForShop(clientsCache);
        } catch (err) {
            console.error('Erro ao persistir clientes no Supabase:', err);
        }
    })();
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

    (async () => {
        try {
            const created = await saveClientToDB({ name, source, client_type: type, cpf, cnpj, razao_social: razao, phone, address, birthday, notes });
            if (created) {
                clientsCache.unshift(created);
                renderClients(clientsSearch ? clientsSearch.value : '');
                populateClientOptions();
                resetClientForm();
                if (clientFormEl) clientFormEl.classList.add('hidden-field');
                alert('Cliente salvo.');
            } else {
                alert('Erro ao salvar cliente.');
            }
        } catch (err) {
            console.error('Erro ao salvar cliente:', err);
            alert('Erro ao salvar cliente. Veja o console.');
        }
    })();
}

function getOrdersData() {
    try {
        return ordersCache.map(order => ({ ...order, paid: order.is_paid === true || order.isPaid === true }));
    } catch {
        return [];
    }
}

function setOrdersData(data) {
    ordersCache = Array.isArray(data) ? data.slice() : [];
    (async () => {
        try {
            await replaceOrdersForShop(ordersCache);
        } catch (err) {
            console.error('Erro ao persistir pedidos no Supabase:', err);
        }
    })();
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
    return getInvestmentData();
}

function getCashBalance() {
    const totals = getFinanceTotals();
    return totals.receivedTotal - getInvestmentTotal();
}

function getFinanceChartData() {
    const totals = getFinanceTotals();
    return {
        labels: ['Recebido', 'A receber', 'Em atraso', 'Investimento'],
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
    items = items.slice().sort((a, b) => new Date(b.created || b.date) - new Date(a.created || a.date));
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
    return agendaCache.slice();
}

function setAgendaData(data) {
    agendaCache = Array.isArray(data) ? data.slice() : [];
    (async () => {
        try {
            await replaceScheduleEventsForShop(agendaCache);
        } catch (err) {
            console.error('Erro ao persistir agenda no Supabase:', err);
        }
    })();
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
        .map(order => {
            const total = parseFloat(order.total) || 0;
            const signal = parseFloat(order.signalAmount) || 0;
            const amountDue = Math.max(0, total - signal);
            return {
                date: order.signalDate,
                label: `${order.clientName} — Falta receber ${formatMoney(amountDue)} (${order.code})`,
                code: order.code,
            };
        });
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
    const inventoryData = getInventoryData();
    const groupedProducts = getGroupedInventoryData(inventoryData);
    const current = orderProductSelect.value;
    orderProductSelect.innerHTML = '<option value="">-- selecione produto --</option>';
    groupedProducts.forEach((group, index) => {
        const option = document.createElement('option');
        option.value = `group_${index}`;
        option.textContent = `${group.product}${group.size ? ` (${group.size})` : ''} - ${formatMoney(group.batches[0]?.sellingPrice || 0)}`;
        orderProductSelect.appendChild(option);
    });
    if (current) orderProductSelect.value = current;
}

function populateBatchOptions() {
    if (!orderBatchSelect || !orderProductSelect) return;
    const selectedValue = orderProductSelect.value;
    if (!selectedValue || !selectedValue.startsWith('group_')) {
        if (orderBatchField) orderBatchField.classList.add('hidden-field');
        orderBatchSelect.innerHTML = '<option value="">-- selecione lote --</option>';
        return;
    }

    const inventoryData = getInventoryData();
    const groupedProducts = getGroupedInventoryData(inventoryData);
    const groupIndex = parseInt(selectedValue.replace('group_', ''), 10);
    const group = groupedProducts[groupIndex];

    if (!group) return;

    orderBatchSelect.innerHTML = '<option value="">-- selecione lote --</option>';
    
    if (group.batches.length > 1) {
        if (orderBatchField) orderBatchField.classList.remove('hidden-field');
        group.batches.forEach((batch, batchIdx) => {
            const option = document.createElement('option');
            option.value = `batch_${groupIndex}_${batchIdx}`;
            option.textContent = `Lote ${batchIdx + 1} - Qtd: ${batch.quantity} (${batch.purchaseLocation || 'sem local'})`;
            orderBatchSelect.appendChild(option);
        });
    } else if (group.batches.length === 1) {
        if (orderBatchField) orderBatchField.classList.add('hidden-field');
        orderBatchSelect.value = `batch_${groupIndex}_0`;
    }
}

function updateOrderTotal() {
    if (!orderTotalInput) return;
    let product = null;

    if (orderBatchSelect && orderBatchSelect.value) {
        const batchValue = orderBatchSelect.value;
        if (batchValue.startsWith('batch_')) {
            const [, groupIdx, batchIdx] = batchValue.split('_');
            const inventoryData = getInventoryData();
            const groupedProducts = getGroupedInventoryData(inventoryData);
            const group = groupedProducts[parseInt(groupIdx, 10)];
            if (group && group.batches[parseInt(batchIdx, 10)]) {
                product = group.batches[parseInt(batchIdx, 10)];
            }
        }
    } else if (orderProductSelect && orderProductSelect.value) {
        const selectedValue = orderProductSelect.value;
        if (selectedValue.startsWith('group_')) {
            const groupIndex = parseInt(selectedValue.replace('group_', ''), 10);
            const inventoryData = getInventoryData();
            const groupedProducts = getGroupedInventoryData(inventoryData);
            const group = groupedProducts[groupIndex];
            if (group && group.batches[0]) {
                product = group.batches[0];
            }
        }
    }

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

function getOrderProductLabel(order) {
    if (!order) return '—';
    return `${order.productName || ''}${order.productSize ? ` (${order.productSize})` : ''}`;
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
    if (orderBatchSelect) {
        orderBatchSelect.innerHTML = '<option value="">-- selecione lote --</option>';
        orderBatchSelect.value = '';
    }
    if (orderBatchField) orderBatchField.classList.add('hidden-field');
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

async function saveOrder() {
    if (!orderCodeInput) return;
    const code = orderCodeInput.value || generateOrderCode();
    const date = (orderDateInput?.value && orderDateInput.value.trim()) || new Date().toLocaleDateString('pt-BR');
    const selectedClient = orderClientSelect?.value || '';
    if (!selectedClient) {
        alert('Selecione um cliente ou informe um novo cliente.');
        return;
    }
    let clientName = '';
    let clientRecord = null;
    if (selectedClient === '_new') {
        const newName = (orderClientNameNew?.value || '').trim();
        if (!newName) {
            alert('Informe o nome do cliente.');
            if (orderClientNameRow) orderClientNameRow.classList.remove('hidden-field');
            if (orderClientNameNew) orderClientNameNew.focus();
            return;
        }
        clientName = newName;
        try {
            clientRecord = await saveClientToDB({ name: newName, source: '', client_type: 'pf', cpf: '', cnpj: '', razao_social: '', phone: '', address: '', birthday: '', notes: '' });
            if (clientRecord) {
                clientsCache.unshift(clientRecord);
                renderClients(clientsSearch ? clientsSearch.value : '');
                populateClientOptions();
            }
        } catch (err) {
            console.error('Erro ao criar cliente:', err);
            alert('Erro ao criar cliente. Veja o console.');
            return;
        }
    } else {
        clientName = selectedClient || 'Cliente não informado';
        // try find client record in cache by name
        clientRecord = clientsCache.find(c => c.name === clientName) || null;
    }

    const productSelectValue = orderProductSelect?.value || '';
    const isMissingProduct = productSelectValue === 'missing_product';
    if (!productSelectValue.startsWith('group_') && !isMissingProduct) {
        alert('Selecione um produto para o pedido.');
        return;
    }

    const inventoryData = getInventoryData();
    const groupedProducts = getGroupedInventoryData(inventoryData);
    let selectedGroup = null;

    if (isMissingProduct) {
        const orders = getOrdersData();
        const existingOrder = editingOrderCode ? orders.find(o => o.code === editingOrderCode) : null;
        selectedGroup = {
            product: existingOrder?.productName || 'Produto não informado',
            size: existingOrder?.productSize || '',
            batches: [{
                batchIndex: existingOrder?.batchInventoryIndex ?? null,
                quantity: 0,
                costPrice: 0,
                total: 0,
                sellingPrice: 0,
                purchaseLocation: '',
                details: ''
            }]
        };
    } else {
        const groupIndex = parseInt(productSelectValue.replace('group_', ''), 10);
        selectedGroup = groupedProducts[groupIndex];
    }

    if (!selectedGroup) {
        alert('Selecione um produto para o pedido.');
        return;
    }

    let selectedBatch = null;
    let selectedBatchInventoryIndex = null;

    if (orderBatchSelect && orderBatchSelect.value && orderBatchSelect.value.startsWith('batch_')) {
        const parts = orderBatchSelect.value.split('_');
        const batchIdx = parseInt(parts[2], 10);
        selectedBatch = selectedGroup.batches[batchIdx];
        selectedBatchInventoryIndex = selectedBatch?.batchIndex;
    } else if (selectedGroup.batches.length === 1) {
        selectedBatch = selectedGroup.batches[0];
        selectedBatchInventoryIndex = selectedBatch?.batchIndex;
    }

    if (!selectedBatch) {
        alert('Selecione um lote do produto.');
        return;
    }

    const productName = selectedGroup.product || 'Produto não informado';
    const quantity = parseInt(orderQuantityInput?.value, 10) || 1;
    const discount = parseFloat(orderDiscountInput?.value) || 0;
    const freight = parseFloat(orderFreightInput?.value) || 0;
    const fees = parseFloat(orderFeesInput?.value) || 0;
    const productSize = selectedGroup.size || '';
    const batchInventoryIndex = selectedBatch?.batchIndex ?? null;
    const total = parseFloat(orderTotalInput?.value.replace('R$','').replace('.','').replace(',','.')) || 0;
    let paymentCondition = 'avista';
    if (orderPaymentInputs) for (const r of orderPaymentInputs) if (r.checked) { paymentCondition = r.value; break; }
    const signalAmount = orderSignalAmountInput?.value ? parseFloat(orderSignalAmountInput.value) : 0;
    const signalDate = orderSignalDateInput?.value || '';
    const installmentsQty = parseInt(orderInstallmentsQtyInput?.value, 10) || 0;
    const installmentValue = parseFloat(orderInstallmentValueInput?.value) || 0;
    const notes = orderNotesInput?.value.trim() || '';
    const paid = orderPaidInput?.checked || false;

    const stockQuantity = parseInt(selectedBatch.quantity, 10) || 0;
    if (!editingOrderCode && quantity > stockQuantity) {
        alert('Quantidade solicitada maior que a disponível no estoque para este lote.');
        return;
    }

    if (!editingOrderCode) {
        try {
            const batchItem = selectedBatch;
            const unitCost = batchItem && batchItem.costPrice ? parseFloat(batchItem.costPrice) : (stockQuantity > 0 ? (parseFloat(batchItem.total) || 0) / stockQuantity : 0);
            const remainingCost = Math.max(0, (parseFloat(batchItem.total) || 0) - unitCost * quantity);
            const newQty = stockQuantity - quantity;
            if (batchItem && batchItem.id) {
                if (newQty <= 0) {
                    const ok = await deleteInventoryLotFromDB(batchItem.id);
                    if (!ok) throw new Error('Erro ao deletar lote após venda');
                    // remove from cache
                    const idx = inventoryCache.findIndex(i => i.id === batchItem.id);
                    if (idx >= 0) inventoryCache.splice(idx, 1);
                } else {
                    const updated = await updateInventoryLotInDB(batchItem.id, { quantity: newQty, total: remainingCost });
                    if (!updated) throw new Error('Erro ao atualizar lote');
                    const idx = inventoryCache.findIndex(i => i.id === batchItem.id);
                    if (idx >= 0) inventoryCache[idx] = { ...inventoryCache[idx], quantity: newQty, total: remainingCost };
                }
            } else {
                // fallback local replace
                const inventoryData = getInventoryData();
                inventoryData[selectedBatchInventoryIndex].quantity = newQty;
                inventoryData[selectedBatchInventoryIndex].total = remainingCost;
                if (inventoryData[selectedBatchInventoryIndex].quantity <= 0) inventoryData.splice(selectedBatchInventoryIndex, 1);
                inventoryCache = inventoryData.slice();
                await replaceInventoryForShop(inventoryCache);
            }
            renderInventory(inventorySearch ? inventorySearch.value : '');
            populateProductOptions();
        } catch (err) {
            console.error('Erro ao atualizar estoque para pedido:', err);
            alert('Erro ao atualizar estoque. Veja o console.');
            return;
        }
    }

    const orders = getOrdersData();
    const orderPayload = {
        code,
        date: (parseOrderDate(date) && parseOrderDate(date).toISOString()) || new Date().toISOString(),
        client_name: clientName,
        client_id: clientRecord ? clientRecord.id : null,
        product_name: productName,
        product_size: productSize,
        batch_inventory_index: batchInventoryIndex,
        batch_id: selectedBatch && selectedBatch.id ? selectedBatch.id : null,
        quantity,
        discount,
        freight,
        fees,
        total_value: total,
        payment_condition: paymentCondition,
        signal_amount: signalAmount,
        signal_date: signalDate || null,
        installments_qty: installmentsQty,
        installment_value: installmentValue,
        notes,
        paid
    };

    try {
        let saved = null;
        if (editingOrderCode) {
            const existingOrder = ordersCache.find(o => o.code === editingOrderCode);
            const orderId = existingOrder ? existingOrder.id : null;
            if (!orderId) throw new Error('ID do pedido não encontrado para atualização');
            saved = await updateOrderInDB(orderId, orderPayload);
        } else {
            saved = await saveOrderToDB(orderPayload);
        }
        if (saved) {
            // update local cache
            const idx = ordersCache.findIndex(o => o.code === saved.code);
            if (idx >= 0) ordersCache[idx] = saved; else ordersCache.unshift(saved);
            renderOrders(ordersSearch ? ordersSearch.value : '');
            resetOrderForm();
            if (orderFormEl) orderFormEl.classList.add('hidden-field');
            alert(editingOrderCode ? 'Pedido atualizado.' : 'Pedido salvo.');
        } else {
            throw new Error('Resposta vazia ao salvar pedido');
        }
    } catch (err) {
        console.error('Erro ao salvar pedido:', err);
        alert('Erro ao salvar pedido. Veja o console.');
    }
}

function renderOrders(filter = '') {
    if (!orderList || !orderCount) return;
    const q = (filter || '').trim().toLowerCase();
    const orders = getOrdersData().slice().sort((a, b) => new Date(b.created || b.date) - new Date(a.created || a.date));
    orderList.innerHTML = '';
    const filtered = orders.filter(o => {
        const productLabel = getOrderProductLabel(o).toLowerCase();
        return o.code.toLowerCase().includes(q)
            || o.clientName.toLowerCase().includes(q)
            || productLabel.includes(q);
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
                <td data-label="Produto">${getOrderProductLabel(o)}</td>
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
            if (!o.paid) row.classList.add('unpaid');
            orderList.appendChild(row);
        });
    }

    // show total unpaid orders (across all orders)
    const unpaidTotal = orders.filter(x => !x.paid).length;
    if (orderUnpaidInfo) {
        if (unpaidTotal > 0) {
            orderUnpaidInfo.innerHTML = `<span class="order-unpaid-badge">Atenção: ${unpaidTotal} pedido${unpaidTotal === 1 ? '' : 's'} não pago${unpaidTotal === 1 ? '' : 's'}</span>`;
        } else {
            orderUnpaidInfo.innerHTML = '';
        }
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
        const inventoryData = getInventoryData();
        const groupedProducts = getGroupedInventoryData(inventoryData);
        const productIndex = groupedProducts.findIndex(group =>
            group.product === order.productName &&
            (group.size || '') === (order.productSize || '')
        );

        if (productIndex >= 0) {
            orderProductSelect.value = `group_${productIndex}`;
            populateBatchOptions();

            const group = groupedProducts[productIndex];
            if (order.batchInventoryIndex != null) {
                const batchOptionIndex = group.batches.findIndex(batch => batch.batchIndex === order.batchInventoryIndex);
                if (batchOptionIndex >= 0) {
                    orderBatchSelect.value = `batch_${productIndex}_${batchOptionIndex}`;
                }
            } else if (group.batches.length === 1) {
                orderBatchSelect.value = `batch_${productIndex}_0`;
            }
        } else {
            // produto não está mais no estoque atual; permitir edição do pedido existente
            orderProductSelect.innerHTML = '<option value="">-- selecione produto --</option>';
            const missingOption = document.createElement('option');
            missingOption.value = 'missing_product';
            missingOption.textContent = `${order.productName || 'Produto desconhecido'}${order.productSize ? ` (${order.productSize})` : ''} — não está mais em estoque`;
            missingOption.selected = true;
            orderProductSelect.appendChild(missingOption);
            if (orderBatchField) orderBatchField.classList.add('hidden-field');
        }
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

    const focusField = (orderClientNameRow && !orderClientNameRow.classList.contains('hidden-field') && orderClientNameNew)
        || orderClientSelect
        || orderProductSelect
        || orderQuantityInput;
    if (focusField && typeof focusField.focus === 'function') {
        focusField.focus();
    }
}

async function deleteOrder(code) {
    if (!confirm('Deseja realmente excluir este pedido?')) return;
    try {
        const orders = getOrdersData();
        const target = orders.find(o => o.code === code);
        if (target && target.id) {
            const ok = await deleteOrderFromDB(target.id);
            if (!ok) throw new Error('Erro ao deletar pedido no Supabase');
            const idx = ordersCache.findIndex(o => o.id === target.id);
            if (idx >= 0) ordersCache.splice(idx, 1);
        } else {
            const filtered = orders.filter(o => o.code !== code);
            ordersCache = filtered.slice();
            await replaceOrdersForShop(ordersCache);
        }
        renderOrders(ordersSearch ? ordersSearch.value : '');
    } catch (err) {
        console.error('Erro ao deletar pedido:', err);
        alert('Erro ao excluir pedido. Veja o console.');
    }
}

if (orderList) {
    orderList.addEventListener('click', event => {
        if (!(event.target instanceof HTMLElement)) return;
        const editButton = event.target.closest('.edit-order');
        if (editButton && editButton instanceof HTMLElement) {
            const code = editButton.dataset.code;
            if (code) editOrder(code);
            return;
        }
        const deleteButton = event.target.closest('.delete-order');
        if (deleteButton && deleteButton instanceof HTMLElement) {
            const code = deleteButton.dataset.code;
            if (code) deleteOrder(code);
        }
    });
}

if (newOrderBtn) newOrderBtn.addEventListener('click', showOrderForm);
if (cancelOrderBtn) cancelOrderBtn.addEventListener('click', closeOrderForm);
if (saveOrderBtn) saveOrderBtn.addEventListener('click', saveOrder);
if (orderProductSelect) {
    orderProductSelect.addEventListener('change', () => {
        populateBatchOptions();
        updateOrderTotal();
    });
}

if (orderBatchSelect) {
    orderBatchSelect.addEventListener('change', updateOrderTotal);
}
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

// Initialize product mode for cadastrar page
if (currentPage === 'cadastrar.html') {
    initializeProductMode();
}
