
import React from 'react';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

export default ToggleSwitch;
