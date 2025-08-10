// Navigation
        function showSection(sectionName) {
            // Hide all sections
            const sections = ['dashboard', 'clients', 'campaigns', 'budget', 'analytics', 'reports', 'integrations', 'users'];
            sections.forEach(section => {
                document.getElementById(section + '-section').classList.add('hidden');
            });
            
            // Show selected section
            document.getElementById(sectionName + '-section').classList.remove('hidden');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'clients': 'Gestão de Clientes',
                'campaigns': 'Campanhas',
                'budget': 'Controle Financeiro',
                'analytics': 'Análises e Métricas',
                'reports': 'Relatórios',
                'integrations': 'Integrações',
                'users': 'Controle de Usuários'
            };
            document.getElementById('page-title').textContent = titles[sectionName];
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('bg-white/20');
            });
            event.target.closest('.nav-item').classList.add('bg-white/20');
        }

        // Modal functions
        function openClientModal() {
            document.getElementById('clientModal').classList.remove('hidden');
        }

        function closeClientModal() {
            document.getElementById('clientModal').classList.add('hidden');
        }

        function openEditClientModal() {
            document.getElementById('editClientModal').classList.remove('hidden');
        }

        function closeEditClientModal() {
            document.getElementById('editClientModal').classList.add('hidden');
        }

        function openClientReportModal() {
            document.getElementById('clientReportModal').classList.remove('hidden');
        }

        function closeClientReportModal() {
            document.getElementById('clientReportModal').classList.add('hidden');
        }

        // Client management functions
        let currentEditingClient = null;

        function editClient(clientName) {
            const client = clients.find(c => c.name === clientName);
            if (client) {
                currentEditingClient = clientName;
                document.getElementById('editClientName').value = client.name;
                document.getElementById('editClientEmail').value = client.email || '';
                document.getElementById('editClientPhone').value = client.phone || '';
                document.getElementById('editClientSegment').value = client.segment;
                document.getElementById('editClientBudget').value = client.budget;
                document.getElementById('editClientTotalBudget').value = client.totalBudget || '';
                document.getElementById('editClientStatus').value = client.status;
                openEditClientModal();
            }
        }

        function deleteClient(clientName) {
            if (confirm(`Tem certeza que deseja excluir o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
                // Remove client from array
                clients = clients.filter(c => c.name !== clientName);
                
                // Remove associated campaigns
                campaigns = campaigns.filter(c => c.client !== clientName);
                
                // Update displays
                updateClientsList();
                updateCampaignsList();
                updateClientOptions();
                
                alert('Cliente excluído com sucesso!');
            }
        }

        function openClientReport(clientName) {
            const client = clients.find(c => c.name === clientName);
            if (!client) return;

            // Get client campaigns
            const clientCampaigns = campaigns.filter(c => c.client === clientName);
            
            // Update report header
            document.getElementById('reportClientName').textContent = clientName;
            document.getElementById('reportClientEmail').textContent = client.email;
            document.getElementById('reportClientSegment').textContent = client.segment;
            
            // Calculate metrics
            const totalBudget = clientCampaigns.reduce((sum, c) => sum + c.budget, 0);
            const totalSpent = clientCampaigns.reduce((sum, c) => sum + c.spent, 0);
            const activeCampaigns = clientCampaigns.filter(c => c.status === 'Ativa').length;
            const avgRoas = clientCampaigns.length > 0 ? 
                (clientCampaigns.reduce((sum, c) => sum + parseFloat(c.roas.replace('x', '')), 0) / clientCampaigns.length).toFixed(1) + 'x' : '0x';
            const totalConversions = Math.floor(Math.random() * 500) + 200; // Simulated data
            const revenue = totalSpent * parseFloat(avgRoas.replace('x', ''));
            const profit = revenue - totalSpent;
            const conversionRate = ((totalConversions / (totalSpent * 0.1)) * 100).toFixed(1);
            const cpa = totalSpent / totalConversions;
            
            // Update summary cards
            document.getElementById('reportBudget').textContent = `R$ ${totalBudget.toLocaleString()}`;
            document.getElementById('reportActiveCampaigns').textContent = activeCampaigns;
            document.getElementById('reportAvgRoas').textContent = avgRoas;
            document.getElementById('reportConversions').textContent = totalConversions;
            
            // Update financial summary
            document.getElementById('financeTotal').textContent = `R$ ${totalBudget.toLocaleString()}`;
            document.getElementById('financeSpent').textContent = `R$ ${totalSpent.toLocaleString()}`;
            document.getElementById('financeAvailable').textContent = `R$ ${(totalBudget - totalSpent).toLocaleString()}`;
            document.getElementById('financeRevenue').textContent = `R$ ${revenue.toLocaleString()}`;
            document.getElementById('financeProfit').textContent = `R$ ${profit.toLocaleString()}`;
            document.getElementById('financeConversionRate').textContent = `${conversionRate}%`;
            document.getElementById('financeCPA').textContent = `R$ ${cpa.toFixed(2)}`;
            
            // Update campaigns table
            const tableBody = document.getElementById('clientCampaignsTable');
            tableBody.innerHTML = '';
            
            clientCampaigns.forEach(campaign => {
                let statusClass = 'bg-green-100 text-green-800';
                if (campaign.status === 'Pausada') statusClass = 'bg-red-100 text-red-800';
                if (campaign.status === 'Otimizando') statusClass = 'bg-yellow-100 text-yellow-800';
                
                const row = `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-100">${campaign.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">${campaign.channel}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">${campaign.period}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">R$ ${campaign.budget.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">R$ ${campaign.spent.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400 font-semibold">${campaign.roas}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="${statusClass} px-2 py-1 rounded-full text-xs">${campaign.status}</span>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            
            openClientReportModal();
            
            // Initialize charts after modal is shown
            setTimeout(() => {
                initializeClientReportCharts(clientCampaigns);
            }, 100);
        }

        function initializeClientReportCharts(clientCampaigns) {
            // Destroy existing charts if they exist
            if (window.clientChannelChart) {
                window.clientChannelChart.destroy();
            }
            if (window.clientPlatformChart) {
                window.clientPlatformChart.destroy();
            }
            if (window.clientROIChart) {
                window.clientROIChart.destroy();
            }

            // If no campaigns, show empty state
            if (!clientCampaigns || clientCampaigns.length === 0) {
                // Show empty charts with placeholder data
                const channelCtx = document.getElementById('clientChannelChart').getContext('2d');
                window.clientChannelChart = new Chart(channelCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Nenhuma campanha'],
                        datasets: [{
                            data: [1],
                            backgroundColor: ['#E5E7EB'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
                return;
            }

            // Group campaigns by channel for distribution
            const channelData = {};
            const platformData = {};
            const platformColors = {
                'Google Ads': '#EA4335',
                'Facebook Ads': '#1877F2',
                'Instagram Ads': '#E4405F',
                'LinkedIn Ads': '#0A66C2',
                'TikTok Ads': '#000000',
                'YouTube Ads': '#FF0000'
            };

            // Process each campaign
            clientCampaigns.forEach(campaign => {
                const channel = campaign.channel;
                const budget = campaign.budget || 0;
                const spent = campaign.spent || 0;
                const roas = parseFloat((campaign.roas || '0x').replace('x', '')) || 0;

                // Channel distribution by budget
                if (!channelData[channel]) {
                    channelData[channel] = 0;
                }
                channelData[channel] += budget;

                // Platform performance data
                if (!platformData[channel]) {
                    platformData[channel] = {
                        budget: 0,
                        spent: 0,
                        roas: 0,
                        count: 0
                    };
                }
                platformData[channel].budget += budget;
                platformData[channel].spent += spent;
                platformData[channel].roas += roas;
                platformData[channel].count += 1;
            });

            // Calculate average ROAS for each platform
            Object.keys(platformData).forEach(platform => {
                if (platformData[platform].count > 0) {
                    platformData[platform].avgRoas = platformData[platform].roas / platformData[platform].count;
                } else {
                    platformData[platform].avgRoas = 0;
                }
            });

            // 1. Client Channel Distribution Chart (Pie Chart)
            const channelCtx = document.getElementById('clientChannelChart').getContext('2d');
            const channelLabels = Object.keys(channelData);
            const channelValues = Object.values(channelData);
            
            window.clientChannelChart = new Chart(channelCtx, {
                type: 'doughnut',
                data: {
                    labels: channelLabels,
                    datasets: [{
                        data: channelValues,
                        backgroundColor: channelLabels.map(channel => platformColors[channel] || '#8B5CF6'),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 8,
                                usePointStyle: true,
                                font: { size: 10 },
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    return data.labels.map((label, i) => ({
                                        text: label.replace(' Ads', ''),
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        pointStyle: 'circle'
                                    }));
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${context.label}: R$ ${context.parsed.toLocaleString()} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });

            // 2. Client Platform Performance Chart (Bar Chart with ROAS)
            const platformCtx = document.getElementById('clientPlatformChart').getContext('2d');
            const platformLabels = Object.keys(platformData);
            const platformRoasData = Object.values(platformData).map(data => data.avgRoas);
            
            window.clientPlatformChart = new Chart(platformCtx, {
                type: 'bar',
                data: {
                    labels: platformLabels.map(platform => {
                        // Shorten platform names for better display
                        return platform.replace(' Ads', '').replace('Facebook', 'Meta');
                    }),
                    datasets: [{
                        label: 'ROAS Médio',
                        data: platformRoasData,
                        backgroundColor: platformLabels.map(platform => platformColors[platform] || '#8B5CF6'),
                        borderColor: platformLabels.map(platform => platformColors[platform] || '#8B5CF6'),
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    return platformLabels[context[0].dataIndex];
                                },
                                label: function(context) {
                                    const platform = platformLabels[context.dataIndex];
                                    const data = platformData[platform];
                                    return [
                                        `ROAS Médio: ${context.parsed.y.toFixed(1)}x`,
                                        `Orçamento Total: R$ ${data.budget.toLocaleString()}`,
                                        `Gasto Total: R$ ${data.spent.toLocaleString()}`,
                                        `Campanhas: ${data.count}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toFixed(1) + 'x';
                                },
                                font: { size: 10 }
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            title: {
                                display: true,
                                text: 'ROAS',
                                font: { size: 11 }
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 10 },
                                maxRotation: 45
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // 3. Client ROI Chart (Investment vs Spending by Campaign)
            const roiCtx = document.getElementById('clientROIChart').getContext('2d');
            const campaignNames = clientCampaigns.map(c => {
                // Truncate long campaign names
                return c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name;
            });
            const campaignBudgets = clientCampaigns.map(c => c.budget || 0);
            const campaignSpent = clientCampaigns.map(c => c.spent || 0);
            
            window.clientROIChart = new Chart(roiCtx, {
                type: 'bar',
                data: {
                    labels: campaignNames,
                    datasets: [{
                        label: 'Orçamento',
                        data: campaignBudgets,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: '#3B82F6',
                        borderWidth: 1,
                        borderRadius: 4
                    }, {
                        label: 'Gasto',
                        data: campaignSpent,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: '#10B981',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString();
                                },
                                font: { size: 10 }
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            title: {
                                display: true,
                                text: 'Valor (R$)',
                                font: { size: 11 }
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 9 },
                                maxRotation: 45
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: { size: 11 },
                                padding: 15,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    // Show full campaign name in tooltip
                                    return clientCampaigns[context[0].dataIndex].name;
                                },
                                label: function(context) {
                                    const campaign = clientCampaigns[context.dataIndex];
                                    const value = context.parsed.y;
                                    let label = context.dataset.label + ': R$ ' + value.toLocaleString();
                                    
                                    // Add additional info for budget vs spent
                                    if (context.dataset.label === 'Orçamento') {
                                        const remaining = campaign.budget - campaign.spent;
                                        label += `\nDisponível: R$ ${remaining.toLocaleString()}`;
                                    } else if (context.dataset.label === 'Gasto') {
                                        const roas = campaign.roas || '0x';
                                        label += `\nROAS: ${roas}`;
                                    }
                                    
                                    return label.split('\n');
                                }
                            }
                        }
                    }
                }
            });
        }

        function openCampaignModal() {
            document.getElementById('campaignModal').classList.remove('hidden');
        }

        function closeCampaignModal() {
            document.getElementById('campaignModal').classList.add('hidden');
            document.getElementById('campaignForm').reset();
            
            // Reset form title and button text
            document.querySelector('#campaignModal h3').textContent = 'Nova Campanha';
            document.querySelector('#campaignForm button[type="submit"]').textContent = 'Criar Campanha';
            
            // Clear editing index
            window.editingCampaignIndex = null;
        }

        function openUserModal() {
            alert('Modal de novo usuário seria aberto aqui');
        }

        // Reports storage and management
        let reportsHistory = [];
        let reportTemplates = [];

        // Report Modal Functions
        function openReportModal() {
            document.getElementById('reportModal').classList.remove('hidden');
            populateClientCheckboxes();
            setDefaultDates();
        }

        function closeReportModal() {
            document.getElementById('reportModal').classList.add('hidden');
            document.getElementById('reportForm').reset();
        }

        function populateClientCheckboxes() {
            const container = document.getElementById('clientsCheckboxes');
            container.innerHTML = '';
            
            clients.forEach(client => {
                const checkbox = `
                    <label class="flex items-center mb-1">
                        <input type="checkbox" name="clients" value="${client.name}" class="mr-2">
                        <span>${client.name}</span>
                    </label>
                `;
                container.innerHTML += checkbox;
            });
        }

        function toggleAllClients() {
            const selectAll = document.getElementById('selectAllClients');
            const checkboxes = document.querySelectorAll('input[name="clients"]');
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
        }

        function toggleAllChannels() {
            const selectAll = document.getElementById('selectAllChannels');
            const checkboxes = document.querySelectorAll('input[name="channels"]');
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
        }

        function setDefaultDates() {
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            
            document.getElementById('reportStartDate').value = thirtyDaysAgo.toISOString().split('T')[0];
            document.getElementById('reportEndDate').value = today.toISOString().split('T')[0];
        }

        function setPresetDates() {
            const preset = document.getElementById('reportPeriodPreset').value;
            const today = new Date();
            let startDate, endDate;

            switch(preset) {
                case 'today':
                    startDate = endDate = today;
                    break;
                case 'yesterday':
                    startDate = endDate = new Date(today.getTime() - (24 * 60 * 60 * 1000));
                    break;
                case 'last7days':
                    startDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
                    endDate = today;
                    break;
                case 'last30days':
                    startDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
                    endDate = today;
                    break;
                case 'thisMonth':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    endDate = today;
                    break;
                case 'lastMonth':
                    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                    break;
                case 'thisYear':
                    startDate = new Date(today.getFullYear(), 0, 1);
                    endDate = today;
                    break;
                default:
                    return;
            }

            if (startDate && endDate) {
                document.getElementById('reportStartDate').value = startDate.toISOString().split('T')[0];
                document.getElementById('reportEndDate').value = endDate.toISOString().split('T')[0];
            }
        }

        // Report Generation Functions
        function generateReportByType(type) {
            const reportConfig = {
                type: type,
                name: getReportNameByType(type),
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                clients: clients.map(c => c.name),
                channels: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads'],
                status: ['Ativa', 'Pausada', 'Otimizando'],
                metrics: ['budget', 'spent', 'revenue', 'roas', 'roi'],
                format: 'pdf',
                includeCharts: true
            };

            generateCustomReport(reportConfig);
        }

        function getReportNameByType(type) {
            const names = {
                'geral': 'Relatório Geral',
                'performance': 'Análise de Performance',
                'financeiro': 'Relatório Financeiro',
                'comparativo': 'Análise Comparativa'
            };
            return names[type] || 'Relatório Personalizado';
        }

        function generateQuickReport() {
            const quickConfig = {
                type: 'geral',
                name: 'Relatório Rápido - ' + new Date().toLocaleDateString('pt-BR'),
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                clients: clients.map(c => c.name),
                channels: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads'],
                status: ['Ativa'],
                metrics: ['budget', 'spent', 'roas'],
                format: 'pdf',
                includeCharts: true
            };

            generateCustomReport(quickConfig);
        }

        function previewReport() {
            const config = getReportConfigFromForm();
            if (!config) return;

            alert(`Prévia do Relatório:\n\nNome: ${config.name}\nTipo: ${config.type}\nPeríodo: ${config.startDate} a ${config.endDate}\nClientes: ${config.clients.length}\nCanais: ${config.channels.length}\nMétricas: ${config.metrics.length}`);
        }

        function getReportConfigFromForm() {
            const name = document.getElementById('reportName').value;
            const type = document.getElementById('reportType').value;
            const startDate = document.getElementById('reportStartDate').value;
            const endDate = document.getElementById('reportEndDate').value;

            if (!name || !type || !startDate || !endDate) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return null;
            }

            const selectedClients = Array.from(document.querySelectorAll('input[name="clients"]:checked')).map(cb => cb.value);
            const selectedChannels = Array.from(document.querySelectorAll('input[name="channels"]:checked')).map(cb => cb.value);
            const selectedStatus = Array.from(document.querySelectorAll('input[name="status"]:checked')).map(cb => cb.value);
            const selectedMetrics = Array.from(document.querySelectorAll('input[name="metrics"]:checked')).map(cb => cb.value);
            const format = document.querySelector('input[name="format"]:checked').value;

            return {
                name,
                type,
                startDate,
                endDate,
                clients: selectedClients,
                channels: selectedChannels,
                status: selectedStatus,
                metrics: selectedMetrics,
                format,
                includeCharts: document.getElementById('includeCharts').checked,
                includeComparison: document.getElementById('includeComparison').checked,
                includeRecommendations: document.getElementById('includeRecommendations').checked,
                notes: document.getElementById('reportNotes').value
            };
        }

        // Individual Campaign Report
        function generateIndividualCampaignReport(campaignIndex) {
            const campaign = campaigns[campaignIndex];
            if (!campaign) return;

            const reportConfig = {
                type: 'individual',
                name: `Relatório - ${campaign.name}`,
                campaign: campaign,
                startDate: campaign.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: campaign.endDate || new Date().toISOString().split('T')[0],
                format: 'pdf',
                includeCharts: true
            };

            generateIndividualReport(reportConfig);
        }

        function generateIndividualReport(config) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const campaign = config.campaign;
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229);
            doc.text('TrafficPro - Relatório Individual de Campanha', 20, 25);
            
            // Campaign Info
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`Campanha: ${campaign.name}`, 20, 45);
            
            doc.setFontSize(12);
            doc.text(`Cliente: ${campaign.client}`, 20, 55);
            doc.text(`Canal: ${campaign.channel}`, 20, 65);
            doc.text(`Período: ${campaign.period}`, 20, 75);
            doc.text(`Status: ${campaign.status}`, 20, 85);
            
            // Metrics
            doc.setFontSize(14);
            doc.text('Métricas de Performance:', 20, 105);
            
            doc.setFontSize(12);
            doc.text(`Orçamento Total: R$ ${campaign.budget.toLocaleString()}`, 25, 120);
            doc.text(`Valor Investido: R$ ${campaign.spent.toLocaleString()}`, 25, 130);
            doc.text(`Receita Gerada: R$ ${campaign.revenue.toLocaleString()}`, 25, 140);
            doc.text(`ROAS: ${campaign.roas}`, 25, 150);
            doc.text(`ROI: ${campaign.roi}`, 25, 160);
            
            const remaining = campaign.budget - campaign.spent;
            doc.text(`Orçamento Restante: R$ ${remaining.toLocaleString()}`, 25, 170);
            
            // Performance Analysis
            doc.setFontSize(14);
            doc.text('Análise de Performance:', 20, 190);
            
            doc.setFontSize(10);
            const roas = parseFloat(campaign.roas.replace('x', ''));
            let performanceText = '';
            
            if (roas >= 4) {
                performanceText = 'Excelente: ROAS acima de 4x indica performance muito boa.';
            } else if (roas >= 2) {
                performanceText = 'Boa: ROAS entre 2x e 4x indica performance satisfatória.';
            } else {
                performanceText = 'Atenção: ROAS abaixo de 2x requer otimização.';
            }
            
            doc.text(performanceText, 25, 205);
            
            // Recommendations
            doc.setFontSize(14);
            doc.text('Recomendações:', 20, 225);
            
            doc.setFontSize(10);
            let recommendations = [];
            
            if (roas < 2) {
                recommendations.push('• Revisar segmentação de público-alvo');
                recommendations.push('• Otimizar criativos e copy dos anúncios');
                recommendations.push('• Ajustar lances e orçamento diário');
            } else if (roas >= 4) {
                recommendations.push('• Considerar aumentar o orçamento para escalar');
                recommendations.push('• Testar novos públicos similares');
                recommendations.push('• Expandir para outros canais');
            } else {
                recommendations.push('• Continuar monitoramento regular');
                recommendations.push('• Testar novas variações de anúncios');
                recommendations.push('• Analisar funil de conversão');
            }
            
            let recY = 240;
            recommendations.forEach(rec => {
                doc.text(rec, 25, recY);
                recY += 10;
            });
            
            // Footer
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('TrafficPro - Sistema de Gestão de Tráfego Pago', 20, pageHeight - 10);
            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, pageHeight - 5);
            
            // Save
            const fileName = `TrafficPro_${campaign.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            // Add to history
            addReportToHistory({
                name: config.name,
                type: 'Individual',
                campaign: campaign.name,
                client: campaign.client,
                format: 'PDF',
                date: new Date()
            });
            
            alert('Relatório individual gerado com sucesso!');
        }

        function generateCustomReport(config) {
            if (config.format === 'pdf' || config.format === 'both') {
                generatePDFReport(config);
            }
            
            if (config.format === 'excel' || config.format === 'both') {
                generateExcelReport(config);
            }
            
            // Add to history
            addReportToHistory({
                name: config.name,
                type: config.type,
                format: config.format.toUpperCase(),
                date: new Date(),
                clients: config.clients.length,
                campaigns: campaigns.filter(c => 
                    config.clients.includes(c.client) && 
                    config.channels.includes(c.channel) && 
                    config.status.includes(c.status)
                ).length
            });
            
            updateReportsStatistics();
        }

        function generatePDFReport(config) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Filter campaigns based on config
            const filteredCampaigns = campaigns.filter(campaign => 
                config.clients.includes(campaign.client) &&
                config.channels.includes(campaign.channel) &&
                config.status.includes(campaign.status)
            );
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229);
            doc.text(`TrafficPro - ${config.name}`, 20, 25);
            
            // Report Info
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Período: ${new Date(config.startDate).toLocaleDateString('pt-BR')} a ${new Date(config.endDate).toLocaleDateString('pt-BR')}`, 20, 35);
            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 42);
            
            // Summary
            const totalBudget = filteredCampaigns.reduce((sum, c) => sum + c.budget, 0);
            const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
            const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
            const avgRoas = filteredCampaigns.length > 0 ? 
                (filteredCampaigns.reduce((sum, c) => sum + parseFloat(c.roas.replace('x', '')), 0) / filteredCampaigns.length).toFixed(1) : 0;
            
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Resumo Executivo:', 20, 60);
            
            doc.setFontSize(12);
            doc.text(`• Total de Campanhas: ${filteredCampaigns.length}`, 25, 75);
            doc.text(`• Orçamento Total: R$ ${totalBudget.toLocaleString()}`, 25, 85);
            doc.text(`• Total Investido: R$ ${totalSpent.toLocaleString()}`, 25, 95);
            doc.text(`• Receita Total: R$ ${totalRevenue.toLocaleString()}`, 25, 105);
            doc.text(`• ROAS Médio: ${avgRoas}x`, 25, 115);
            doc.text(`• ROI Total: ${totalSpent > 0 ? (((totalRevenue - totalSpent) / totalSpent) * 100).toFixed(1) : 0}%`, 25, 125);
            
            // Campaigns Table
            if (filteredCampaigns.length > 0) {
                const tableData = filteredCampaigns.map(campaign => [
                    campaign.name,
                    campaign.client,
                    campaign.channel,
                    `R$ ${campaign.budget.toLocaleString()}`,
                    `R$ ${campaign.spent.toLocaleString()}`,
                    campaign.roas,
                    campaign.status
                ]);
                
                doc.autoTable({
                    head: [['Campanha', 'Cliente', 'Canal', 'Orçamento', 'Gasto', 'ROAS', 'Status']],
                    body: tableData,
                    startY: 140,
                    styles: {
                        fontSize: 8,
                        cellPadding: 2
                    },
                    headStyles: {
                        fillColor: [79, 70, 229],
                        textColor: 255,
                        fontStyle: 'bold'
                    }
                });
            }
            
            // Notes
            if (config.notes) {
                const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 160;
                doc.setFontSize(12);
                doc.text('Observações:', 20, finalY);
                doc.setFontSize(10);
                doc.text(config.notes, 20, finalY + 10);
            }
            
            // Save
            const fileName = `TrafficPro_${config.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
        }

        function generateExcelReport(config) {
            // Filter campaigns
            const filteredCampaigns = campaigns.filter(campaign => 
                config.clients.includes(campaign.client) &&
                config.channels.includes(campaign.channel) &&
                config.status.includes(campaign.status)
            );
            
            // Prepare data
            const excelData = filteredCampaigns.map(campaign => ({
                'Campanha': campaign.name,
                'Cliente': campaign.client,
                'Canal': campaign.channel,
                'Período': campaign.period,
                'Orçamento (R$)': campaign.budget,
                'Gasto (R$)': campaign.spent,
                'Receita (R$)': campaign.revenue,
                'ROAS': campaign.roas,
                'ROI': campaign.roi,
                'Status': campaign.status
            }));
            
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);
            
            // Set column widths
            ws['!cols'] = [
                { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
                { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
                { wch: 10 }, { wch: 12 }
            ];
            
            XLSX.utils.book_append_sheet(wb, ws, 'Campanhas');
            
            // Summary sheet
            const totalBudget = filteredCampaigns.reduce((sum, c) => sum + c.budget, 0);
            const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
            const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
            
            const summaryData = [
                { 'Métrica': 'Total de Campanhas', 'Valor': filteredCampaigns.length },
                { 'Métrica': 'Orçamento Total (R$)', 'Valor': totalBudget },
                { 'Métrica': 'Total Investido (R$)', 'Valor': totalSpent },
                { 'Métrica': 'Receita Total (R$)', 'Valor': totalRevenue },
                { 'Métrica': 'ROI Total (%)', 'Valor': totalSpent > 0 ? (((totalRevenue - totalSpent) / totalSpent) * 100).toFixed(1) : 0 }
            ];
            
            const summaryWs = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo');
            
            // Save
            const fileName = `TrafficPro_${config.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);
        }

        function addReportToHistory(report) {
            reportsHistory.unshift(report);
            updateReportsHistory();
        }

        function updateReportsHistory() {
            const container = document.getElementById('reportsHistory');
            container.innerHTML = '';
            
            reportsHistory.slice(0, 10).forEach((report, index) => {
                const formatIcon = report.format === 'PDF' ? 'fa-file-pdf text-red-500' : 
                                 report.format === 'EXCEL' ? 'fa-file-excel text-green-500' : 
                                 'fa-files text-blue-500';
                
                const reportItem = `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <i class="fas ${formatIcon}"></i>
                            </div>
                            <div>
                                <p class="font-medium text-sm">${report.name}</p>
                                <p class="text-xs text-gray-500">
                                    ${report.type} • ${report.date.toLocaleDateString('pt-BR')} • 
                                    ${report.campaigns || 0} campanhas
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="regenerateReport(${index})" class="text-blue-600 hover:text-blue-800 p-1 rounded" title="Regenerar">
                                <i class="fas fa-redo text-sm"></i>
                            </button>
                            <button onclick="deleteReport(${index})" class="text-red-600 hover:text-red-800 p-1 rounded" title="Excluir">
                                <i class="fas fa-trash text-sm"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += reportItem;
            });
        }

        function updateReportsStatistics() {
            document.getElementById('totalReports').textContent = reportsHistory.length;
            
            const thisMonth = reportsHistory.filter(r => {
                const reportMonth = r.date.getMonth();
                const currentMonth = new Date().getMonth();
                return reportMonth === currentMonth;
            }).length;
            document.getElementById('monthlyReports').textContent = thisMonth;
            
            if (reportsHistory.length > 0) {
                const lastReport = reportsHistory[0];
                document.getElementById('lastReportDate').textContent = lastReport.date.toLocaleDateString('pt-BR');
            }
        }

        function updateIndividualCampaignsTable() {
            const tableBody = document.getElementById('individualCampaignsTable');
            const clientFilter = document.getElementById('campaignFilterClient').value;
            const statusFilter = document.getElementById('campaignFilterStatus').value;
            
            let filteredCampaigns = campaigns;
            
            if (clientFilter) {
                filteredCampaigns = filteredCampaigns.filter(c => c.client === clientFilter);
            }
            
            if (statusFilter) {
                filteredCampaigns = filteredCampaigns.filter(c => c.status === statusFilter);
            }
            
            tableBody.innerHTML = '';
            
            filteredCampaigns.forEach((campaign, index) => {
                let statusClass = 'bg-green-100 text-green-800';
                if (campaign.status === 'Pausada') statusClass = 'bg-red-100 text-red-800';
                if (campaign.status === 'Otimizando') statusClass = 'bg-yellow-100 text-yellow-800';
                if (campaign.status === 'Cancelada') statusClass = 'bg-gray-100 text-gray-800';
                
                const row = `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">${campaign.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${campaign.client}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${campaign.channel}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="${statusClass} px-2 py-1 rounded-full text-xs">${campaign.status}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400 font-semibold">${campaign.roas}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">R$ ${campaign.budget.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <button onclick="generateIndividualCampaignReport(${campaigns.indexOf(campaign)})" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                                <i class="fas fa-download mr-1"></i>Gerar
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }

        function regenerateReport(index) {
            const report = reportsHistory[index];
            alert(`Regenerando relatório: ${report.name}`);
            // Here you would implement the regeneration logic
        }

        function deleteReport(index) {
            if (confirm('Tem certeza que deseja excluir este relatório do histórico?')) {
                reportsHistory.splice(index, 1);
                updateReportsHistory();
                updateReportsStatistics();
            }
        }

        // Report Form Handler
        document.getElementById('reportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const config = getReportConfigFromForm();
            if (!config) return;
            
            generateCustomReport(config);
            closeReportModal();
            
            alert('Relatório gerado com sucesso!');
        });

        function generateReport() {
            openReportModal();
        }

        // Storage arrays
        let clients = [
            { name: 'Loja Fashion', segment: 'E-commerce', budget: 15000, totalBudget: 180000, status: 'Ativo', email: 'contato@lojafashion.com.br', phone: '(11) 99999-1234' },
            { name: 'TechCorp', segment: 'B2B', budget: 25000, totalBudget: 300000, status: 'Ativo', email: 'marketing@techcorp.com', phone: '(11) 98888-5678' },
            { name: 'E-commerce Plus', segment: 'E-commerce', budget: 8000, totalBudget: 96000, status: 'Pausado', email: 'admin@ecommerceplus.com.br', phone: '(11) 97777-9012' }
        ];

        // Campaign logs storage
        let campaignLogs = [];

        // Log management functions
        function addCampaignLog(campaign, action, description, notes = '') {
            const log = {
                id: Date.now(),
                campaignName: campaign.name,
                client: campaign.client,
                action: action,
                description: description,
                notes: notes,
                timestamp: new Date(),
                user: 'Admin User'
            };
            campaignLogs.unshift(log); // Add to beginning of array
        }

        function showLogModal(campaign, actionType) {
            const modal = document.getElementById('logModal');
            const title = document.getElementById('logModalTitle');
            const content = document.getElementById('logModalContent');
            
            // Set title based on action
            const titles = {
                'cancel': '🚫 Campanha Cancelada',
                'reactivate': '✅ Campanha Reativada',
                'pause': '⏸️ Campanha Pausada',
                'activate': '▶️ Campanha Ativada',
                'delete': '🗑️ Campanha Excluída'
            };
            
            title.textContent = titles[actionType] || '📝 Log da Campanha';
            
            // Generate content based on action
            let logContent = '';
            const now = new Date();
            
            if (actionType === 'cancel') {
                logContent = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-ban text-red-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-red-800">Cancelamento Registrado</h4>
                                <p class="text-sm text-red-600">${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-red-600 font-medium">Campanha:</span>
                                <p class="text-gray-800">${campaign.name}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Cliente:</span>
                                <p class="text-gray-800">${campaign.client}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Motivo:</span>
                                <p class="text-gray-800">${campaign.cancelReason || 'Não informado'}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Orçamento Restante:</span>
                                <p class="text-gray-800">R$ ${(campaign.budget - campaign.spent).toLocaleString()}</p>
                            </div>
                        </div>
                        ${campaign.cancelNotes ? `
                            <div class="mt-3 pt-3 border-t border-red-200">
                                <span class="text-red-600 font-medium text-sm">Observações:</span>
                                <p class="text-gray-700 text-sm mt-1">${campaign.cancelNotes}</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div class="flex items-center text-blue-700">
                            <i class="fas fa-info-circle mr-2"></i>
                            <span class="text-sm font-medium">A campanha foi marcada como cancelada e pode ser reativada a qualquer momento.</span>
                        </div>
                    </div>
                `;
            } else if (actionType === 'delete') {
                logContent = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-trash-alt text-red-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-red-800">Exclusão Registrada</h4>
                                <p class="text-sm text-red-600">${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-red-600 font-medium">Campanha:</span>
                                <p class="text-gray-800">${campaign.name}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Cliente:</span>
                                <p class="text-gray-800">${campaign.client}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Motivo:</span>
                                <p class="text-gray-800">${campaign.deleteReason || 'Não informado'}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Status Final:</span>
                                <p class="text-gray-800">${campaign.status}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Orçamento Total:</span>
                                <p class="text-gray-800">R$ ${campaign.budget.toLocaleString()}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Total Investido:</span>
                                <p class="text-gray-800">R$ ${campaign.spent.toLocaleString()}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">ROAS Final:</span>
                                <p class="text-gray-800">${campaign.roas}</p>
                            </div>
                            <div>
                                <span class="text-red-600 font-medium">Canal:</span>
                                <p class="text-gray-800">${campaign.channel}</p>
                            </div>
                        </div>
                        ${campaign.deleteNotes ? `
                            <div class="mt-3 pt-3 border-t border-red-200">
                                <span class="text-red-600 font-medium text-sm">Observações Finais:</span>
                                <p class="text-gray-700 text-sm mt-1">${campaign.deleteNotes}</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="bg-red-100 border border-red-300 rounded-lg p-3">
                        <div class="flex items-center text-red-800">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            <span class="text-sm font-medium">A campanha foi excluída permanentemente do sistema. Todos os dados foram removidos.</span>
                        </div>
                    </div>
                `;
            } else if (actionType === 'reactivate') {
                logContent = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-green-800">Reativação Registrada</h4>
                                <p class="text-sm text-green-600">${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-green-600 font-medium">Campanha:</span>
                                <p class="text-gray-800">${campaign.name}</p>
                            </div>
                            <div>
                                <span class="text-green-600 font-medium">Cliente:</span>
                                <p class="text-gray-800">${campaign.client}</p>
                            </div>
                            <div>
                                <span class="text-green-600 font-medium">Status Anterior:</span>
                                <p class="text-gray-800">Cancelada</p>
                            </div>
                            <div>
                                <span class="text-green-600 font-medium">Novo Status:</span>
                                <p class="text-gray-800">Ativa</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div class="flex items-center text-blue-700">
                            <i class="fas fa-play-circle mr-2"></i>
                            <span class="text-sm font-medium">A campanha foi reativada e está novamente em execução.</span>
                        </div>
                    </div>
                `;
            }
            
            content.innerHTML = logContent;
            modal.classList.remove('hidden');
        }

        function closeLogModal() {
            document.getElementById('logModal').classList.add('hidden');
        }

        let campaigns = [
            { 
                name: 'Black Friday 2024', 
                client: 'Loja Fashion', 
                channel: 'Facebook Ads', 
                period: '20/11 - 30/11',
                budget: 5000,
                spent: 3240,
                revenue: 15552,
                roas: '4.8x',
                roi: '380%',
                status: 'Ativa'
            },
            { 
                name: 'Leads B2B', 
                client: 'TechCorp', 
                channel: 'Google Ads', 
                period: '01/11 - 30/11',
                budget: 8000,
                spent: 6120,
                revenue: 19584,
                roas: '3.2x',
                roi: '220%',
                status: 'Ativa'
            },
            { 
                name: 'Remarketing', 
                client: 'E-commerce Plus', 
                channel: 'LinkedIn Ads', 
                period: '15/11 - 15/12',
                budget: 2500,
                spent: 1890,
                revenue: 3969,
                roas: '2.1x',
                roi: '110%',
                status: 'Otimizando'
            }
        ];

        // Form handlers
        document.getElementById('clientForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newClient = {
                name: document.getElementById('clientName').value,
                email: document.getElementById('clientEmail').value,
                phone: document.getElementById('clientPhone').value,
                segment: document.getElementById('clientSegment').value,
                budget: parseInt(document.getElementById('clientBudget').value),
                totalBudget: parseInt(document.getElementById('clientTotalBudget').value),
                status: 'Ativo'
            };
            
            clients.push(newClient);
            updateClientsList();
            updateClientOptions();
            closeClientModal();
            document.getElementById('clientForm').reset();
            
            // Show success message
            alert('Cliente cadastrado com sucesso!');
        });

        document.getElementById('editClientForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (currentEditingClient) {
                const clientIndex = clients.findIndex(c => c.name === currentEditingClient);
                if (clientIndex !== -1) {
                    const oldName = clients[clientIndex].name;
                    const newName = document.getElementById('editClientName').value;
                    
                    // Update client data
                    clients[clientIndex] = {
                        name: newName,
                        email: document.getElementById('editClientEmail').value,
                        phone: document.getElementById('editClientPhone').value,
                        segment: document.getElementById('editClientSegment').value,
                        budget: parseInt(document.getElementById('editClientBudget').value),
                        totalBudget: parseInt(document.getElementById('editClientTotalBudget').value),
                        status: document.getElementById('editClientStatus').value
                    };
                    
                    // Update campaigns if client name changed
                    if (oldName !== newName) {
                        campaigns.forEach(campaign => {
                            if (campaign.client === oldName) {
                                campaign.client = newName;
                            }
                        });
                    }
                    
                    // Update displays
                    updateClientsList();
                    updateCampaignsList();
                    updateClientOptions();
                    closeEditClientModal();
                    
                    alert('Cliente atualizado com sucesso!');
                }
            }
        });

        document.getElementById('campaignForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const startDate = new Date(document.getElementById('campaignStartDate').value);
            const endDate = new Date(document.getElementById('campaignEndDate').value);
            
            const campaignData = {
                name: document.getElementById('campaignName').value,
                client: document.getElementById('campaignClient').value,
                channel: document.getElementById('campaignChannel').value,
                objective: document.getElementById('campaignObjective').value,
                budget: parseInt(document.getElementById('campaignBudget').value),
                dailyBudget: parseInt(document.getElementById('campaignDailyBudget').value),
                startDate: startDate.toLocaleDateString('pt-BR'),
                endDate: endDate.toLocaleDateString('pt-BR'),
                period: startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' - ' + endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                ageMin: document.getElementById('ageMin').value,
                ageMax: document.getElementById('ageMax').value,
                gender: document.getElementById('gender').value,
                location: document.getElementById('campaignLocation').value,
                keywords: document.getElementById('campaignKeywords').value,
                notes: document.getElementById('campaignNotes').value
            };
            
            if (window.editingCampaignIndex !== null && window.editingCampaignIndex !== undefined) {
                // Editing existing campaign
                const existingCampaign = campaigns[window.editingCampaignIndex];
                campaigns[window.editingCampaignIndex] = {
                    ...existingCampaign,
                    ...campaignData
                };
                alert('Campanha atualizada com sucesso!');
            } else {
                // Creating new campaign
                const newCampaign = {
                    ...campaignData,
                    spent: 0,
                    revenue: 0,
                    roas: '0x',
                    roi: '0%',
                    status: 'Ativa'
                };
                campaigns.push(newCampaign);
                alert('Campanha criada com sucesso!');
            }
            
            updateCampaignsList();
            updateClientOptions();
            closeCampaignModal();
        });

        // Campaign management functions
        function editCampaign(index) {
            const campaign = campaigns[index];
            if (campaign) {
                // Populate form with campaign data
                document.getElementById('campaignName').value = campaign.name;
                document.getElementById('campaignClient').value = campaign.client;
                document.getElementById('campaignChannel').value = campaign.channel;
                document.getElementById('campaignObjective').value = campaign.objective || '';
                document.getElementById('campaignBudget').value = campaign.budget;
                document.getElementById('campaignDailyBudget').value = campaign.dailyBudget || '';
                document.getElementById('campaignStartDate').value = campaign.startDate ? new Date(campaign.startDate.split('/').reverse().join('-')).toISOString().split('T')[0] : '';
                document.getElementById('campaignEndDate').value = campaign.endDate ? new Date(campaign.endDate.split('/').reverse().join('-')).toISOString().split('T')[0] : '';
                document.getElementById('ageMin').value = campaign.ageMin || '';
                document.getElementById('ageMax').value = campaign.ageMax || '';
                document.getElementById('gender').value = campaign.gender || 'Todos';
                document.getElementById('campaignLocation').value = campaign.location || '';
                document.getElementById('campaignKeywords').value = campaign.keywords || '';
                document.getElementById('campaignNotes').value = campaign.notes || '';
                
                // Store the index for updating
                window.editingCampaignIndex = index;
                
                // Change form title and button text
                document.querySelector('#campaignModal h3').textContent = 'Editar Campanha';
                document.querySelector('#campaignForm button[type="submit"]').textContent = 'Salvar Alterações';
                
                openCampaignModal();
            }
        }

        function toggleCampaignStatus(index) {
            const campaign = campaigns[index];
            if (campaign) {
                if (campaign.status === 'Ativa') {
                    campaign.status = 'Pausada';
                    alert(`Campanha "${campaign.name}" foi pausada.`);
                } else if (campaign.status === 'Pausada') {
                    campaign.status = 'Ativa';
                    alert(`Campanha "${campaign.name}" foi reativada.`);
                } else if (campaign.status === 'Otimizando') {
                    campaign.status = 'Pausada';
                    alert(`Campanha "${campaign.name}" foi pausada.`);
                }
                updateCampaignsList();
            }
        }

        function pauseCampaign(index) {
            const campaign = campaigns[index];
            if (campaign && campaign.status !== 'Cancelada') {
                openCancelModal(campaign, index);
            }
        }

        function cancelCampaign(index) {
            const campaign = campaigns[index];
            if (campaign && campaign.status !== 'Cancelada') {
                openCancelModal(campaign, index);
            }
        }

        function openCancelModal(campaign, index) {
            // Populate modal with campaign data
            document.getElementById('cancelCampaignName').textContent = campaign.name;
            document.getElementById('cancelCampaignClient').textContent = campaign.client;
            document.getElementById('cancelCampaignChannel').textContent = campaign.channel;
            document.getElementById('cancelCampaignBudget').textContent = `R$ ${campaign.budget.toLocaleString()}`;
            document.getElementById('cancelCampaignSpent').textContent = `R$ ${campaign.spent.toLocaleString()}`;
            document.getElementById('cancelCampaignRoas').textContent = campaign.roas;
            
            // Calculate remaining budget
            const remaining = campaign.budget - campaign.spent;
            document.getElementById('cancelCampaignRemaining').textContent = `R$ ${remaining.toLocaleString()}`;
            
            // Store campaign index for confirmation
            window.cancelingCampaignIndex = index;
            
            // Show modal
            document.getElementById('cancelModal').classList.remove('hidden');
        }

        function closeCancelModal() {
            document.getElementById('cancelModal').classList.add('hidden');
            document.getElementById('cancelReason').value = '';
            document.getElementById('cancelNotes').value = '';
            window.cancelingCampaignIndex = null;
        }

        function confirmCancelCampaign() {
            const index = window.cancelingCampaignIndex;
            const campaign = campaigns[index];
            const reason = document.getElementById('cancelReason').value;
            const notes = document.getElementById('cancelNotes').value;
            
            if (!reason) {
                alert('Por favor, selecione um motivo para o cancelamento.');
                return;
            }
            
            // Update campaign status and add cancellation info
            campaign.status = 'Cancelada';
            campaign.cancelReason = reason;
            campaign.cancelNotes = notes;
            campaign.cancelDate = new Date().toLocaleDateString('pt-BR');
            campaign.cancelTime = new Date().toLocaleTimeString('pt-BR');
            
            // Add to logs
            addCampaignLog(campaign, 'Cancelamento', `Campanha cancelada. Motivo: ${reason}`, notes);
            
            // Close modal and update list
            closeCancelModal();
            updateCampaignsList();
            
            // Show success log modal
            showLogModal(campaign, 'cancel');
        }

        function reactivateCampaign(index) {
            const campaign = campaigns[index];
            if (campaign && campaign.status === 'Cancelada') {
                // Update campaign status
                campaign.status = 'Ativa';
                
                // Clear cancellation data
                delete campaign.cancelReason;
                delete campaign.cancelNotes;
                delete campaign.cancelDate;
                delete campaign.cancelTime;
                
                // Add to logs
                addCampaignLog(campaign, 'Reativação', `Campanha reativada após cancelamento`);
                
                // Update list and show log
                updateCampaignsList();
                showLogModal(campaign, 'reactivate');
            }
        }

        function deleteCampaign(index) {
            const campaign = campaigns[index];
            if (campaign) {
                openDeleteModal(campaign, index);
            }
        }

        function openDeleteModal(campaign, index) {
            // Populate modal with campaign data
            document.getElementById('deleteCampaignName').textContent = campaign.name;
            document.getElementById('deleteCampaignClient').textContent = campaign.client;
            document.getElementById('deleteCampaignChannel').textContent = campaign.channel;
            document.getElementById('deleteCampaignBudget').textContent = `R$ ${campaign.budget.toLocaleString()}`;
            document.getElementById('deleteCampaignSpent').textContent = `R$ ${campaign.spent.toLocaleString()}`;
            document.getElementById('deleteCampaignRoas').textContent = campaign.roas;
            document.getElementById('deleteCampaignStatus').textContent = campaign.status;
            document.getElementById('deleteCampaignPeriod').textContent = campaign.period;
            
            // Store campaign index for confirmation
            window.deletingCampaignIndex = index;
            
            // Show modal
            document.getElementById('deleteModal').classList.remove('hidden');
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').classList.add('hidden');
            document.getElementById('deleteReason').value = '';
            document.getElementById('deleteNotes').value = '';
            document.getElementById('deleteConfirmation').checked = false;
            window.deletingCampaignIndex = null;
        }

        function confirmDeleteCampaign() {
            const index = window.deletingCampaignIndex;
            const campaign = campaigns[index];
            const reason = document.getElementById('deleteReason').value;
            const notes = document.getElementById('deleteNotes').value;
            const confirmation = document.getElementById('deleteConfirmation').checked;
            
            if (!reason) {
                alert('Por favor, selecione um motivo para a exclusão.');
                return;
            }
            
            if (!confirmation) {
                alert('Por favor, confirme que você entende as consequências da exclusão.');
                return;
            }
            
            // Add to logs before deletion
            addCampaignLog(campaign, 'Exclusão', `Campanha excluída permanentemente. Motivo: ${reason}`, notes);
            
            // Store campaign data for log modal
            const deletedCampaign = { ...campaign, deleteReason: reason, deleteNotes: notes };
            
            // Remove campaign from array
            campaigns.splice(index, 1);
            
            // Close modal and update list
            closeDeleteModal();
            updateCampaignsList();
            
            // Show success log modal
            showLogModal(deletedCampaign, 'delete');
        }

        // Update functions
        function updateClientsList() {
            const clientsContainer = document.getElementById('clients-grid');
            clientsContainer.innerHTML = '';
            
            clients.forEach(client => {
                const statusClass = client.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                                  client.status === 'Pausado' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                
                const clientCard = `
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm card-hover transition-colors duration-300">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-100">${client.name}</h4>
                            <div class="flex items-center space-x-2">
                                <span class="${statusClass} px-2 py-1 rounded-full text-xs">${client.status}</span>
                                <button onclick="deleteClient('${client.name}')" class="text-gray-400 hover:text-red-500 transition-colors" title="Excluir cliente">
                                    <i class="fas fa-trash text-sm"></i>
                                </button>
                            </div>
                        </div>
                        <div class="space-y-2 mb-4">
                            <p class="text-gray-600 dark:text-gray-300">${client.segment}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400"><i class="fas fa-envelope mr-2"></i>${client.email || 'Email não informado'}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400"><i class="fas fa-phone mr-2"></i>${client.phone || 'Telefone não informado'}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4 transition-colors duration-300">
                            <p class="text-sm text-gray-600 dark:text-gray-300">Orçamento mensal: <span class="font-semibold">R$ ${client.budget.toLocaleString()}</span></p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">Orçamento total: <span class="font-semibold">R$ ${(client.totalBudget || 0).toLocaleString()}</span></p>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <button onclick="editClient('${client.name}')" class="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                                <i class="fas fa-edit mr-1"></i>Editar
                            </button>
                            <button onclick="openClientReport('${client.name}')" class="bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors">
                                <i class="fas fa-chart-bar mr-1"></i>Relatório
                            </button>
                        </div>
                    </div>
                `;
                clientsContainer.innerHTML += clientCard;
            });
        }

        function updateCampaignsList() {
            const campaignsTable = document.querySelector('#campaigns-section tbody');
            campaignsTable.innerHTML = '';
            
            campaigns.forEach((campaign, index) => {
                let statusClass = 'bg-green-100 text-green-800';
                if (campaign.status === 'Pausada') statusClass = 'bg-red-100 text-red-800';
                if (campaign.status === 'Otimizando') statusClass = 'bg-yellow-100 text-yellow-800';
                if (campaign.status === 'Cancelada') statusClass = 'bg-gray-100 text-gray-800';
                
                // Adicionar classe para campanhas canceladas
                const rowClass = campaign.status === 'Cancelada' ? 'campaign-cancelled' : 'hover:bg-gray-50 dark:hover:bg-gray-700';
                
                // Definir botões de ação baseados no status
                let actionButtons = '';
                if (campaign.status === 'Cancelada') {
                    actionButtons = `
                        <button onclick="reactivateCampaign(${index})" class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50" title="Reativar campanha">
                            <i class="fas fa-undo text-sm"></i>
                        </button>
                        <button onclick="deleteCampaign(${index})" class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" title="Excluir campanha">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    `;
                } else {
                    actionButtons = `
                        <button onclick="editCampaign(${index})" class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Editar campanha">
                            <i class="fas fa-edit text-sm"></i>
                        </button>
                        <button onclick="pauseCampaign(${index})" class="text-orange-600 hover:text-orange-800 p-1 rounded hover:bg-orange-50" title="Cancelar campanha">
                            <i class="fas fa-ban text-sm"></i>
                        </button>
                        <button onclick="toggleCampaignStatus(${index})" class="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-50" title="${campaign.status === 'Ativa' ? 'Pausar' : 'Ativar'} campanha">
                            <i class="fas ${campaign.status === 'Ativa' ? 'fa-pause' : 'fa-play'} text-sm"></i>
                        </button>
                        <button onclick="deleteCampaign(${index})" class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" title="Excluir campanha">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    `;
                }
                
                const campaignRow = `
                    <tr class="${rowClass}">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">${campaign.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${campaign.client}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${campaign.channel}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${campaign.period}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">R$ ${campaign.budget.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">R$ ${campaign.spent.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400 font-semibold">R$ ${campaign.revenue.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-blue-600 dark:text-blue-400 font-semibold">${campaign.roas}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-purple-600 dark:text-purple-400 font-semibold">${campaign.roi}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="${statusClass} px-2 py-1 rounded-full text-xs">${campaign.status}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <div class="flex justify-center space-x-2">
                                ${actionButtons}
                            </div>
                        </td>
                    </tr>
                `;
                campaignsTable.innerHTML += campaignRow;
            });
        }

        function updateClientOptions() {
            const clientSelect = document.getElementById('campaignClient');
            clientSelect.innerHTML = '<option value="">Selecione o cliente...</option>';
            
            clients.forEach(client => {
                if (client.status === 'Ativo') {
                    clientSelect.innerHTML += `<option value="${client.name}">${client.name}</option>`;
                }
            });
        }

        // Initialize Mini Charts
        function initializeMiniCharts() {
            // Facebook Ads mini chart
            const ctx1 = document.getElementById('miniChart1').getContext('2d');
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', ''],
                    datasets: [{
                        data: [3.2, 3.8, 4.1, 4.5, 4.8],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: { point: { radius: 0 } }
                }
            });

            // Google Ads mini chart
            const ctx2 = document.getElementById('miniChart2').getContext('2d');
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', ''],
                    datasets: [{
                        data: [2.8, 3.1, 3.0, 3.4, 3.2],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: { point: { radius: 0 } }
                }
            });

            // LinkedIn Ads mini chart
            const ctx3 = document.getElementById('miniChart3').getContext('2d');
            new Chart(ctx3, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', ''],
                    datasets: [{
                        data: [2.5, 2.3, 2.1, 2.0, 2.1],
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: { point: { radius: 0 } }
                }
            });
        }

        // Export functions
        function toggleExportMenu() {
            const menu = document.getElementById('exportMenu');
            menu.classList.toggle('hidden');
        }

        function toggleCampaignExportMenu() {
            const menu = document.getElementById('campaignExportMenu');
            menu.classList.toggle('hidden');
        }

        // Close export menu when clicking outside
        document.addEventListener('click', function(event) {
            const menu = document.getElementById('exportMenu');
            const campaignMenu = document.getElementById('campaignExportMenu');
            const button = event.target.closest('button[onclick="toggleExportMenu()"]');
            const campaignButton = event.target.closest('button[onclick="toggleCampaignExportMenu()"]');
            
            if (!button && !menu.contains(event.target)) {
                menu.classList.add('hidden');
            }
            
            if (!campaignButton && !campaignMenu.contains(event.target)) {
                campaignMenu.classList.add('hidden');
            }
        });

        function exportToPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configurar fonte para suporte a caracteres especiais
            doc.setFont('helvetica');
            
            // Cabeçalho do documento
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229); // Cor roxa
            doc.text('TrafficPro - Relatório de Clientes', 20, 25);
            
            // Data de geração
            const today = new Date();
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Gerado em: ${today.toLocaleDateString('pt-BR')} às ${today.toLocaleTimeString('pt-BR')}`, 20, 35);
            
            // Preparar dados da tabela
            const tableData = clients.map(client => [
                client.name,
                client.email || 'Não informado',
                client.phone || 'Não informado',
                client.segment,
                `R$ ${client.budget.toLocaleString()}`,
                `R$ ${(client.totalBudget || 0).toLocaleString()}`,
                client.status
            ]);
            
            // Configurar tabela
            doc.autoTable({
                head: [['Cliente', 'Email', 'Telefone', 'Segmento', 'Orç. Mensal', 'Orç. Total', 'Status']],
                body: tableData,
                startY: 45,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: 'linebreak',
                    halign: 'left'
                },
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 10
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                columnStyles: {
                    0: { cellWidth: 25 }, // Cliente
                    1: { cellWidth: 35 }, // Email
                    2: { cellWidth: 25 }, // Telefone
                    3: { cellWidth: 20 }, // Segmento
                    4: { cellWidth: 25 }, // Orç. Mensal
                    5: { cellWidth: 25 }, // Orç. Total
                    6: { cellWidth: 20 }  // Status
                },
                didDrawCell: function(data) {
                    // Colorir status
                    if (data.column.index === 6 && data.cell.section === 'body') {
                        const status = data.cell.text[0];
                        if (status === 'Ativo') {
                            data.cell.styles.textColor = [34, 197, 94]; // Verde
                        } else if (status === 'Pausado') {
                            data.cell.styles.textColor = [245, 158, 11]; // Amarelo
                        } else if (status === 'Inativo') {
                            data.cell.styles.textColor = [239, 68, 68]; // Vermelho
                        }
                    }
                }
            });
            
            // Resumo estatístico
            const finalY = doc.lastAutoTable.finalY + 15;
            const totalClients = clients.length;
            const activeClients = clients.filter(c => c.status === 'Ativo').length;
            const totalBudget = clients.reduce((sum, c) => sum + c.budget, 0);
            const totalBudgetAll = clients.reduce((sum, c) => sum + (c.totalBudget || 0), 0);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Resumo Estatístico:', 20, finalY);
            
            doc.setFontSize(10);
            doc.text(`• Total de Clientes: ${totalClients}`, 25, finalY + 10);
            doc.text(`• Clientes Ativos: ${activeClients}`, 25, finalY + 18);
            doc.text(`• Orçamento Mensal Total: R$ ${totalBudget.toLocaleString()}`, 25, finalY + 26);
            doc.text(`• Orçamento Total Geral: R$ ${totalBudgetAll.toLocaleString()}`, 25, finalY + 34);
            
            // Rodapé
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('TrafficPro - Sistema de Gestão de Tráfego Pago', 20, pageHeight - 10);
            
            // Salvar arquivo
            doc.save(`TrafficPro_Clientes_${today.toISOString().split('T')[0]}.pdf`);
            
            // Fechar menu
            document.getElementById('exportMenu').classList.add('hidden');
            
            // Mostrar mensagem de sucesso
            alert('Relatório PDF gerado com sucesso!');
        }

        function exportToExcel() {
            // Preparar dados para Excel
            const excelData = clients.map(client => ({
                'Cliente': client.name,
                'Email': client.email || 'Não informado',
                'Telefone': client.phone || 'Não informado',
                'Segmento': client.segment,
                'Orçamento Mensal': client.budget,
                'Orçamento Total': client.totalBudget || 0,
                'Status': client.status
            }));
            
            // Criar workbook
            const wb = XLSX.utils.book_new();
            
            // Criar worksheet principal
            const ws = XLSX.utils.json_to_sheet(excelData);
            
            // Configurar largura das colunas
            const colWidths = [
                { wch: 20 }, // Cliente
                { wch: 30 }, // Email
                { wch: 18 }, // Telefone
                { wch: 15 }, // Segmento
                { wch: 18 }, // Orçamento Mensal
                { wch: 18 }, // Orçamento Total
                { wch: 12 }  // Status
            ];
            ws['!cols'] = colWidths;
            
            // Adicionar worksheet ao workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
            
            // Criar worksheet de resumo
            const totalClients = clients.length;
            const activeClients = clients.filter(c => c.status === 'Ativo').length;
            const pausedClients = clients.filter(c => c.status === 'Pausado').length;
            const inactiveClients = clients.filter(c => c.status === 'Inativo').length;
            const totalBudget = clients.reduce((sum, c) => sum + c.budget, 0);
            const totalBudgetAll = clients.reduce((sum, c) => sum + (c.totalBudget || 0), 0);
            
            const summaryData = [
                { 'Métrica': 'Total de Clientes', 'Valor': totalClients },
                { 'Métrica': 'Clientes Ativos', 'Valor': activeClients },
                { 'Métrica': 'Clientes Pausados', 'Valor': pausedClients },
                { 'Métrica': 'Clientes Inativos', 'Valor': inactiveClients },
                { 'Métrica': 'Orçamento Mensal Total (R$)', 'Valor': totalBudget },
                { 'Métrica': 'Orçamento Total Geral (R$)', 'Valor': totalBudgetAll }
            ];
            
            const summaryWs = XLSX.utils.json_to_sheet(summaryData);
            summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
            XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo');
            
            // Criar worksheet por segmento
            const segments = [...new Set(clients.map(c => c.segment))];
            const segmentData = segments.map(segment => {
                const segmentClients = clients.filter(c => c.segment === segment);
                return {
                    'Segmento': segment,
                    'Quantidade': segmentClients.length,
                    'Orçamento Mensal Total': segmentClients.reduce((sum, c) => sum + c.budget, 0),
                    'Orçamento Total Geral': segmentClients.reduce((sum, c) => sum + (c.totalBudget || 0), 0),
                    'Clientes Ativos': segmentClients.filter(c => c.status === 'Ativo').length
                };
            });
            
            const segmentWs = XLSX.utils.json_to_sheet(segmentData);
            segmentWs['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 15 }];
            XLSX.utils.book_append_sheet(wb, segmentWs, 'Por Segmento');
            
            // Gerar nome do arquivo com data
            const today = new Date();
            const fileName = `TrafficPro_Clientes_${today.toISOString().split('T')[0]}.xlsx`;
            
            // Salvar arquivo
            XLSX.writeFile(wb, fileName);
            
            // Fechar menu
            document.getElementById('exportMenu').classList.add('hidden');
            
            // Mostrar mensagem de sucesso
            alert('Planilha Excel gerada com sucesso!');
        }

        function exportCampaignsToPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape'); // Modo paisagem para mais colunas
            
            // Configurar fonte para suporte a caracteres especiais
            doc.setFont('helvetica');
            
            // Cabeçalho do documento
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229); // Cor roxa
            doc.text('TrafficPro - Relatório de Campanhas', 20, 25);
            
            // Data de geração
            const today = new Date();
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Gerado em: ${today.toLocaleDateString('pt-BR')} às ${today.toLocaleTimeString('pt-BR')}`, 20, 35);
            
            // Preparar dados da tabela
            const tableData = campaigns.map(campaign => [
                campaign.name,
                campaign.client,
                campaign.channel,
                campaign.period,
                `R$ ${campaign.budget.toLocaleString()}`,
                `R$ ${campaign.spent.toLocaleString()}`,
                `R$ ${campaign.revenue.toLocaleString()}`,
                campaign.roas,
                campaign.roi,
                campaign.status
            ]);
            
            // Configurar tabela
            doc.autoTable({
                head: [['Campanha', 'Cliente', 'Canal', 'Período', 'Orçamento', 'Gasto', 'Receita', 'ROAS', 'ROI', 'Status']],
                body: tableData,
                startY: 45,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    halign: 'left'
                },
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 9
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                columnStyles: {
                    0: { cellWidth: 30 }, // Campanha
                    1: { cellWidth: 25 }, // Cliente
                    2: { cellWidth: 25 }, // Canal
                    3: { cellWidth: 25 }, // Período
                    4: { cellWidth: 25 }, // Orçamento
                    5: { cellWidth: 25 }, // Gasto
                    6: { cellWidth: 25 }, // Receita
                    7: { cellWidth: 20 }, // ROAS
                    8: { cellWidth: 20 }, // ROI
                    9: { cellWidth: 20 }  // Status
                },
                didDrawCell: function(data) {
                    // Colorir status
                    if (data.column.index === 9 && data.cell.section === 'body') {
                        const status = data.cell.text[0];
                        if (status === 'Ativa') {
                            data.cell.styles.textColor = [34, 197, 94]; // Verde
                        } else if (status === 'Pausada') {
                            data.cell.styles.textColor = [239, 68, 68]; // Vermelho
                        } else if (status === 'Otimizando') {
                            data.cell.styles.textColor = [245, 158, 11]; // Amarelo
                        } else if (status === 'Cancelada') {
                            data.cell.styles.textColor = [107, 114, 128]; // Cinza
                        }
                    }
                    
                    // Colorir ROAS
                    if (data.column.index === 7 && data.cell.section === 'body') {
                        const roas = parseFloat(data.cell.text[0].replace('x', ''));
                        if (roas >= 4) {
                            data.cell.styles.textColor = [34, 197, 94]; // Verde
                        } else if (roas >= 2) {
                            data.cell.styles.textColor = [245, 158, 11]; // Amarelo
                        } else {
                            data.cell.styles.textColor = [239, 68, 68]; // Vermelho
                        }
                    }
                }
            });
            
            // Resumo estatístico
            const finalY = doc.lastAutoTable.finalY + 15;
            const totalCampaigns = campaigns.length;
            const activeCampaigns = campaigns.filter(c => c.status === 'Ativa').length;
            const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
            const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
            const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
            const avgRoas = campaigns.length > 0 ? 
                (campaigns.reduce((sum, c) => sum + parseFloat(c.roas.replace('x', '')), 0) / campaigns.length).toFixed(1) : 0;
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Resumo Estatístico:', 20, finalY);
            
            doc.setFontSize(10);
            doc.text(`• Total de Campanhas: ${totalCampaigns}`, 25, finalY + 10);
            doc.text(`• Campanhas Ativas: ${activeCampaigns}`, 25, finalY + 18);
            doc.text(`• Orçamento Total: R$ ${totalBudget.toLocaleString()}`, 25, finalY + 26);
            doc.text(`• Total Investido: R$ ${totalSpent.toLocaleString()}`, 25, finalY + 34);
            doc.text(`• Receita Total: R$ ${totalRevenue.toLocaleString()}`, 25, finalY + 42);
            doc.text(`• ROAS Médio: ${avgRoas}x`, 25, finalY + 50);
            
            // Performance por canal
            const channelStats = {};
            campaigns.forEach(campaign => {
                if (!channelStats[campaign.channel]) {
                    channelStats[campaign.channel] = {
                        count: 0,
                        budget: 0,
                        spent: 0,
                        revenue: 0
                    };
                }
                channelStats[campaign.channel].count++;
                channelStats[campaign.channel].budget += campaign.budget;
                channelStats[campaign.channel].spent += campaign.spent;
                channelStats[campaign.channel].revenue += campaign.revenue;
            });
            
            doc.text('Performance por Canal:', 150, finalY + 10);
            let channelY = finalY + 18;
            Object.keys(channelStats).forEach(channel => {
                const stats = channelStats[channel];
                const channelRoas = stats.spent > 0 ? (stats.revenue / stats.spent).toFixed(1) : 0;
                doc.text(`• ${channel}: ${stats.count} campanhas, ROAS ${channelRoas}x`, 155, channelY);
                channelY += 8;
            });
            
            // Rodapé
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('TrafficPro - Sistema de Gestão de Tráfego Pago', 20, pageHeight - 10);
            
            // Salvar arquivo
            doc.save(`TrafficPro_Campanhas_${today.toISOString().split('T')[0]}.pdf`);
            
            // Fechar menu
            document.getElementById('campaignExportMenu').classList.add('hidden');
            
            // Mostrar mensagem de sucesso
            alert('Relatório de Campanhas PDF gerado com sucesso!');
        }

        function exportCampaignsToExcel() {
            // Preparar dados para Excel
            const excelData = campaigns.map(campaign => ({
                'Campanha': campaign.name,
                'Cliente': campaign.client,
                'Canal': campaign.channel,
                'Período': campaign.period,
                'Orçamento (R$)': campaign.budget,
                'Gasto (R$)': campaign.spent,
                'Receita (R$)': campaign.revenue,
                'ROAS': campaign.roas,
                'ROI': campaign.roi,
                'Status': campaign.status,
                'Objetivo': campaign.objective || 'Não informado',
                'Orçamento Diário (R$)': campaign.dailyBudget || 0,
                'Localização': campaign.location || 'Não informado',
                'Público-Alvo': campaign.gender && campaign.ageMin && campaign.ageMax ? 
                    `${campaign.gender}, ${campaign.ageMin}-${campaign.ageMax} anos` : 'Não informado',
                'Palavras-chave': campaign.keywords || 'Não informado',
                'Observações': campaign.notes || 'Nenhuma'
            }));
            
            // Criar workbook
            const wb = XLSX.utils.book_new();
            
            // Criar worksheet principal
            const ws = XLSX.utils.json_to_sheet(excelData);
            
            // Configurar largura das colunas
            const colWidths = [
                { wch: 25 }, // Campanha
                { wch: 20 }, // Cliente
                { wch: 18 }, // Canal
                { wch: 18 }, // Período
                { wch: 15 }, // Orçamento
                { wch: 15 }, // Gasto
                { wch: 15 }, // Receita
                { wch: 10 }, // ROAS
                { wch: 10 }, // ROI
                { wch: 12 }, // Status
                { wch: 18 }, // Objetivo
                { wch: 18 }, // Orçamento Diário
                { wch: 20 }, // Localização
                { wch: 25 }, // Público-Alvo
                { wch: 30 }, // Palavras-chave
                { wch: 30 }  // Observações
            ];
            ws['!cols'] = colWidths;
            
            // Adicionar worksheet ao workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Campanhas');
            
            // Criar worksheet de resumo
            const totalCampaigns = campaigns.length;
            const activeCampaigns = campaigns.filter(c => c.status === 'Ativa').length;
            const pausedCampaigns = campaigns.filter(c => c.status === 'Pausada').length;
            const cancelledCampaigns = campaigns.filter(c => c.status === 'Cancelada').length;
            const optimizingCampaigns = campaigns.filter(c => c.status === 'Otimizando').length;
            const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
            const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
            const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
            const avgRoas = campaigns.length > 0 ? 
                (campaigns.reduce((sum, c) => sum + parseFloat(c.roas.replace('x', '')), 0) / campaigns.length).toFixed(1) : 0;
            
            const summaryData = [
                { 'Métrica': 'Total de Campanhas', 'Valor': totalCampaigns },
                { 'Métrica': 'Campanhas Ativas', 'Valor': activeCampaigns },
                { 'Métrica': 'Campanhas Pausadas', 'Valor': pausedCampaigns },
                { 'Métrica': 'Campanhas Canceladas', 'Valor': cancelledCampaigns },
                { 'Métrica': 'Campanhas Otimizando', 'Valor': optimizingCampaigns },
                { 'Métrica': 'Orçamento Total (R$)', 'Valor': totalBudget },
                { 'Métrica': 'Total Investido (R$)', 'Valor': totalSpent },
                { 'Métrica': 'Receita Total (R$)', 'Valor': totalRevenue },
                { 'Métrica': 'ROAS Médio', 'Valor': avgRoas + 'x' },
                { 'Métrica': 'ROI Total (%)', 'Valor': totalSpent > 0 ? (((totalRevenue - totalSpent) / totalSpent) * 100).toFixed(1) + '%' : '0%' }
            ];
            
            const summaryWs = XLSX.utils.json_to_sheet(summaryData);
            summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
            XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo Geral');
            
            // Criar worksheet por canal
            const channelStats = {};
            campaigns.forEach(campaign => {
                if (!channelStats[campaign.channel]) {
                    channelStats[campaign.channel] = {
                        count: 0,
                        budget: 0,
                        spent: 0,
                        revenue: 0,
                        active: 0
                    };
                }
                channelStats[campaign.channel].count++;
                channelStats[campaign.channel].budget += campaign.budget;
                channelStats[campaign.channel].spent += campaign.spent;
                channelStats[campaign.channel].revenue += campaign.revenue;
                if (campaign.status === 'Ativa') {
                    channelStats[campaign.channel].active++;
                }
            });
            
            const channelData = Object.keys(channelStats).map(channel => {
                const stats = channelStats[channel];
                const channelRoas = stats.spent > 0 ? (stats.revenue / stats.spent).toFixed(1) : 0;
                const channelRoi = stats.spent > 0 ? (((stats.revenue - stats.spent) / stats.spent) * 100).toFixed(1) : 0;
                
                return {
                    'Canal': channel,
                    'Total de Campanhas': stats.count,
                    'Campanhas Ativas': stats.active,
                    'Orçamento Total (R$)': stats.budget,
                    'Total Investido (R$)': stats.spent,
                    'Receita Total (R$)': stats.revenue,
                    'ROAS': channelRoas + 'x',
                    'ROI (%)': channelRoi + '%'
                };
            });
            
            const channelWs = XLSX.utils.json_to_sheet(channelData);
            channelWs['!cols'] = [
                { wch: 18 }, // Canal
                { wch: 18 }, // Total de Campanhas
                { wch: 18 }, // Campanhas Ativas
                { wch: 20 }, // Orçamento Total
                { wch: 20 }, // Total Investido
                { wch: 20 }, // Receita Total
                { wch: 12 }, // ROAS
                { wch: 12 }  // ROI
            ];
            XLSX.utils.book_append_sheet(wb, channelWs, 'Performance por Canal');
            
            // Criar worksheet por cliente
            const clientStats = {};
            campaigns.forEach(campaign => {
                if (!clientStats[campaign.client]) {
                    clientStats[campaign.client] = {
                        count: 0,
                        budget: 0,
                        spent: 0,
                        revenue: 0,
                        active: 0
                    };
                }
                clientStats[campaign.client].count++;
                clientStats[campaign.client].budget += campaign.budget;
                clientStats[campaign.client].spent += campaign.spent;
                clientStats[campaign.client].revenue += campaign.revenue;
                if (campaign.status === 'Ativa') {
                    clientStats[campaign.client].active++;
                }
            });
            
            const clientData = Object.keys(clientStats).map(client => {
                const stats = clientStats[client];
                const clientRoas = stats.spent > 0 ? (stats.revenue / stats.spent).toFixed(1) : 0;
                const clientRoi = stats.spent > 0 ? (((stats.revenue - stats.spent) / stats.spent) * 100).toFixed(1) : 0;
                
                return {
                    'Cliente': client,
                    'Total de Campanhas': stats.count,
                    'Campanhas Ativas': stats.active,
                    'Orçamento Total (R$)': stats.budget,
                    'Total Investido (R$)': stats.spent,
                    'Receita Total (R$)': stats.revenue,
                    'ROAS': clientRoas + 'x',
                    'ROI (%)': clientRoi + '%'
                };
            });
            
            const clientWs = XLSX.utils.json_to_sheet(clientData);
            clientWs['!cols'] = [
                { wch: 20 }, // Cliente
                { wch: 18 }, // Total de Campanhas
                { wch: 18 }, // Campanhas Ativas
                { wch: 20 }, // Orçamento Total
                { wch: 20 }, // Total Investido
                { wch: 20 }, // Receita Total
                { wch: 12 }, // ROAS
                { wch: 12 }  // ROI
            ];
            XLSX.utils.book_append_sheet(wb, clientWs, 'Performance por Cliente');
            
            // Gerar nome do arquivo com data
            const today = new Date();
            const fileName = `TrafficPro_Campanhas_${today.toISOString().split('T')[0]}.xlsx`;
            
            // Salvar arquivo
            XLSX.writeFile(wb, fileName);
            
            // Fechar menu
            document.getElementById('campaignExportMenu').classList.add('hidden');
            
            // Mostrar mensagem de sucesso
            alert('Planilha de Campanhas Excel gerada com sucesso!');
        }

        // Integration Management
        let integrationLogs = [];
        let platformConfigs = {
            google: { connected: true, campaigns: 47, todaySpend: 2847, lastSync: '2 min atrás' },
            meta: { connected: true, campaigns: 32, todaySpend: 1923, lastSync: '5 min atrás' },
            linkedin: { connected: true, campaigns: 18, todaySpend: 1245, lastSync: '1 min atrás' },
            tiktok: { connected: true, campaigns: 12, todaySpend: 892, lastSync: '3 min atrás' },
            youtube: { connected: true, campaigns: 8, todaySpend: 567, lastSync: '4 min atrás' },
            pinterest: { connected: true, campaigns: 6, todaySpend: 234, lastSync: '7 min atrás' },
            x: { connected: false, campaigns: 0, todaySpend: 0, lastSync: 'Nunca' },
            snapchat: { connected: false, campaigns: 0, todaySpend: 0, lastSync: 'Nunca' }
        };

        // Integration Modal Functions
        function openIntegrationModal() {
            document.getElementById('newIntegrationModal').classList.remove('hidden');
        }

        function closeNewIntegrationModal() {
            document.getElementById('newIntegrationModal').classList.add('hidden');
        }

        function selectPlatformForIntegration(platform) {
            closeNewIntegrationModal();
            configurePlatform(platform);
        }

        function configurePlatform(platform) {
            const platformData = {
                google: {
                    title: 'Configurar Google Ads',
                    subtitle: 'Configure sua integração com o Google Ads',
                    icon: 'fab fa-google text-red-600',
                    iconBg: 'bg-red-100'
                },
                meta: {
                    title: 'Configurar Meta Ads',
                    subtitle: 'Configure sua integração com Facebook e Instagram',
                    icon: 'fab fa-meta text-blue-600',
                    iconBg: 'bg-blue-100'
                },
                linkedin: {
                    title: 'Configurar LinkedIn Ads',
                    subtitle: 'Configure sua integração com LinkedIn para B2B',
                    icon: 'fab fa-linkedin text-blue-700',
                    iconBg: 'bg-blue-100'
                },
                tiktok: {
                    title: 'Configurar TikTok Ads',
                    subtitle: 'Configure sua integração com TikTok for Business',
                    icon: 'fab fa-tiktok text-black',
                    iconBg: 'bg-gray-100'
                },
                x: {
                    title: 'Configurar X Ads',
                    subtitle: 'Configure sua integração com X (Twitter) Ads',
                    icon: 'fab fa-x-twitter text-gray-800',
                    iconBg: 'bg-gray-100'
                },
                youtube: {
                    title: 'Configurar YouTube Ads',
                    subtitle: 'Configure sua integração com YouTube Advertising',
                    icon: 'fab fa-youtube text-red-600',
                    iconBg: 'bg-red-100'
                },
                pinterest: {
                    title: 'Configurar Pinterest Ads',
                    subtitle: 'Configure sua integração com Pinterest Business',
                    icon: 'fab fa-pinterest text-red-500',
                    iconBg: 'bg-red-100'
                },
                snapchat: {
                    title: 'Configurar Snapchat Ads',
                    subtitle: 'Configure sua integração com Snapchat Ads Manager',
                    icon: 'fab fa-snapchat text-yellow-400',
                    iconBg: 'bg-yellow-100'
                }
            };

            const config = platformData[platform];
            if (!config) return;

            // Update modal content
            document.getElementById('integrationTitle').textContent = config.title;
            document.getElementById('integrationSubtitle').textContent = config.subtitle;
            document.getElementById('integrationIcon').className = `w-12 h-12 ${config.iconBg} rounded-lg flex items-center justify-center`;
            document.getElementById('integrationIcon').innerHTML = `<i class="${config.icon} text-xl"></i>`;

            // Update status panel
            const platformConfig = platformConfigs[platform];
            if (platformConfig) {
                document.getElementById('statusBadge').textContent = platformConfig.connected ? 'Conectado' : 'Desconectado';
                document.getElementById('statusBadge').className = platformConfig.connected ? 
                    'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs' : 
                    'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
                document.getElementById('lastSyncTime').textContent = platformConfig.lastSync;
                document.getElementById('campaignCount').textContent = platformConfig.campaigns;
                document.getElementById('todaySpend').textContent = `R$ ${platformConfig.todaySpend.toLocaleString()}`;
            }

            // Store current platform
            window.currentPlatform = platform;

            // Show modal
            document.getElementById('integrationModal').classList.remove('hidden');

            // Load recent activity
            loadRecentActivity(platform);
            loadAccounts();
        }

        function closeIntegrationModal() {
            document.getElementById('integrationModal').classList.add('hidden');
        }

        function connectPlatform(platform) {
            // Simulate connection process
            showLoadingState(`Conectando com ${platform}...`);
            
            setTimeout(() => {
                platformConfigs[platform].connected = true;
                platformConfigs[platform].lastSync = 'Agora';
                
                addIntegrationLog(platform, 'Conexão', `Plataforma ${platform} conectada com sucesso`);
                updateIntegrationStats();
                hideLoadingState();
                
                alert(`${platform} conectado com sucesso!`);
                
                // Refresh the integrations section if visible
                if (!document.getElementById('integrations-section').classList.contains('hidden')) {
                    location.reload(); // Simple refresh for demo
                }
            }, 2000);
        }

        function syncPlatform(platform) {
            showLoadingState(`Sincronizando ${platform}...`);
            
            setTimeout(() => {
                platformConfigs[platform].lastSync = 'Agora';
                
                // Simulate some data changes
                const oldCampaigns = platformConfigs[platform].campaigns;
                platformConfigs[platform].campaigns = oldCampaigns + Math.floor(Math.random() * 3);
                
                addIntegrationLog(platform, 'Sincronização', `${platformConfigs[platform].campaigns - oldCampaigns} novas campanhas sincronizadas`);
                updateIntegrationStats();
                hideLoadingState();
                
                alert(`${platform} sincronizado com sucesso!`);
            }, 1500);
        }

        function syncAllPlatforms() {
            showLoadingState('Sincronizando todas as plataformas...');
            
            setTimeout(() => {
                Object.keys(platformConfigs).forEach(platform => {
                    if (platformConfigs[platform].connected) {
                        platformConfigs[platform].lastSync = 'Agora';
                    }
                });
                
                addIntegrationLog('all', 'Sincronização Geral', 'Todas as plataformas foram sincronizadas');
                updateIntegrationStats();
                hideLoadingState();
                
                alert('Todas as plataformas foram sincronizadas com sucesso!');
            }, 3000);
        }

        function testConnection() {
            const platform = window.currentPlatform;
            showLoadingState('Testando conexão...');
            
            setTimeout(() => {
                hideLoadingState();
                
                if (platformConfigs[platform].connected) {
                    alert('✅ Conexão testada com sucesso! A integração está funcionando corretamente.');
                    addIntegrationLog(platform, 'Teste', 'Teste de conexão realizado com sucesso');
                } else {
                    alert('❌ Falha no teste de conexão. Verifique suas credenciais.');
                    addIntegrationLog(platform, 'Erro', 'Falha no teste de conexão');
                }
            }, 2000);
        }

        function syncNow() {
            const platform = window.currentPlatform;
            syncPlatform(platform);
        }

        function pauseSync() {
            const platform = window.currentPlatform;
            addIntegrationLog(platform, 'Pausa', 'Sincronização pausada pelo usuário');
            alert(`Sincronização do ${platform} pausada.`);
        }

        function resetConnection() {
            const platform = window.currentPlatform;
            if (confirm(`Tem certeza que deseja resetar a conexão com ${platform}? Isso irá desconectar a plataforma.`)) {
                platformConfigs[platform].connected = false;
                platformConfigs[platform].lastSync = 'Nunca';
                platformConfigs[platform].campaigns = 0;
                platformConfigs[platform].todaySpend = 0;
                
                addIntegrationLog(platform, 'Reset', 'Conexão resetada pelo usuário');
                updateIntegrationStats();
                
                alert(`Conexão com ${platform} foi resetada.`);
                closeIntegrationModal();
            }
        }

        function saveIntegrationConfig() {
            const platform = window.currentPlatform;
            
            // Get form data
            const config = {
                clientId: document.getElementById('clientId').value,
                clientSecret: document.getElementById('clientSecret').value,
                accessToken: document.getElementById('accessToken').value,
                syncFrequency: document.getElementById('syncFrequency').value,
                syncCampaigns: document.getElementById('syncCampaigns').checked,
                syncMetrics: document.getElementById('syncMetrics').checked,
                syncBudgets: document.getElementById('syncBudgets').checked,
                syncConversions: document.getElementById('syncConversions').checked,
                autoOptimization: document.getElementById('autoOptimization').checked,
                alertsEnabled: document.getElementById('alertsEnabled').checked,
                budgetAlerts: document.getElementById('budgetAlerts').checked,
                dailySpendLimit: document.getElementById('dailySpendLimit').value
            };
            
            // Validate required fields
            if (!config.clientId || !config.clientSecret) {
                alert('Por favor, preencha pelo menos o Client ID e Client Secret.');
                return;
            }
            
            // Save configuration (in a real app, this would be sent to the server)
            addIntegrationLog(platform, 'Configuração', 'Configurações salvas com sucesso');
            
            alert('Configurações salvas com sucesso!');
        }

        function connectIntegration() {
            const platform = window.currentPlatform;
            connectPlatform(platform);
        }

        function loadAccounts() {
            const platform = window.currentPlatform;
            const accountsList = document.getElementById('accountsList');
            
            // Simulate loading accounts
            accountsList.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Carregando contas...</div>';
            
            setTimeout(() => {
                const mockAccounts = {
                    google: [
                        { id: '123-456-7890', name: 'Conta Principal Google Ads', status: 'Ativa' },
                        { id: '098-765-4321', name: 'Conta Secundária', status: 'Ativa' }
                    ],
                    meta: [
                        { id: 'act_1234567890', name: 'Conta Business Principal', status: 'Ativa' },
                        { id: 'act_0987654321', name: 'Conta E-commerce', status: 'Ativa' }
                    ],
                    linkedin: [
                        { id: '12345678', name: 'Conta Corporativa', status: 'Ativa' }
                    ]
                };
                
                const accounts = mockAccounts[platform] || [];
                
                if (accounts.length === 0) {
                    accountsList.innerHTML = '<div class="text-center py-4 text-gray-500">Nenhuma conta encontrada</div>';
                    return;
                }
                
                accountsList.innerHTML = accounts.map(account => `
                    <div class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div>
                            <p class="font-medium">${account.name}</p>
                            <p class="text-sm text-gray-500">ID: ${account.id}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">${account.status}</span>
                            <input type="checkbox" checked class="rounded">
                        </div>
                    </div>
                `).join('');
            }, 1000);
        }

        function loadRecentActivity(platform) {
            const recentActivity = document.getElementById('recentActivity');
            
            const mockActivities = [
                { time: '2 min atrás', action: 'Sincronização automática concluída' },
                { time: '15 min atrás', action: '3 novas campanhas detectadas' },
                { time: '1 hora atrás', action: 'Orçamento atualizado automaticamente' },
                { time: '2 horas atrás', action: 'Alerta de performance enviado' }
            ];
            
            recentActivity.innerHTML = mockActivities.map(activity => `
                <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                        <p class="text-gray-800">${activity.action}</p>
                        <p class="text-gray-500 text-xs">${activity.time}</p>
                    </div>
                </div>
            `).join('');
        }

        function addIntegrationLog(platform, action, description) {
            const log = {
                id: Date.now(),
                platform: platform,
                action: action,
                description: description,
                timestamp: new Date(),
                user: 'Admin User'
            };
            
            integrationLogs.unshift(log);
            updateIntegrationLog();
        }

        function updateIntegrationLog() {
            const logContainer = document.getElementById('integrationLog');
            
            if (integrationLogs.length === 0) {
                logContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Nenhuma atividade registrada</div>';
                return;
            }
            
            logContainer.innerHTML = integrationLogs.slice(0, 20).map(log => {
                const platformIcons = {
                    google: 'fab fa-google text-red-600',
                    meta: 'fab fa-meta text-blue-600',
                    linkedin: 'fab fa-linkedin text-blue-700',
                    tiktok: 'fab fa-tiktok text-black',
                    x: 'fab fa-x-twitter text-gray-800',
                    youtube: 'fab fa-youtube text-red-600',
                    pinterest: 'fab fa-pinterest text-red-500',
                    snapchat: 'fab fa-snapchat text-yellow-400',
                    all: 'fas fa-globe text-blue-600'
                };
                
                const actionColors = {
                    'Conexão': 'text-green-600',
                    'Sincronização': 'text-blue-600',
                    'Erro': 'text-red-600',
                    'Configuração': 'text-purple-600',
                    'Teste': 'text-orange-600',
                    'Pausa': 'text-yellow-600',
                    'Reset': 'text-red-600'
                };
                
                return `
                    <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <i class="${platformIcons[log.platform] || 'fas fa-question text-gray-600'} text-sm"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-2">
                                <span class="font-medium ${actionColors[log.action] || 'text-gray-600'}">${log.action}</span>
                                <span class="text-gray-400">•</span>
                                <span class="text-sm text-gray-500">${log.timestamp.toLocaleTimeString('pt-BR')}</span>
                            </div>
                            <p class="text-sm text-gray-700 mt-1">${log.description}</p>
                            <p class="text-xs text-gray-500 mt-1">Por ${log.user}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updateIntegrationStats() {
            const connected = Object.values(platformConfigs).filter(p => p.connected).length;
            const pending = Object.values(platformConfigs).filter(p => !p.connected).length;
            const totalCampaigns = Object.values(platformConfigs).reduce((sum, p) => sum + p.campaigns, 0);
            
            document.getElementById('connectedPlatforms').textContent = connected;
            document.getElementById('pendingPlatforms').textContent = pending;
            document.getElementById('syncedCampaigns').textContent = totalCampaigns;
            document.getElementById('lastSync').textContent = 'Agora';
        }

        function clearIntegrationLog() {
            if (confirm('Tem certeza que deseja limpar todo o log de atividades?')) {
                integrationLogs = [];
                updateIntegrationLog();
                alert('Log de atividades limpo com sucesso!');
            }
        }

        function showLoadingState(message) {
            // Create loading overlay
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <i class="fas fa-spinner fa-spin text-blue-600 text-xl"></i>
                    <span class="text-gray-700">${message}</span>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        function hideLoadingState() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.remove();
            }
        }

        // Dark Mode Toggle
        function toggleDarkMode() {
            const html = document.documentElement;
            const themeIcon = document.getElementById('theme-icon');
            const themeText = document.getElementById('theme-text');
            
            if (html.classList.contains('dark')) {
                // Switch to light mode
                html.classList.remove('dark');
                themeIcon.className = 'fas fa-moon mr-2';
                themeText.textContent = 'Modo Escuro';
                localStorage.setItem('theme', 'light');
            } else {
                // Switch to dark mode
                html.classList.add('dark');
                themeIcon.className = 'fas fa-sun mr-2';
                themeText.textContent = 'Modo Claro';
                localStorage.setItem('theme', 'dark');
            }
        }

        // Initialize theme on page load
        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const html = document.documentElement;
            const themeIcon = document.getElementById('theme-icon');
            const themeText = document.getElementById('theme-text');
            
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                html.classList.add('dark');
                themeIcon.className = 'fas fa-sun mr-2';
                themeText.textContent = 'Modo Claro';
            } else {
                html.classList.remove('dark');
                themeIcon.className = 'fas fa-moon mr-2';
                themeText.textContent = 'Modo Escuro';
            }
        }

        // Initialize Charts
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize theme
            initializeTheme();
            // Initialize clients list
            updateClientsList();
            updateCampaignsList();
            updateClientOptions();
            
            // Initialize reports
            updateIndividualCampaignsTable();
            updateReportsHistory();
            updateReportsStatistics();
            
            // Initialize integration logs with some sample data
            addIntegrationLog('google', 'Sincronização', 'Sincronização automática concluída - 47 campanhas atualizadas');
            addIntegrationLog('meta', 'Sincronização', 'Dados do Facebook e Instagram sincronizados');
            addIntegrationLog('linkedin', 'Configuração', 'Configurações de orçamento atualizadas');
            addIntegrationLog('tiktok', 'Sincronização', 'Novas métricas de vídeo importadas');
            addIntegrationLog('youtube', 'Teste', 'Teste de conexão realizado com sucesso');
            
            // Update integration stats
            updateIntegrationStats();
            
            // Populate filter dropdowns
            const clientFilter = document.getElementById('campaignFilterClient');
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.name;
                option.textContent = client.name;
                clientFilter.appendChild(option);
            });
            
            // Add event listeners for filters
            document.getElementById('campaignFilterClient').addEventListener('change', updateIndividualCampaignsTable);
            document.getElementById('campaignFilterStatus').addEventListener('change', updateIndividualCampaignsTable);
            
            // Initialize mini charts
            initializeMiniCharts();
            // Channel Performance Chart
            const channelCtx = document.getElementById('channelChart').getContext('2d');
            new Chart(channelCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Instagram Ads'],
                    datasets: [{
                        data: [35, 30, 20, 15],
                        backgroundColor: ['#FF6B35', '#4267B2', '#0077B5', '#E1306C'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // ROI Chart
            const roiCtx = document.getElementById('roiChart').getContext('2d');
            new Chart(roiCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Investimento',
                        data: [12000, 15000, 18000, 16000, 20000, 18000],
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: false,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }, {
                        label: 'Retorno',
                        data: [38400, 57000, 73800, 62400, 90000, 75600],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': R$ ' + context.parsed.y.toLocaleString('pt-BR');
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            position: 'left',
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + (value / 1000).toLocaleString('pt-BR') + 'k';
                                },
                                color: '#6B7280',
                                font: {
                                    size: 11
                                }
                            },
                            title: {
                                display: true,
                                text: 'Valores (R$)',
                                color: '#374151',
                                font: {
                                    size: 12,
                                    weight: '600'
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 11,
                                    weight: '500'
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            // Budget Chart
            const budgetCtx = document.getElementById('budgetChart').getContext('2d');
            new Chart(budgetCtx, {
                type: 'bar',
                data: {
                    labels: ['Loja Fashion', 'TechCorp', 'E-commerce Plus'],
                    datasets: [{
                        label: 'Orçamento',
                        data: [15000, 25000, 8000],
                        backgroundColor: ['#8B5CF6', '#06B6D4', '#F59E0B'],
                        borderRadius: 8,
                        borderSkipped: false
                    }, {
                        label: 'Gasto',
                        data: [12000, 18000, 5000],
                        backgroundColor: ['#A855F7', '#0891B2', '#D97706'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': R$ ' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + (value / 1000) + 'k';
                                },
                                color: '#6B7280',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 11,
                                    weight: '500'
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            // Conversions Chart
            const conversionsCtx = document.getElementById('conversionsChart').getContext('2d');
            new Chart(conversionsCtx, {
                type: 'bar',
                data: {
                    labels: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads'],
                    datasets: [{
                        label: 'Conversões',
                        data: [487, 428, 156],
                        backgroundColor: ['#8B5CF6', '#06B6D4', '#F59E0B'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' conversões';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString();
                                },
                                color: '#6B7280',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 11,
                                    weight: '500'
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            // CTR Chart
            const ctrCtx = document.getElementById('ctrChart').getContext('2d');
            new Chart(ctrCtx, {
                type: 'line',
                data: {
                    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                    datasets: [{
                        label: 'CTR (%)',
                        data: [3.2, 3.8, 4.1, 3.9],
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });