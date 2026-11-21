import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Navigation } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { VehicleList } from './components/vehicles/VehicleList';
import { VehicleDetailModal } from './components/vehicles/VehicleDetailModal';
import { VehicleFormModal } from './components/vehicles/VehicleFormModal';
import { DriverList } from './components/drivers/DriverList';
import { DriverFormModal } from './components/drivers/DriverFormModal';
import { DriverDetailModal } from './components/drivers/DriverDetailModal';
import { RentalList } from './components/rentals/RentalList';
import { NewRentalModal } from './components/rentals/NewRentalModal';
import { ReturnRentalModal } from './components/rentals/ReturnRentalModal';
import { InspectionList } from './components/inspections/InspectionList';
import { InspectionModal } from './components/inspections/InspectionModal';
import { InspectionReportModal } from './components/inspections/InspectionReportModal';
import { ReportsView } from './components/reports/ReportsView';

export default function App() {
  const { currentView } = useApp();

  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState(null);

  const [isDriverFormOpen, setIsDriverFormOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);
  const [selectedDriverForDetail, setSelectedDriverForDetail] = useState(null);

  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [rentalToReturn, setRentalToReturn] = useState(null);

  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [preselectedVehicleForInspection, setPreselectedVehicleForInspection] = useState(null);
  const [selectedInspectionForReport, setSelectedInspectionForReport] = useState(null);

  const handleOpenNewVehicle = () => {
    setVehicleToEdit(null);
    setIsVehicleFormOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsVehicleFormOpen(true);
  };

  const handleOpenNewDriver = () => {
    setDriverToEdit(null);
    setIsDriverFormOpen(true);
  };

  const handleEditDriver = (driver) => {
    setDriverToEdit(driver);
    setIsDriverFormOpen(true);
  };

  const handleOpenNewInspection = (vehicle = null) => {
    setPreselectedVehicleForInspection(vehicle);
    setIsInspectionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onOpenNewRental={() => setIsNewRentalOpen(true)}
        onOpenNewInspection={() => handleOpenNewInspection(null)}
      />

      {/* Main Tabbed Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <Dashboard
            onOpenNewRental={() => setIsNewRentalOpen(true)}
            onOpenNewInspection={() => handleOpenNewInspection(null)}
            onOpenNewVehicle={handleOpenNewVehicle}
            onOpenNewDriver={handleOpenNewDriver}
            onOpenReturnRental={(rental) => setRentalToReturn(rental)}
            onSelectInspection={(ins) => setSelectedInspectionForReport(ins)}
          />
        )}

        {currentView === 'vehicles' && (
          <VehicleList
            onOpenNewVehicle={handleOpenNewVehicle}
            onEditVehicle={handleEditVehicle}
            onSelectVehicle={(v) => setSelectedVehicleForDetail(v)}
            onOpenNewInspectionForVehicle={(v) => handleOpenNewInspection(v)}
          />
        )}

        {currentView === 'drivers' && (
          <DriverList
            onOpenNewDriver={handleOpenNewDriver}
            onEditDriver={handleEditDriver}
            onSelectDriver={(d) => setSelectedDriverForDetail(d)}
          />
        )}

        {currentView === 'rentals' && (
          <RentalList
            onOpenNewRental={() => setIsNewRentalOpen(true)}
            onOpenReturnRental={(rental) => setRentalToReturn(rental)}
            onSelectInspection={(ins) => setSelectedInspectionForReport(ins)}
            onSelectVehicle={(v) => setSelectedVehicleForDetail(v)}
            onSelectDriver={(d) => setSelectedDriverForDetail(d)}
          />
        )}

        {currentView === 'inspections' && (
          <InspectionList
            onOpenNewInspection={() => handleOpenNewInspection(null)}
            onSelectInspection={(ins) => setSelectedInspectionForReport(ins)}
            onSelectVehicle={(v) => setSelectedVehicleForDetail(v)}
          />
        )}

        {currentView === 'reports' && <ReportsView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Sistema de Gerenciamento de Locação de Veículos PSG</span>
          <span className="text-[11px] text-slate-400">© 2026 PSG Locadora. Todos os direitos reservados.</span>
        </div>
      </footer>

      {/* Modals */}
      <VehicleFormModal
        isOpen={isVehicleFormOpen}
        onClose={() => setIsVehicleFormOpen(false)}
        vehicleToEdit={vehicleToEdit}
      />

      <VehicleDetailModal
        vehicle={selectedVehicleForDetail}
        isOpen={Boolean(selectedVehicleForDetail)}
        onClose={() => setSelectedVehicleForDetail(null)}
        onOpenNewInspectionForVehicle={(v) => handleOpenNewInspection(v)}
        onSelectInspection={(ins) => setSelectedInspectionForReport(ins)}
      />

      <DriverFormModal
        isOpen={isDriverFormOpen}
        onClose={() => setIsDriverFormOpen(false)}
        driverToEdit={driverToEdit}
      />

      <DriverDetailModal
        driver={selectedDriverForDetail}
        isOpen={Boolean(selectedDriverForDetail)}
        onClose={() => setSelectedDriverForDetail(null)}
      />

      <NewRentalModal
        isOpen={isNewRentalOpen}
        onClose={() => setIsNewRentalOpen(false)}
      />

      <ReturnRentalModal
        rental={rentalToReturn}
        isOpen={Boolean(rentalToReturn)}
        onClose={() => setRentalToReturn(null)}
      />

      <InspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        preselectedVehicle={preselectedVehicleForInspection}
      />

      <InspectionReportModal
        inspection={selectedInspectionForReport}
        isOpen={Boolean(selectedInspectionForReport)}
        onClose={() => setSelectedInspectionForReport(null)}
      />
    </div>
  );
}
