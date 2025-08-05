import React, { useState } from 'react';
import Board from './components/Board/Board';
import Layout from './components/Layout/Layout';
import FloatingAddTaskButton from './components/UI/FloatingAddTaskButton';
import FloatingSearchButton from './components/UI/FloatingSearchButton';
import { ToastProvider } from './context/ToastContext';

//---------------------------------------------------------------- App Component ------------------------------------------------------//
const App: React.FC = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  
  // Function to open the add task modal
  const handleAddTask = () => {
    setIsAddTaskModalOpen(true);
  };
  
  return (
    <ToastProvider>
      <Layout>
        <Board 
          isAddTaskModalOpen={isAddTaskModalOpen}
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
        />
      </Layout>
      
      {/* Floating buttons for mobile */}
      <div className="sm:hidden">
        <FloatingAddTaskButton onAddTask={handleAddTask} />
        <FloatingSearchButton />
      </div>
    </ToastProvider>
  );
};

export default App;
