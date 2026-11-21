import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_RENTALS,
  INITIAL_INSPECTIONS
} from '../data/mockData';

const AppContext = createContext();

// Template padrão para os 15 itens de manutenção do veículo
export const DEFAULT_MAINTENANCE = {
  oleo: '',
  correiaDentada: '',
  filtros: '', // Filtros (Cab. e Ar)
  pastilhasFreio: '',
  discos: '',
  cabosVelas: '',
  velas: '',
  bobina: '',
  embreagem: '',
  amortecedoresDianteiros: '',
  amortecedoresTraseiros: '',
  radiador: '',
  freio: '',
  bombaAgua: '',
  valvulaTermostatica: ''
};

export function AppProvider({ children }) {
  useEffect(() => {
    localStorage.removeItem('autogestao_vehicles');
    localStorage.removeItem('autogestao_drivers');
    localStorage.removeItem('autogestao_rentals');
    localStorage.removeItem('autogestao_inspections');
  }, []);

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('psg_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('psg_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('psg_contracts');
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  const [inspections, setInspections] = useState(() => {
    const saved = localStorage.getItem('psg_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('psg_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('psg_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('psg_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('psg_inspections', JSON.stringify(inspections));
  }, [inspections]);

  const notify = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // --- CRUD VEÍCULOS ---
  const addVehicle = (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: `v-${Date.now()}`,
      kmAtual: Number(vehicle.kmAtual) || 0,
      valorMensal: Number(vehicle.valorMensal) || 0,
      ano: Number(vehicle.ano) || new Date().getFullYear(),
      renavam: vehicle.renavam || '',
      ipvaPagoEm: vehicle.ipvaPagoEm || new Date().getFullYear().toString(),
      status: vehicle.status || 'Disponível',
      foto: vehicle.foto || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      manutencoes: vehicle.manutencoes || { ...DEFAULT_MAINTENANCE }
    };
    setVehicles(prev => [newVehicle, ...prev]);
    notify(`Veículo ${newVehicle.marca} ${newVehicle.modelo} (${newVehicle.placa}) cadastrado com sucesso!`);
    return newVehicle;
  };

  const updateVehicle = (id, updatedFields) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updatedFields } : v)));
    notify('Dados do veículo atualizados com sucesso!');
  };

  const updateVehicleMaintenance = (id, manutencoes) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, manutencoes: { ...(v.manutencoes || DEFAULT_MAINTENANCE), ...manutencoes } } : v)));
    notify('Ficha de manutenções do veículo atualizada com sucesso!');
  };

  const deleteVehicle = (id) => {
    const hasActiveContract = contracts.some(c => c.veiculoId === id && c.status === 'Ativo');
    if (hasActiveContract) {
      notify('Não é possível excluir um veículo com contrato mensal ativo!', 'error');
      return false;
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
    notify('Veículo removido com sucesso.');
    return true;
  };

  // --- CRUD MOTORISTAS (Apenas CNH B) ---
  const addDriver = (driver) => {
    const newDriver = {
      ...driver,
      id: `m-${Date.now()}`,
      categoriaCnh: 'B',
      status: driver.status || 'Ativo'
    };
    setDrivers(prev => [newDriver, ...prev]);
    notify(`Motorista ${newDriver.nome} cadastrado com sucesso!`);
    return newDriver;
  };

  const updateDriver = (id, updatedFields) => {
    setDrivers(prev => prev.map(d => (d.id === id ? { ...d, ...updatedFields, categoriaCnh: 'B' } : d)));
    notify('Dados do motorista atualizados com sucesso!');
  };

  const deleteDriver = (id) => {
    const hasActiveContract = contracts.some(c => c.motoristaId === id && c.status === 'Ativo');
    if (hasActiveContract) {
      notify('Não é possível remover motorista com contrato ativo.', 'error');
      return false;
    }
    setDrivers(prev => prev.filter(d => d.id !== id));
    notify('Motorista removido com sucesso.');
    return true;
  };

  // --- CRUD CONTRATOS MENSAIS ---
  const createContract = (contractData) => {
    const newContractId = `ctr-${Date.now()}`;
    const newCode = `PSG-CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newContract = {
      id: newContractId,
      numeroContrato: newCode,
      ...contractData,
      status: 'Ativo'
    };

    updateVehicle(contractData.veiculoId, {
      status: 'Alugado',
      kmAtual: Number(contractData.kmInicial)
    });

    setContracts(prev => [newContract, ...prev]);
    notify(`Contrato mensal ${newCode} gerado e ativado com sucesso!`);
    return newContract;
  };

  const finishContract = (contractId, { kmFinal, dataEncerramento, vistoriaDevolucaoId, observacoesEncerramento }) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    const updatedContract = {
      ...contract,
      status: 'Encerrado',
      kmFinal: Number(kmFinal),
      dataEncerramento: dataEncerramento || new Date().toISOString(),
      vistoriaDevolucaoId: vistoriaDevolucaoId || null,
      observacoesEncerramento: observacoesEncerramento || ''
    };

    setContracts(prev => prev.map(c => (c.id === contractId ? updatedContract : c)));

    updateVehicle(contract.veiculoId, {
      status: 'Disponível',
      kmAtual: Number(kmFinal)
    });

    notify(`Contrato ${contract.numeroContrato} encerrado. Veículo devolvido ao pátio.`);
  };

  const cancelContract = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    setContracts(prev => prev.map(c => (c.id === contractId ? { ...c, status: 'Cancelado' } : c)));
    updateVehicle(contract.veiculoId, { status: 'Disponível' });
    notify(`Contrato ${contract.numeroContrato} cancelado.`);
  };

  // --- CRUD VISTORIAS ---
  const addInspection = (inspectionData) => {
    const newInspection = {
      ...inspectionData,
      id: `vis-${Date.now()}`,
      codigo: `PSG-VIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      dataHora: inspectionData.dataHora || new Date().toISOString()
    };

    setInspections(prev => [newInspection, ...prev]);

    if (newInspection.resultado === 'Reprovado') {
      updateVehicle(newInspection.veiculoId, { status: 'Em Manutenção' });
    } else if (newInspection.tipo === 'Devolução') {
      if (newInspection.odometro) {
        updateVehicle(newInspection.veiculoId, { kmAtual: Number(newInspection.odometro) });
      }
    }

    notify(`Laudo de Vistoria ${newInspection.codigo} emitido com sucesso!`);
    return newInspection;
  };

  const updateInspection = (id, updatedFields) => {
    setInspections(prev => prev.map(i => (i.id === id ? { ...i, ...updatedFields } : i)));
    notify('Vistoria atualizada.');
  };

  const getVehicleById = (id) => vehicles.find(v => v.id === id);
  const getDriverById = (id) => drivers.find(d => d.id === id);
  const getContractById = (id) => contracts.find(c => c.id === id);
  const getInspectionById = (id) => inspections.find(i => i.id === id);

  const getInspectionsForVehicle = (vehicleId) =>
    inspections.filter(i => i.veiculoId === vehicleId).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

  const getContractsForVehicle = (vehicleId) =>
    contracts.filter(c => c.veiculoId === vehicleId).sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio));

  const getContractsForDriver = (driverId) =>
    contracts.filter(c => c.motoristaId === driverId).sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio));

  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'Disponível').length,
    rentedVehicles: vehicles.filter(v => v.status === 'Alugado').length,
    inMaintenanceVehicles: vehicles.filter(v => v.status === 'Em Manutenção').length,
    inInspectionVehicles: vehicles.filter(v => v.status === 'Em Vistoria').length,
    activeContracts: contracts.filter(c => c.status === 'Ativo').length,
    closedContracts: contracts.filter(c => c.status === 'Encerrado').length,
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'Ativo').length,
    blockedDrivers: drivers.filter(d => d.status === 'Bloqueado').length,
    totalInspections: inspections.length,

    monthlyRecurringRevenue: contracts
      .filter(c => c.status === 'Ativo')
      .reduce((acc, curr) => acc + (Number(curr.valorMensal) || 0), 0),

    cnhAlerts: drivers.filter(d => {
      if (!d.validadeCnh) return false;
      const validade = new Date(d.validadeCnh);
      const hoje = new Date();
      const diffDays = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }),

    expiringContracts: contracts.filter(c => {
      if (c.status !== 'Ativo' || !c.dataTermino) return false;
      const termino = new Date(c.dataTermino);
      const hoje = new Date();
      const diffDays = Math.ceil((termino - hoje) / (1000 * 60 * 60 * 24));
      return diffDays <= 15;
    })
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        drivers,
        contracts,
        rentals: contracts,
        inspections,
        currentView,
        setCurrentView,
        notification,
        notify,
        addVehicle,
        updateVehicle,
        updateVehicleMaintenance,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        createContract,
        createRental: createContract,
        finishContract,
        finishRental: finishContract,
        cancelContract,
        cancelRental: cancelContract,
        addInspection,
        updateInspection,
        getVehicleById,
        getDriverById,
        getContractById,
        getRentalById: getContractById,
        getInspectionById,
        getInspectionsForVehicle,
        getContractsForVehicle,
        getRentalsForVehicle: getContractsForVehicle,
        getContractsForDriver,
        getRentalsForDriver: getContractsForDriver,
        stats
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
